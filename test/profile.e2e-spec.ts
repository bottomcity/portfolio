import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import { testNames, testPINs } from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';
import {
  GetEkycFinalFixture,
  GetExclusionFinalFixture,
  GetStepFinalFixture,
  GetUserProfileFinalFixture,
  UpdateUserProfileFinalFixture,
} from '@test/mocks/fixtures/sig';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import {
  cookieOtpTokenHelper,
  extractGqlErrors,
  extractGqlResponse,
} from './helpers';
import {
  updateLoginPinMutation,
  updateProfileInvalidDateMutation,
  updateProfileInvalidEmailMutation,
  updateProfileInvalidNamesMutation,
  updateProfileInvalidPinMutation,
  updateProfileMutation,
  updateProfileMutationExtraFields,
  updateProfileMutationPartialResponse,
} from './mutations';
import {
  getEkycQuery,
  getExclusionQuery,
  getExclusionQueryExtraFields,
  getExclusionQueryPartialResponse,
  getProfileQuery,
  getProfileQueryExtraFields,
  getProfileQueryPartialResponse,
  getStepQuery,
  getUsername,
  getUsernameExtraField,
  setUsername,
  setUsernameExtraField,
} from './queries';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Profile (e2e)', () => {
  let app: INestApplication;
  let postOtpToken: string[];

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

    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Update profile', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: updateProfileMutation,
      });
    const { updateUserProfile } = response.body.data;

    expect(updateUserProfile).toEqual(UpdateUserProfileFinalFixture);
  });

  it('Update profile with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: updateProfileMutationExtraFields,
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

  it('Update profile with extra partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: updateProfileMutationPartialResponse,
      });

    const { updateUserProfile } = response.body.data;

    expect(response.status).toEqual(HttpStatus.OK);
    expect(updateUserProfile).toHaveProperty('status');
    expect(updateUserProfile).not.toHaveProperty('code');
    expect(updateUserProfile).not.toEqual(UpdateUserProfileFinalFixture);
  });

  it('Unable to Update profile for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: updateProfileMutation,
    });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Update profile with invalid email', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: updateProfileInvalidEmailMutation,
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.invalidEmail,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update profile with invalid date Of Birth', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: updateProfileInvalidDateMutation,
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.invalidDate,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update profile with invalid PIN', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: updateProfileInvalidPinMutation,
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe4,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update profile with invalid names', async () => {
    const testCases = [
      { firstName: testNames.invalidLong129Name, lastName: testNames.testName },
      { firstName: testNames.testName, lastName: testNames.invalidLong129Name },
    ];

    for (const { firstName, lastName } of testCases) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: updateProfileInvalidNamesMutation(firstName, lastName),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe128,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Get profile must contain the necessary tokens in the cookies', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getProfileQuery,
    });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Get profile', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getProfileQuery,
      });

    const { getUserProfile } = response.body.data;

    expect(response.body.data).toBeDefined();
    expect(getUserProfile).toEqual(GetUserProfileFinalFixture);
  });

  it('Get profile with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getProfileQueryExtraFields,
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

  it('Get profile with extra partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getProfileQueryPartialResponse,
      });

    const { getUserProfile } = response.body.data;

    expect(response.status).toEqual(HttpStatus.OK);
    expect(getUserProfile).toHaveProperty('status');
    expect(getUserProfile).not.toHaveProperty('code');
    expect(getUserProfile).not.toEqual(GetUserProfileFinalFixture);
  });

  it('Unable to Get profile for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getProfileQuery,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Get exclusion', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getExclusionQuery,
      });

    expect(extractGqlResponse(response, 'getExclusion')).toEqual(
      GetExclusionFinalFixture,
    );
  });

  it('Unable to Get exclusion for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getExclusionQuery,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Get exclusion with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getExclusionQueryPartialResponse,
      });

    const { getExclusion } = response.body.data;

    expect(response.status).toEqual(HttpStatus.OK);
    expect(getExclusion).toHaveProperty('status');
    expect(getExclusion).not.toHaveProperty('code');
    expect(getExclusion).not.toEqual(GetExclusionFinalFixture);
  });

  it('Get exclusion with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getExclusionQueryExtraFields,
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

  it('Set username', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: setUsername,
      });

    expect(extractGqlResponse(response, 'setUsername')).toEqual({
      status: true,
    });
  });

  it('Get username', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getUsername,
      });

    expect(extractGqlResponse(response, 'getUsername')).toEqual({
      username: '300923738',
    });
  });

  it('Set username with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: setUsernameExtraField,
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

  it('Get username with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getUsernameExtraField,
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

  describe('Update profile PIN flow', () => {
    it('Should update profile PIN', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: updateLoginPinMutation(
            testPINs.testPIN,
            testPINs.defaultPIN,
            testPINs.defaultPIN,
          ),
        });

      expect(extractGqlResponse(response, 'updateLoginPin')).toBeTruthy();
    });

    it('Should not update profile when PINs do not match', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: updateLoginPinMutation(
            testPINs.testPIN,
            testPINs.defaultPIN,
            testPINs.defaultSimplePIN,
          ),
        });

      expect(extractGqlErrors(response)).toBeTruthy();
    });

    it('Unable to update profile PIN for unauthorized user', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: updateLoginPinMutation(
            testPINs.testPIN,
            testPINs.defaultPIN,
            testPINs.defaultSimplePIN,
          ),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it('Should not update profile PIN with an empty fields', async () => {
      const testCases = [
        {
          oldPIN: '',
          newPIN: testPINs.defaultPIN,
          newPINConfirmation: testPINs.defaultPIN,
        },
        {
          oldPIN: testPINs.testPIN,
          newPIN: '',
          newPINConfirmation: testPINs.defaultPIN,
        },
        {
          oldPIN: testPINs.testPIN,
          newPIN: testPINs.defaultPIN,
          newPINConfirmation: '',
        },
      ];

      for (const { oldPIN, newPIN, newPINConfirmation } of testCases) {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set('Cookie', postOtpToken)
          .send({
            query: updateLoginPinMutation(oldPIN, newPIN, newPINConfirmation),
          });

        expect(response.body.errors[0].message).toContain(
          gatewayErrorMessages.shouldNotBeEmpty,
        );
        expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('Should not update profile PIN if new PIN is too short', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: updateLoginPinMutation(
            testPINs.testPIN,
            testPINs.invalidShortPIN,
            testPINs.invalidShortPIN,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe4,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('Should not update profile PIN if new PIN is too long', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: updateLoginPinMutation(
            testPINs.testPIN,
            testPINs.invalidLongPIN,
            testPINs.invalidLongPIN,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBe4,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('Should not update profile PIN if new PIN contains non-numeric characters', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: updateLoginPinMutation(
            testPINs.testPIN,
            testNames.testName,
            testNames.testName,
          ),
        });

      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.mustBeANumber,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  it('Get step', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getStepQuery,
      });

    expect(extractGqlResponse(response, 'getStep')).toEqual(
      GetStepFinalFixture,
    );
  });

  it('Unable to Get step for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getStepQuery,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Get ekyc', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getEkycQuery,
      });

    expect(extractGqlResponse(response, 'getEkyc')).toEqual(
      GetEkycFinalFixture,
    );
  });

  it('Unable to Get ekyc for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getEkycQuery,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });
});
