import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ConsentsEntity, UsersEntity } from '@db/entity';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import { PolicyEnum } from '@services/rest/sig/enums/policy.enum';
import { SigAuthService, SigOtpService } from '@services/rest/sig/services';
import {
  testDates,
  testNames,
  testPhoneNumbers,
  testPINs,
} from '@test/enums/data-for-inputs-enums';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from './../src/app.module';
import {
  loginResponseWithUsernameForNewRegistrationFixture,
  verifyOtpFixtureWithTemporalUsername,
} from './mocks/fixtures/sig';
import { cookieCaptchaTokenHelper, cookieLoginTokenHelper } from './helpers';
import {
  completeRegistrationMutation,
  registerUserEkycMutation,
  verifyOtpMutation,
} from './mutations';

const gql = '/graphql';

describe('Register ekyc(e2e)', () => {
  let app: INestApplication;
  let captchaCookie: string[];
  let sigOtpService: SigOtpService;
  let sigAuthService: SigAuthService;
  let consentsRepository: Repository<ConsentsEntity>;
  let usersRepository: Repository<UsersEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(
      app.get(TypeScriptExceptionFilter),
      app.get(AxiosExceptionFilter),
      app.get(HttpExceptionFilter),
    );
    await app.init();

    consentsRepository = moduleFixture.get<Repository<ConsentsEntity>>(
      getRepositoryToken(ConsentsEntity),
    );

    usersRepository = moduleFixture.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );

    sigOtpService = app.get<SigOtpService>(SigOtpService);
    sigAuthService = app.get<SigAuthService>(SigAuthService);

    captchaCookie = await cookieCaptchaTokenHelper(app.getHttpServer(), gql);
  });

  beforeEach(async () => {
    await consentsRepository.delete({});
    await usersRepository.delete({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await consentsRepository.delete({});
    await usersRepository.delete({});
    await app.close();
  });

  it('Should save new user and add required consent in db after login', async () => {
    const usersRepositorySpy = jest.spyOn(usersRepository, 'save');

    await cookieLoginTokenHelper(app.getHttpServer(), gql);

    //check that we created user if we did not have user previously after login step
    const user = await usersRepository.findOne({
      where: { userId: '300923738' },
    });

    expect(user).toBeDefined();

    const usersConsents = await consentsRepository.find({
      where: {
        user: {
          userId: '300923738',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
    });

    expect(usersConsents.length).toBe(1);

    expect(usersConsents[0].policy).toBeDefined();
    expect(usersConsents[0].policy.policyId).toBe(
      PolicyEnum.loginTermsAndConditions,
    );

    expect(usersRepositorySpy).toHaveBeenCalledTimes(1);
  });

  it('Should save required consent in db after login in case of we already have user in db', async () => {
    //pretending that we already have user in db before login
    await usersRepository.save({
      userId: '300923738',
    });

    const usersRepositorySpy = jest.spyOn(usersRepository, 'save');

    await cookieLoginTokenHelper(app.getHttpServer(), gql);

    const usersConsents = await consentsRepository.find({
      where: {
        user: {
          userId: '300923738',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
    });

    expect(usersConsents.length).toBe(1);

    expect(usersConsents[0].policy).toBeDefined();
    expect(usersConsents[0].policy.policyId).toBe(
      PolicyEnum.loginTermsAndConditions,
    );

    expect(usersRepositorySpy).not.toHaveBeenCalled();
  });

  it('Should have required consents in db when user complete registration', async () => {
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

    //need to provide temporal username to simulate registraition flow
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValueOnce(verifyOtpFixtureWithTemporalUsername);

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

    const usersConsents = await consentsRepository.find({
      where: {
        user: {
          userId: '300939632',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
    });

    expect(usersConsents.length).toBe(3);

    const completeRegistrationConsents = usersConsents.map(
      (consent) => consent.policy.policyId,
    );

    expect(completeRegistrationConsents).toEqual([
      PolicyEnum.registartionAtLeast21,
      PolicyEnum.registrationTermsAndConditions,
      PolicyEnum.registrationIsNotPEP, //if user completes registration that means he is not PEP
    ]);
  });

  it('Should have required policies in db after complete registration, and login', async () => {
    //replace response with anouther username
    jest
      .spyOn(sigAuthService, 'login')
      .mockResolvedValueOnce(
        loginResponseWithUsernameForNewRegistrationFixture,
      );

    await cookieLoginTokenHelper(app.getHttpServer(), gql);

    const usersConsentsAfterLogin = await consentsRepository.find({
      where: {
        user: {
          userId: '300939632',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
    });

    expect(usersConsentsAfterLogin.length).toBe(1);

    expect(usersConsentsAfterLogin[0].policy).toBeDefined();
    expect(usersConsentsAfterLogin[0].policy.policyId).toBe(
      PolicyEnum.loginTermsAndConditions,
    );

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

    //need to provide temporal username to simulate registraition flow
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValueOnce(verifyOtpFixtureWithTemporalUsername);

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

    const usersConsents = await consentsRepository.find({
      where: {
        user: {
          userId: '300939632',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
      order: {
        policy: {
          policyId: 'ASC',
        },
      },
    });

    expect(usersConsents.length).toBe(4);

    const completeRegistrationConsents = usersConsents.map(
      (consent) => consent.policy.policyId,
    );

    expect(completeRegistrationConsents).toEqual([
      PolicyEnum.registartionAtLeast21,
      PolicyEnum.registrationTermsAndConditions,
      PolicyEnum.loginTermsAndConditions,
      PolicyEnum.registrationIsNotPEP, //if user completes registration that means he is not PEP
    ]);
  });

  it('Should save date of consent after login correctly', async () => {
    // const currentTime = new Date();

    await cookieLoginTokenHelper(app.getHttpServer(), gql);

    const usersConsents = await consentsRepository.find({
      where: {
        user: {
          userId: '300923738',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
    });

    const consentEntity = usersConsents[0];

    expect(consentEntity.consentedAt).toBeDefined();
    // expect(new Date(consentEntity.consentedAt).getTime()).toBeLessThan(
    //   currentTime.getTime(),
    // );
  });

  it('Should save dates of consents after complete registration correctly', async () => {
    // const currentTime = new Date();

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

    //need to provide temporal username to simulate registraition flow
    jest
      .spyOn(sigOtpService, 'verifyOtp')
      .mockResolvedValueOnce(verifyOtpFixtureWithTemporalUsername);

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

    const usersConsents = await consentsRepository.find({
      where: {
        user: {
          userId: '300939632',
        },
      },
      relations: {
        user: true,
        policy: true,
      },
    });

    expect(usersConsents.length).toBe(3);

    const completeRegistrationConsentsDates = usersConsents.map(
      (consent) => consent.consentedAt,
    );

    completeRegistrationConsentsDates.map(
      (consentDate) => expect(consentDate).toBeDefined(),
      // expect(new Date(consentDate).getTime()).toBeLessThan(
      //   currentTime.getTime(),
      // ),
    );
  });
});
