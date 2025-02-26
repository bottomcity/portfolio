import { getQueueToken } from '@nestjs/bullmq';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  ConsentsEntity,
  RegistrationFormHistoryEntity,
  UsersEntity,
} from '@db/entity';
import { AuthTokenEnum, CaptchaEnum, QueueEnum } from '@enums';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import { SigAuthService } from '@services/rest/sig/services';
import { CredsStorage, REDIS_CREDS_STORAGE_TOKEN } from '@storage';
import {
  testDates,
  testNames,
  testPhoneNumbers,
  testPINs,
  testUsernames,
} from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';
import { forgotLoginPinMutation } from '@test/mutations/forgot-pin.mutation';

import { Queue } from 'bullmq';
import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import {
  getPatronBalanceFinalFixture,
  resumeLoginDragonPayFinalFixture,
  resumeLoginDragonPayTokenFixture,
  resumeUserLoginSessionFinalFixture,
  verifyOtpTokenFixture,
} from './mocks/fixtures/sig';
import { sigAuthServiceMock } from './mocks/sig/sig-auth.service.mock';
import {
  changeJwtExpiry,
  cookieCaptchaTokenHelper,
  cookieOtpTokenHelper,
  extractGqlErrors,
  extractGqlResponse,
  extractToken,
  setTokenInCookie,
} from './helpers';
import {
  loginMutation,
  loginMutationExtraFields,
  loginMutationPartialResponse,
  rejectOverwriteUserSession,
  resumeLoginDragonpayMutation,
  resumeLoginDragonpayMutationExtraFields,
  resumeLoginDragonpayMutationPartialResponse,
  resumeUserSessionMutation,
  resumeUserSessionMutationExtraFields,
  resumeUserSessionMutationPartialResponse,
  resumeUserSessionWithoutNonceMutation,
  resumeUserSessionWithoutTMutation,
  verifyOtpMutation,
} from './mutations';
import { getPatronBalanceQuery } from './queries';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let consentsRepository: Repository<ConsentsEntity>;
  let usersRepository: Repository<UsersEntity>;
  let RegistrationFormHistoryRepository: Repository<RegistrationFormHistoryEntity>;
  let redisCredsStorage: CredsStorage;
  let postOtpToken: string[];
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

    consentsRepository = moduleFixture.get<Repository<ConsentsEntity>>(
      getRepositoryToken(ConsentsEntity),
    );

    usersRepository = moduleFixture.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );

    RegistrationFormHistoryRepository = moduleFixture.get<
      Repository<RegistrationFormHistoryEntity>
    >(getRepositoryToken(RegistrationFormHistoryEntity));

    redisCredsStorage = moduleFixture.get<CredsStorage>(
      REDIS_CREDS_STORAGE_TOKEN,
    );

    queue = moduleFixture.get<Queue>(
      getQueueToken(QueueEnum.UPLOAD_REGISTRATION_FORM_QUEUE),
    );

    captchaCookie = await cookieCaptchaTokenHelper(app.getHttpServer(), gql);
  });

  beforeEach(async () => {
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
    await consentsRepository.delete({});
    await usersRepository.delete({});
    await RegistrationFormHistoryRepository.delete({});
    await queue.obliterate({ force: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await consentsRepository.delete({});
    await usersRepository.delete({});
    await RegistrationFormHistoryRepository.delete({});
    await queue.obliterate({ force: true });
    await app.close();
  });

  describe('Login flow', () => {
    test('Login', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(
            testNames.testName,
            testPINs.defaultPIN,
            testNames.firefox,
          ),
        });

      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(
        cookies.some((str) => str.startsWith(AuthTokenEnum.postLogin)),
      ).toBe(true);
    });

    test('Login with partial response', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutationPartialResponse,
        });

      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.login.user).toHaveProperty('username');
      expect(response.body.data.login.user).not.toHaveProperty('email');
      expect(
        cookies.some((str) => str.startsWith(AuthTokenEnum.postLogin)),
      ).toBe(true);
    });

    test('Login with unexpected response fields', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: loginMutationExtraFields,
      });

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.cantQueryField,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.graphValidationFailed,
      );
      expect(response).not.toHaveProperty('unexpectedField');
    });

    test('Should not login without captcha cookie', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: loginMutation('', testPINs.defaultPIN, testNames.firefox),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.captchaVerificationIsRequired,
      );
      expect(response.body.errors[0].code).toEqual(400);
    });

    test('Should not login if captcha validation failed', async () => {
      const failedCaptchaCookie = await cookieCaptchaTokenHelper(
        app.getHttpServer(),
        gql,
        true,
      );

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', failedCaptchaCookie)
        .send({
          query: loginMutation('', testPINs.defaultPIN, testNames.firefox),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.captchaVerificationFailed,
      );
      expect(response.body.errors[0].code).toEqual(400);
    });

    test('Should not login if captcha token is expired', async () => {
      const captchaCookie = await cookieCaptchaTokenHelper(
        app.getHttpServer(),
        gql,
        true,
      );

      const token = extractToken(captchaCookie[0], CaptchaEnum.validateCaptcha);

      const expiredDate = Math.floor(
        new Date('2000-01-01T00:00:00Z').getTime() / 1000,
      );

      const newToken = changeJwtExpiry(token, expiredDate);

      const newExpiredCaptchaCookie = [
        setTokenInCookie(
          captchaCookie[0],
          CaptchaEnum.validateCaptcha,
          newToken,
        ),
      ];

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', newExpiredCaptchaCookie)
        .send({
          query: loginMutation('', testPINs.defaultPIN, testNames.firefox),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.captchaVerificationExpired,
      );
      expect(response.body.errors[0].code).toEqual(400);
    });

    test('Login without login', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation('', testPINs.defaultPIN, testNames.firefox),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Login without PIN', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(testNames.testName, '', testNames.firefox),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Login without deviceId', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(testNames.testName, testPINs.defaultPIN, ''),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Login invalid short PIN', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(
            testNames.testName,
            testPINs.invalidShortPIN,
            testNames.firefox,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe4,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Login invalid long PIN', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(
            testNames.testName,
            testPINs.invalidLongPIN,
            testNames.firefox,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe4,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Login invalid (not number) PIN', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(
            testNames.testName,
            testNames.testName,
            testNames.firefox,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeANumber,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Login fail', async () => {
      const spy = jest.spyOn(sigAuthServiceMock, 'login');

      spy.mockRejectedValueOnce('value');

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: loginMutation(
            testNames.testName,
            testPINs.defaultPIN,
            testNames.firefox,
          ),
        });
      expect(response.body.data).toBeNull();
    });

    test('Unable to login in case of captchaCookie instead loginToken while verifying OTP', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: verifyOtpMutation,
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Resume user login session', () => {
    test('Should resume user login session', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeUserSessionMutation,
        });

      expect(extractGqlResponse(response, 'resumeUserSession')).toEqual(
        resumeUserLoginSessionFinalFixture,
      );
    });

    test('Unable to resume user login session in case of captchaCookie instead postOtpToken', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: resumeUserSessionMutation,
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('Unable to resume user session for unauthorized user', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: resumeUserSessionMutation,
      });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('Should not resume user login session 1st variant', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeUserSessionWithoutNonceMutation,
        });

      expect(extractGqlErrors(response)).toBeTruthy();
    });

    test('Should not resume user login session 2nd variant', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeUserSessionWithoutTMutation,
        });

      expect(extractGqlErrors(response)).toBeTruthy();
    });

    test('resume user login session with partial response (without status and code)', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeUserSessionMutationPartialResponse,
        });

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('resumeUserSession');

      const { resumeUserSession } = response.body.data;

      expect(resumeUserSession).not.toHaveProperty('status');
      expect(resumeUserSession).not.toHaveProperty('code');
      expect(resumeUserSession).toHaveProperty('userData');
      expect(resumeUserSession.userData).toBeDefined();
    });

    test('resume user login session with unexpected response fields', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeUserSessionMutationExtraFields,
        });

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.cantQueryField,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.graphValidationFailed,
      );
      expect(response).not.toHaveProperty('unexpectedField');
    });
  });

  describe('Reject user session', () => {
    test('Should reject user session', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: rejectOverwriteUserSession,
        });

      expect(
        extractGqlResponse(response, 'rejectOverwriteUserSession'),
      ).toEqual(true);
    });

    test('Unable to reject user session for unauthorized user', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: rejectOverwriteUserSession,
      });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Forgot PIN flow', () => {
    test('Should recover PIN', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(extractGqlResponse(response, 'forgotLoginPin')).toBeTruthy();
    });

    test('Should not recover PIN if no username', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            '',
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Should not recover PIN if no last Name', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            '',
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Should not recover PIN if no first Name', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            '',
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Should not recover PIN if no Mobile Country Code', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            '',
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Should not recover PIN if no Mobile Number', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            '',
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Should not recover PIN if no deviceId', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            '',
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Should not recover PIN if no date of birth', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            '',
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with invalid last name', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.invalidLong129Name,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe128,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with invalid first name', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.invalidLong129Name,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe128,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid format Date Of Birth', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.invalidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.invalidDate,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid (string) Date Of Birth', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testNames.testName,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.invalidDate,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid Short Mobile Number', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.invalidShortNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mobileNumberLength,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid Long Mobile Number', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.invalidLongNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mobileNumberLength,
      );
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeMax32,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid User Name', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.invalidUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeMax32,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid Long Mobile Code', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.invalidLongCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeMax5,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid not number Mobile Code', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileNumber,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeANumber,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('Forgot PIN with Invalid not number Mobile Phone', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: forgotLoginPinMutation(
            testUsernames.defaultUsername,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testNames.testName,
            testNames.firefox,
            testNames.defaultDeviceId,
            testDates.defaultValidDate,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeANumber,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Resume login Dragonpay', () => {
    test('Should resume login Dragonpay', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutation,
        });

      expect(extractGqlResponse(response, 'resumeLoginDragonpay')).toEqual(
        resumeLoginDragonPayFinalFixture,
      );
    });

    test('Should change token in AuthTokenEnum.postOtp cookie after successful resume login Dragonpay', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutation,
        });

      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(cookies.some((str) => str.startsWith(AuthTokenEnum.postOtp))).toBe(
        true,
      );

      const newPostOtpToken = extractToken(cookies[0], AuthTokenEnum.postOtp);

      expect(newPostOtpToken).not.toBe(postOtpToken);
    });

    test('Should not change token in AuthTokenEnum.postOtp cookie after unsuccessful resume login Dragonpay', async () => {
      const sigAuthService = app.get<SigAuthService>(SigAuthService);

      jest
        .spyOn(sigAuthService, 'resumeLoginDragonpay')
        .mockRejectedValueOnce('API error');

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutation,
        });
      const cookiesFromResponse = response.headers[
        'set-cookie'
      ] as unknown as string[];

      expect(response.body.errors[0].message).toBeDefined();
      expect(response.body.data).toBeNull();

      expect(cookiesFromResponse).not.toBeDefined();
    });

    test('Should pass PostOtpJwtGuard after successful resume login Dragonpay', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutation,
        });

      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(cookies.some((str) => str.startsWith(AuthTokenEnum.postOtp))).toBe(
        true,
      );

      const newPostOtpToken = extractToken(cookies[0], AuthTokenEnum.postOtp);

      expect(newPostOtpToken).not.toBe(postOtpToken);

      const newPostOtpCookie = [
        setTokenInCookie(cookies[0], AuthTokenEnum.postOtp, newPostOtpToken),
      ];

      const responseFromGetBalance = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', newPostOtpCookie)
        .send({
          query: getPatronBalanceQuery,
        });

      expect(
        extractGqlResponse(responseFromGetBalance, 'getPatronBalance'),
      ).toEqual(getPatronBalanceFinalFixture);
    });

    test('Should delete old postOtp token and save new after unsuccessful resume login Dragonpay', async () => {
      const oldPostOtpToken = extractToken(
        postOtpToken[0],
        AuthTokenEnum.postOtp,
      );

      const oldPostOtpSiGToken =
        await redisCredsStorage.getSigOtpToken(oldPostOtpToken);

      expect(oldPostOtpSiGToken).toEqual(verifyOtpTokenFixture);

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutation,
        });

      const cookies = response.headers['set-cookie'] as unknown as string[];

      const newPostOtpToken = extractToken(cookies[0], AuthTokenEnum.postOtp);

      const newPostOtpSiGTokenFromRedis =
        await redisCredsStorage.getSigOtpToken(newPostOtpToken);

      expect(newPostOtpSiGTokenFromRedis).toEqual(
        resumeLoginDragonPayTokenFixture,
      );

      const oldPostOtpSiGTokenFromRedis =
        await redisCredsStorage.getSigOtpToken(oldPostOtpToken);

      expect(oldPostOtpSiGTokenFromRedis).toBeNull();
    });

    test('Should not delete old postOtp token after successful resume login Dragonpay', async () => {
      const oldPostOtpToken = extractToken(
        postOtpToken[0],
        AuthTokenEnum.postOtp,
      );

      const oldPostOtpSiGToken =
        await redisCredsStorage.getSigOtpToken(oldPostOtpToken);

      expect(oldPostOtpSiGToken).toEqual(verifyOtpTokenFixture);

      const sigAuthService = app.get<SigAuthService>(SigAuthService);

      jest
        .spyOn(sigAuthService, 'resumeLoginDragonpay')
        .mockRejectedValueOnce('API error');

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutation,
        });

      expect(response.body.errors[0].message).toBeDefined();
      expect(response.body.data).toBeNull();

      const oldPostOtpSiGTokenAfterResumeLoginFragonpay =
        await redisCredsStorage.getSigOtpToken(oldPostOtpToken);

      expect(oldPostOtpSiGTokenAfterResumeLoginFragonpay).toEqual(
        verifyOtpTokenFixture,
      );
    });

    test('Unable to login Dragonpay in case of captchaCookie instead postOtpToken', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: resumeLoginDragonpayMutation,
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('Unable to resume login Dragonpay for unauthorized user', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: resumeLoginDragonpayMutation,
      });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('resume login Dragonpay with partial response (without status and code)', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutationPartialResponse,
        });

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('resumeLoginDragonpay');

      const { resumeLoginDragonpay } = response.body.data;

      expect(resumeLoginDragonpay).not.toHaveProperty('status');
      expect(resumeLoginDragonpay).not.toHaveProperty('code');
      expect(resumeLoginDragonpay).toHaveProperty('userData');
      expect(resumeLoginDragonpay.userData).toBeDefined();
    });

    test('resume login Dragonpay with unexpected response fields', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: resumeLoginDragonpayMutationExtraFields,
        });

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.cantQueryField,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.graphValidationFailed,
      );
      expect(response).not.toHaveProperty('unexpectedField');
    });
  });
});
