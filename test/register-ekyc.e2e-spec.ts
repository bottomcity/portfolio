import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthTokenEnum, SigTokenEnum } from '@enums';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import {
  testDates,
  testNames,
  testPhoneNumbers,
  testPINs,
} from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { RegisterEkycUserFinalFixture } from './mocks/fixtures/sig';
import { cookieCaptchaTokenHelper, extractGqlResponse } from './helpers';
import {
  registerEkycMutationWithUnexpectedField,
  registerUserEkycMutation,
  registerUserEkycMutationInvalidIP,
} from './mutations';

const gql = '/graphql';

describe('Register ekyc(e2e)', () => {
  let app: INestApplication;
  let captchaCookie: string[];

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

    captchaCookie = await cookieCaptchaTokenHelper(app.getHttpServer(), gql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Cookies must be set during registration ekyc', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
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

    const cookies = response.headers['set-cookie'] as unknown as string[];

    expect(
      cookies.every(
        (str) =>
          str.startsWith(SigTokenEnum.loginToken) ||
          str.startsWith(AuthTokenEnum.postLogin),
      ),
    ).toBe(true);
  });

  it('Cookies must be set correctly for different user agents', async () => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    ];

    for (const userAgent of userAgents) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('User-Agent', userAgent)
        .set('Cookie', captchaCookie)
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

      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(
        cookies.every(
          (str) =>
            str.startsWith(SigTokenEnum.loginToken) ||
            str.startsWith(AuthTokenEnum.postLogin),
        ),
      ).toBe(true);
    }
  });

  it('Cookies must have HttpOnly attribute set during registration ekyc', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
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

    const cookies = response.headers['set-cookie'] as unknown as string[];

    expect(
      cookies.every(
        (str) =>
          str.startsWith(SigTokenEnum.loginToken) ||
          str.startsWith(AuthTokenEnum.postLogin),
      ),
    ).toBe(true);

    cookies.forEach((cookie) => {
      expect(cookie).toContain('HttpOnly');
    });
  });

  it('Cookies must have Secure attribute set during registration ekyc', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
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

    const cookies = response.headers['set-cookie'] as unknown as string[];

    expect(
      cookies.every(
        (str) =>
          str.startsWith(SigTokenEnum.loginToken) ||
          str.startsWith(AuthTokenEnum.postLogin),
      ),
    ).toBe(true);

    cookies.forEach((cookie) => {
      expect(cookie).toContain('Secure');
    });
  });

  it('Register ekyc', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
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
    const registerUserEkyc = extractGqlResponse(response, 'registerUserEkyc');

    expect(registerUserEkyc).toEqual(RegisterEkycUserFinalFixture);
  });

  it('Register ekyc with invalid first name', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.invalidLong129Name,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe128,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid last name', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.invalidLong129Name,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe128,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid format date of birth', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.invalidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.invalidDate,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid (string) date of birth', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testNames.testName,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.invalidDate,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid short PIN', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.invalidShortPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe4,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid long PIN', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.invalidLongPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe4,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid (string) PIN', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testNames.testName,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe4,
    );
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeANumber,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid short PIN confirmation', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.invalidShortPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe4,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid long PIN confirmation', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.invalidLongPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe4,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid (string) PIN confirmation', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeANumber,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with mismatched PINs', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultSimplePIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mismatchPINs,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid short mobile number', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.invalidShortNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mobileNumberLength,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid long mobile number', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.invalidLongNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mobileNumberLength,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid (string) mobile number', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testNames.testName,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeANumber,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid long mobile code', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.invalidLongCode,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeMax5,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid (string) mobile code', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultPIN,
          testPINs.defaultPIN,
          testNames.testName,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeANumber,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with invalid client IP', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutationInvalidIP(
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

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeIP,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with weak password', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', captchaCookie)
      .send({
        query: registerUserEkycMutation(
          testPINs.defaultSimplePIN,
          testPINs.defaultSimplePIN,
          testNames.testName,
          testNames.testName,
          testPhoneNumbers.defaultMobileCode,
          testPhoneNumbers.invalidLongNumber,
          testNames.testName,
          testDates.defaultValidDate,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.weakPIN,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Register ekyc with missing required fields', async () => {
    const requiredFields = [
      'password',
      'passwordConfirmation',
      'lastName',
      'firstName',
      'mobileCountryCode',
      'mobileNumber',
      'deviceId',
      'dateOfBirth',
    ];

    const baseValidInputs = {
      password: testPINs.defaultPIN,
      passwordConfirmation: testPINs.defaultPIN,
      lastName: testNames.testName,
      firstName: testNames.testName,
      mobileCountryCode: testPhoneNumbers.defaultMobileCode,

      mobileNumber: testPhoneNumbers.defaultMobileNumber,

      deviceId: testNames.testName,
      dateOfBirth: testDates.defaultValidDate,
    };

    for (const field of requiredFields) {
      const inputs = { ...baseValidInputs, [field]: '' };

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: registerUserEkycMutation(
            inputs.password,
            inputs.passwordConfirmation,
            inputs.lastName,
            inputs.firstName,
            inputs.mobileCountryCode,
            inputs.mobileNumber,
            inputs.deviceId,
            inputs.dateOfBirth,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Register ekyc with with unexpected response fields', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: registerEkycMutationWithUnexpectedField,
    });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.cantQueryField,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.graphValidationFailed,
    );
  });
});
