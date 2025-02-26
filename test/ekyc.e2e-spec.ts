import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';

import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import {
  startDocumentEkycFixture,
  startJumioEkycFinalFixture,
  startSelfieEkycFinalFixture,
  submitDockumentEkycFinalFixture,
  uploadDocumentEkycPartBackFinalFixture,
} from './mocks/fixtures/sig';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import {
  invalidPartUploadDocumentEkycMutation,
  missingFieldUploadDocumentEkycMutation,
  partialDocumentEkycMutation,
  partialStartJumioEkycMutation,
  partialStartSelfieEkycMutation,
  partialSubmitDocumentEkycMutation,
  partialUploadDocumentEkycMutation,
  startDocumentEkycMutation,
  startDocumentEkycWithExtraFieldsMutation,
  startJumioEkycMutation,
  startJumioEkycWithExtraFieldsMutation,
  startSelfieEkycMutation,
  startSelfieEkycWithExtraFieldsMutation,
  submitDocumentEkycMutation,
  submitDocumentEkycWithExtraFieldsMutation,
  uploadDocumentEkycMutation,
  uploadDocumentEkycMutationWithoutFile,
  uploadDocumentEkycWithExtraFieldsMutation,
} from './mutations';

const gql = '/graphql';

describe('eKYC (e2e)', () => {
  let app: INestApplication;
  let postOtpToken: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.use(graphqlUploadExpress());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Start document.txt eKYC', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: startDocumentEkycMutation,
      });
    const { startDocumentEkyc } = response.body.data;

    expect(startDocumentEkyc).toEqual(startDocumentEkycFixture);
  });

  it('Unable to Start document.txt eKYC for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: startDocumentEkycMutation,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });

  it('Start document.txt eKYC with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: partialDocumentEkycMutation,
      });

    const { startDocumentEkyc } = response.body.data;

    expect(response.status).toEqual(HttpStatus.OK);
    expect(startDocumentEkyc).toHaveProperty('status');
    expect(startDocumentEkyc).not.toHaveProperty('code');
    expect(startDocumentEkyc).not.toHaveProperty('message');
    expect(startDocumentEkyc).not.toEqual(startDocumentEkycFixture);
  });

  it('Start document.txt eKYC with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: startDocumentEkycWithExtraFieldsMutation,
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

  it('Submit document.txt eKYC', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: submitDocumentEkycMutation,
      });

    const { submitDocumentEkyc } = response.body.data;

    expect(submitDocumentEkyc).toEqual(submitDockumentEkycFinalFixture);
  });

  it('Unable to Submit document.txt eKYC for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: submitDocumentEkycMutation,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });

  it('Submit document.txt eKYC with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: partialSubmitDocumentEkycMutation,
      });

    const { submitDocumentEkyc } = response.body.data;

    expect(response.status).toEqual(HttpStatus.OK);
    expect(submitDocumentEkyc).toHaveProperty('status');
    expect(submitDocumentEkyc).not.toHaveProperty('code');
    expect(submitDocumentEkyc).not.toHaveProperty('message');
    expect(submitDocumentEkyc).not.toHaveProperty('nextAction');
    expect(submitDocumentEkyc).not.toEqual(submitDockumentEkycFinalFixture);
  });

  it('Submit document.txt eKYC with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: submitDocumentEkycWithExtraFieldsMutation,
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

  it('Start selfie eKYC', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: startSelfieEkycMutation,
      });

    const { startSelfieEkyc } = response.body.data;

    expect(startSelfieEkyc).toEqual(startSelfieEkycFinalFixture);
  });

  it('Unable to Start selfie eKYC for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: startSelfieEkycMutation,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });

  it('Start selfie eKYC with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: partialStartSelfieEkycMutation,
      });

    const { startSelfieEkyc } = response.body.data;

    expect(response.status).toEqual(HttpStatus.OK);
    expect(startSelfieEkyc).toHaveProperty('status');
    expect(startSelfieEkyc).not.toHaveProperty('code');
    expect(startSelfieEkyc).not.toHaveProperty('selfieUrl');
    expect(startSelfieEkyc).not.toEqual(startSelfieEkycFinalFixture);
  });

  it('Start selfie eKYC with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: startSelfieEkycWithExtraFieldsMutation,
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

  it('Upload document.txt eKYC', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.png');

    request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadDocumentEkycMutation,
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath)
      .expect(({ body }) => {
        expect(body.data.uploadDocumentEkyc).toBeDefined();
        expect(body.data.uploadDocumentEkyc).toEqual(
          uploadDocumentEkycPartBackFinalFixture,
        );
      })
      .expect(HttpStatus.OK);
  });

  it('Upload document.txt eKYC with partial response', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.png');

    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: partialUploadDocumentEkycMutation,
          variables: {
            somefile: null,
          },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        const { uploadDocumentEkyc } = body.data;
        expect(uploadDocumentEkyc).toHaveProperty('status');
        expect(uploadDocumentEkyc).not.toHaveProperty('code');
        expect(uploadDocumentEkyc).not.toHaveProperty('message');
        expect(uploadDocumentEkyc).not.toHaveProperty('part');
        expect(uploadDocumentEkyc).not.toHaveProperty('nextAction');
        expect(uploadDocumentEkyc).not.toEqual(
          uploadDocumentEkycPartBackFinalFixture,
        );
      });
  });

  it('Unable to Upload document.txt eKYC for unauthorized user', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.png');

    request(app.getHttpServer())
      .post(gql)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadDocumentEkycMutation,
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(
          gatewayErrorMessages.wasNotProvided,
        );
        expect(body.errors[0].code).toContain(
          responseBodyErrorMessages.unauthenticated,
        );
      });
  });

  it('Upload document.txt eKYC without file', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadDocumentEkycMutationWithoutFile,
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      );

    expect(response.body.data).toBeUndefined();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.uploadUnsupported,
    );
    expect(response.body.errors[0].code).toBe(
      responseBodyErrorMessages.graphValidationFailed,
    );
  });

  it('Upload document.txt eKYC with invalid file extension', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.txt');

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadDocumentEkycMutation,
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath);

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.extensionError,
    );
    expect(response.body.errors[0].code).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Upload document.txt eKYC with unexpected response fields', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.png');

    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: uploadDocumentEkycWithExtraFieldsMutation,
          variables: {
            somefile: null,
          },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.data).toBeUndefined();
        expect(response.body.errors[0].message).toContain(
          gatewayErrorMessages.cantQueryField,
        );
        expect(response.body.errors[0].code).toBe(
          responseBodyErrorMessages.graphValidationFailed,
        );
      });
  });

  it('Upload document.txt eKYC with missing required field', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.png');

    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: missingFieldUploadDocumentEkycMutation,
          variables: {
            somefile: null,
          },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.errors[0].message).toContain(
          gatewayErrorMessages.wasNotProvided,
        );
        expect(response.body.errors[0].code).toBe(
          responseBodyErrorMessages.graphValidationFailed,
        );
      });
  });

  it('Upload document.txt eKYC with invalid part', async () => {
    const imagePath = join(__dirname, '/assets/driving_license.png');

    await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('Content-Type', 'multipart/form-data')
      .set('Apollo-Require-Preflight', 'true')
      .field(
        'operations',
        JSON.stringify({
          query: invalidPartUploadDocumentEkycMutation,
          variables: {
            somefile: null,
          },
        }),
      )
      .field(
        'map',
        JSON.stringify({
          '0': ['variables.somefile'],
        }),
      )
      .attach('0', imagePath)
      .expect(HttpStatus.BAD_REQUEST) // Assuming 400 Bad Request is returned for invalid document.txt part
      .expect((response) => {
        expect(response.body.data).toBeUndefined();
        expect(response.body.errors[0].message).toContain(
          gatewayErrorMessages.doesNotExist,
        );
        expect(response.body.errors[0].code).toBe(
          responseBodyErrorMessages.graphValidationFailed,
        );
      });
  });

  it('Start Jumio eKYC', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: startJumioEkycMutation,
      });

    expect(extractGqlResponse(response, 'startJumioEkyc')).toEqual(
      startJumioEkycFinalFixture,
    );
  });

  it('Unable to Start Jumio eKYC for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: startJumioEkycMutation,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });

  it('Start Jumio eKYC with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: partialStartJumioEkycMutation,
      });

    const result = extractGqlResponse(response, 'startJumioEkyc');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(result).toHaveProperty('status');
    expect(result).not.toHaveProperty('code');
    expect(result).not.toHaveProperty('ekycUrl');
    expect(result).not.toEqual(startJumioEkycFinalFixture);
  });

  it('Start Jumio eKYC with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: startJumioEkycWithExtraFieldsMutation,
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
