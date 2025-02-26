import { getQueueToken } from '@nestjs/bullmq';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RegistrationFormHistoryEntity } from '@db/entity';
import { QueueEnum } from '@enums';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import { RegistrationFormHistoryService } from '@gateway/services';
import {
  SigDatamagineService,
  SigOtpService,
} from '@services/rest/sig/services';
import {
  testDates,
  testNames,
  testPhoneNumbers,
  testPINs,
} from '@test/enums/data-for-inputs-enums';

import { Queue } from 'bullmq';
import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { gatewayErrorMessages } from './enums/messages-enums';
import { verifyOtpFixtureWithTemporalUsername } from './mocks/fixtures/sig';
import { cookieCaptchaTokenHelper, extractGqlResponse } from './helpers';
import {
  completeRegistrationMutation,
  registerUserEkycMutation,
  uploadRegistrationFormMutation,
  uploadRegistrationFormMutationFinalFixture,
  verifyOtpMutation,
} from './mutations';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Registration form upload (e2e)', () => {
  let app: INestApplication;
  let sigOtpService: SigOtpService;
  let sigDatamagineService: SigDatamagineService;
  let registrationFormHistoryService: RegistrationFormHistoryService;
  let registrationFormHistoryReposity: Repository<RegistrationFormHistoryEntity>;
  let captchaCookie: string[];
  let queue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    app.use(graphqlUploadExpress());

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(
      app.get(TypeScriptExceptionFilter),
      app.get(AxiosExceptionFilter),
      app.get(HttpExceptionFilter),
    );

    await app.init();

    registrationFormHistoryReposity = moduleFixture.get<
      Repository<RegistrationFormHistoryEntity>
    >(getRepositoryToken(RegistrationFormHistoryEntity));

    queue = moduleFixture.get<Queue>(
      getQueueToken(QueueEnum.UPLOAD_REGISTRATION_FORM_QUEUE),
    );

    sigOtpService = app.get<SigOtpService>(SigOtpService);
    sigDatamagineService = app.get<SigDatamagineService>(SigDatamagineService);
    registrationFormHistoryService = app.get<RegistrationFormHistoryService>(
      RegistrationFormHistoryService,
    );

    captchaCookie = await cookieCaptchaTokenHelper(app.getHttpServer(), gql);
  });

  beforeEach(async () => {
    await registrationFormHistoryReposity.delete({});
    await queue.obliterate({ force: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await registrationFormHistoryReposity.delete({});
    await queue.obliterate({ force: true });
    await app.close();
  });

  it('Should upload registration form after RegisterUserEkyc', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    const imagePath = join(__dirname, '/assets/registration.jpg');

    const uploadImageResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadRegistrationFormMutation,
          variables: { somefile: null },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(
      extractGqlResponse(uploadImageResponse, 'uploadRegistrationForm'),
    ).toEqual(uploadRegistrationFormMutationFinalFixture);

    const registrationFormHistoryRecord =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    expect(registrationFormHistoryRecord).toBeDefined();
    expect(registrationFormHistoryRecord.temporary_username).toBe('OI00217493');
    expect(registrationFormHistoryRecord.image).toBeDefined();
    expect(registrationFormHistoryRecord.client_ip).toBeDefined();
    expect(registrationFormHistoryRecord.device_id).toBeDefined();
    expect(registrationFormHistoryRecord.user_agent).toBeDefined();
    expect(registrationFormHistoryRecord.username).toBeNull();
  });

  it('Should not upload registration form after RegisterUserEkyc with incorrect mimetype', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    const imagePath = join(__dirname, '/assets/driving_license.png');

    const uploadImageResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadRegistrationFormMutation,
          variables: { somefile: null },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(uploadImageResponse.body.errors[0]).toBeDefined();
    expect(uploadImageResponse.body.errors[0].message).toBe(
      gatewayErrorMessages.extensionError,
    );
    expect(uploadImageResponse.body.data).toBeNull();
  });

  it('Should save final username after successful complete registration', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    const imagePath = join(__dirname, '/assets/registration.jpg');

    const uploadImageResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadRegistrationFormMutation,
          variables: { somefile: null },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(
      extractGqlResponse(uploadImageResponse, 'uploadRegistrationForm'),
    ).toEqual(uploadRegistrationFormMutationFinalFixture);

    const registrationFormHistoryRecord =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    expect(registrationFormHistoryRecord).toBeDefined();
    expect(registrationFormHistoryRecord.temporary_username).toBe('OI00217493');
    expect(registrationFormHistoryRecord.image).toBeDefined();

    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValueOnce(verifyOtpFixtureWithTemporalUsername);

    //cancel deletion to check data in db for this test case
    jest
      .spyOn(registrationFormHistoryReposity, 'delete')
      .mockResolvedValueOnce(null);

    const findOneByTemporaryUsernameSpy = jest.spyOn(
      registrationFormHistoryService,
      'findOneByTemporaryUsername',
    );

    //verifyOtp
    const verifyOtpResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .send({
        query: verifyOtpMutation,
      });

    const verifyOtpResponseCookie = verifyOtpResponse.headers['set-cookie'];

    // complete registration
    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', verifyOtpResponseCookie)
      .send({
        query: completeRegistrationMutation(
          testNames.defaultDeviceId,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(findOneByTemporaryUsernameSpy).toHaveBeenCalledTimes(2);

    const registrationFormHistoryRecordAfterCompleteRegistration =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    expect(
      registrationFormHistoryRecordAfterCompleteRegistration,
    ).toBeDefined();
    expect(
      registrationFormHistoryRecordAfterCompleteRegistration.temporary_username,
    ).toBe('OI00217493');
    expect(
      registrationFormHistoryRecordAfterCompleteRegistration.image,
    ).toBeDefined();
    expect(
      registrationFormHistoryRecordAfterCompleteRegistration.client_ip,
    ).toBeDefined();
    expect(
      registrationFormHistoryRecordAfterCompleteRegistration.device_id,
    ).toBeDefined();
    expect(
      registrationFormHistoryRecordAfterCompleteRegistration.user_agent,
    ).toBeDefined();
    expect(
      registrationFormHistoryRecordAfterCompleteRegistration.username,
    ).toBe('300939632');
  });

  it('Should upload registration form after successful complete registration', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    const imagePath = join(__dirname, '/assets/registration.jpg');

    const uploadImageResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadRegistrationFormMutation,
          variables: { somefile: null },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(
      extractGqlResponse(uploadImageResponse, 'uploadRegistrationForm'),
    ).toEqual(uploadRegistrationFormMutationFinalFixture);

    //mock response from verifyOtp during registration process
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValue(verifyOtpFixtureWithTemporalUsername);

    //verifyOtp
    const verifyOtpResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .send({
        query: verifyOtpMutation,
      });

    const verifyOtpResponseCookie = verifyOtpResponse.headers['set-cookie'];

    const entity =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    const uploadRegisterFormSpy = jest.spyOn(
      sigDatamagineService,
      'uploadRegisterForm',
    );

    const deleteByTemporaryUsernameSpy = jest.spyOn(
      registrationFormHistoryService,
      'deleteByTemporaryUsername',
    );

    // complete registration
    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', verifyOtpResponseCookie)
      .send({
        query: completeRegistrationMutation(
          testNames.defaultDeviceId,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    //wait job to be proccessed
    await new Promise((resolve) => setTimeout(resolve, 1500));

    expect(deleteByTemporaryUsernameSpy).toHaveBeenCalledTimes(1);

    // should upload registration form after complete registration
    expect(uploadRegisterFormSpy).toHaveBeenCalledTimes(1);
    expect(uploadRegisterFormSpy).toHaveBeenCalledWith({
      username: '300939632',
      image_data: entity.image,
      client_ip: '::ffff:127.0.0.1',
      device_id: 'TEST',
      user_agent: 'test',
      image_extension: 'jpg',
    });

    //should remove record from db after successful upload
    const entity2 =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    expect(entity2).toBeNull();
  });

  it('Should not delete record after SIG/DATAMAGINE upload error', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    const imagePath = join(__dirname, '/assets/registration.jpg');

    const uploadImageResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadRegistrationFormMutation,
          variables: { somefile: null },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(
      extractGqlResponse(uploadImageResponse, 'uploadRegistrationForm'),
    ).toEqual(uploadRegistrationFormMutationFinalFixture);

    //mock response from verifyOtp during registration process
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValue(verifyOtpFixtureWithTemporalUsername);

    //verifyOtp
    const verifyOtpResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .send({
        query: verifyOtpMutation,
      });

    const verifyOtpResponseCookie = verifyOtpResponse.headers['set-cookie'];

    const entity =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    const uploadRegisterFormSpy = jest
      .spyOn(sigDatamagineService, 'uploadRegisterForm')
      .mockRejectedValueOnce('SIG API Error');

    // complete registration
    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', verifyOtpResponseCookie)
      .send({
        query: completeRegistrationMutation(
          testNames.defaultDeviceId,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    //wait job to be proccessed
    await new Promise((resolve) => setTimeout(resolve, 500));

    // should upload registration form after complete registration
    expect(uploadRegisterFormSpy).toHaveBeenCalledTimes(1);
    expect(uploadRegisterFormSpy).toHaveBeenCalledWith({
      username: '300939632',
      image_data: entity.image,
      client_ip: '::ffff:127.0.0.1',
      device_id: 'TEST',
      user_agent: 'test',
      image_extension: 'jpg',
    });

    //should not delete record from db after unsuccessful upload
    const entity2 =
      await registrationFormHistoryService.findOneByTemporaryUsername(
        'OI00217493',
      );

    expect(entity2.image).toBeDefined();
    expect(entity2.username).toBe('300939632');
    expect(entity2.temporary_username).toBe('OI00217493');
    expect(entity2.client_ip).toBeDefined();
    expect(entity2.user_agent).toBeDefined();
    expect(entity2.device_id).toBeDefined();
  });

  it('Should not add job to upload registration form when patron did not upload registration form', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    //mock response from verifyOtp during registration process
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValue(verifyOtpFixtureWithTemporalUsername);

    //verifyOtp
    const verifyOtpResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .send({
        query: verifyOtpMutation,
      });

    const verifyOtpResponseCookie = verifyOtpResponse.headers['set-cookie'];

    const findOneByTemporaryUsernameSpyOn = jest.spyOn(
      registrationFormHistoryService,
      'findOneByTemporaryUsername',
    );

    // complete registration
    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', verifyOtpResponseCookie)
      .send({
        query: completeRegistrationMutation(
          testNames.defaultDeviceId,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const queueJobs = await queue.getCompleted();

    expect(findOneByTemporaryUsernameSpyOn).toHaveBeenCalledTimes(1);
    expect(queueJobs.length).toEqual(0);
  });

  it('Should add job to upload registration form after successful complete registration', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .set('user-agent', 'test')
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    const cookies = response.headers['set-cookie'];

    const imagePath = join(__dirname, '/assets/registration.jpg');

    const uploadImageResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadRegistrationFormMutation,
          variables: { somefile: null },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(
      extractGqlResponse(uploadImageResponse, 'uploadRegistrationForm'),
    ).toEqual(uploadRegistrationFormMutationFinalFixture);

    //mock response from verifyOtp during registration process
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValue(verifyOtpFixtureWithTemporalUsername);

    //verifyOtp
    const verifyOtpResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', cookies)
      .send({
        query: verifyOtpMutation,
      });

    const verifyOtpResponseCookie = verifyOtpResponse.headers['set-cookie'];

    // complete registration
    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', verifyOtpResponseCookie)
      .send({
        query: completeRegistrationMutation(
          testNames.defaultDeviceId,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    //wait job to be proccessed
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const queueJobs = await queue.getCompleted();

    expect(queueJobs.length).toEqual(1);
  });
});
