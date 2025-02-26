import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import { TransactionHistoryTabEnum } from '@gateway/enums';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from './enums/messages-enums';
import { TransactionsHistoryFinalFixture } from './mocks/fixtures/sig';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import {
  getTransactionsHistoryQuery,
  getTransactionsHistoryQueryHelper,
  getTransactionsHistoryWithoutFilterFieldQuery,
  getTransactionsQueryPartialResponse,
  getTransactionsQueryUnexpectedField,
} from './queries';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Transactions history (e2e)', () => {
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

  it('Should return transactions history', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryQuery,
      });

    expect(extractGqlResponse(response, 'getTransactionsHistory')).toEqual(
      TransactionsHistoryFinalFixture,
    );
  });

  it('Should return transactions history even is startDate is equal to endDate', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryQueryHelper(
          1,
          20,
          TransactionHistoryTabEnum.ALL,
          '2024-10-10',
          '2024-10-10',
        ),
      });

    expect(extractGqlResponse(response, 'getTransactionsHistory')).toEqual(
      TransactionsHistoryFinalFixture,
    );
  });

  it('Should not return transactions history for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getTransactionsHistoryQuery,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Should return an error when filter is empty', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryWithoutFilterFieldQuery,
      });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].code).toEqual(
      responseBodyErrorMessages.graphValidationFailed,
    );
  });

  it('Should not return transactions history with invalid page values', async () => {
    for (const value of testValues) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: getTransactionsHistoryQueryHelper(
            value,
            20,
            TransactionHistoryTabEnum.ALL,
            '2024-10-10',
            '2024-10-15',
          ),
        });

      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
    }
  });

  it('Should not return transactions history with invalid limit value', async () => {
    for (const value of testValues) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: getTransactionsHistoryQueryHelper(
            1,
            value,
            TransactionHistoryTabEnum.ALL,
            '2024-10-10',
            '2024-10-15',
          ),
        });

      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
    }
  });

  it('Should return an error if invalid filter', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryQueryHelper(
          1,
          20,
          responseBodyErrorMessages.graphValidationFailed as unknown as TransactionHistoryTabEnum.ALL,
          '2024-10-10',
          '2024-10-15',
        ),
      });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].code).toEqual(
      responseBodyErrorMessages.graphValidationFailed,
    );
  });

  it('Should return an error if startDate is not in YYYY-MM-DD format', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryQueryHelper(
          1,
          20,
          TransactionHistoryTabEnum.ALL,
          new Date('2024-10-10'),
          '2024-10-15',
        ),
      });

    expect(response.body.errors).toBeDefined();
  });

  it('Should return an error if endDate is not in YYYY-MM-DD format', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryQueryHelper(
          1,
          20,
          TransactionHistoryTabEnum.ALL,
          '2024-10-10',
          new Date('2024-10-15'),
        ),
      });

    expect(response.body.errors).toBeDefined();
  });

  it('Should return an error if endDate is not later then startDate', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsHistoryQueryHelper(
          1,
          20,
          TransactionHistoryTabEnum.ALL,
          '2024-10-10',
          '2024-10-09',
        ),
      });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toEqual(
      'endDate must be later than startDate',
    );
  });

  it('Should not return transactions history with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsQueryUnexpectedField,
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

  it('Should return transactions history with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getTransactionsQueryPartialResponse,
      });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).not.toHaveProperty('status');
    expect(extractGqlResponse(response, 'getUserTransactions')).not.toEqual(
      TransactionsHistoryFinalFixture,
    );
  });
});
