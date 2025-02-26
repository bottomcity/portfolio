import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from './enums/messages-enums';
import { SportbookHistoryResponseFinalFixture } from './mocks/fixtures/sig';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import {
  getSportbookHistoryQuery,
  getSportbookHistoryQueryHelper,
  getSportbookHistoryQueryPartialResponse,
  getSportbookHistoryQueryUnexpectedField,
  getSportbookHistoryQueryWithoutPageAndLimit,
} from './queries';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Sportbook history (e2e)', () => {
  let app: INestApplication;
  let postOtpToken: string[];
  const testValues = [-1, 0.9, 15.1];

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

  it('Should return sportbook history', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getSportbookHistoryQuery,
      });

    expect(extractGqlResponse(response, 'getSportbookHistory')).toEqual(
      SportbookHistoryResponseFinalFixture,
    );
  });

  it('Should not return sportbook hisotry for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getSportbookHistoryQuery,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Should not return sportbook history with invalid page values', async () => {
    for (const value of testValues) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: getSportbookHistoryQueryHelper(value, 20),
        });

      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
    }
  });

  it('Should not return sportbook history with invalid limit value', async () => {
    for (const value of testValues) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: getSportbookHistoryQueryHelper(1, value),
        });

      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
    }
  });

  it('Should not return sportbook history with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getSportbookHistoryQueryUnexpectedField,
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

  it('Should return sportbokk history with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getSportbookHistoryQueryPartialResponse,
      });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).not.toHaveProperty('status');
    expect(extractGqlResponse(response, 'getSportbookHistory')).not.toEqual(
      SportbookHistoryResponseFinalFixture,
    );
  });

  it('Should return sportbook history without page and/or limit', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getSportbookHistoryQueryWithoutPageAndLimit,
      });

    expect(extractGqlResponse(response, 'getSportbookHistory')).toEqual(
      SportbookHistoryResponseFinalFixture,
    );
  });
});
