import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import {
  getPatronBalanceFinalFixture,
  getPatronBalanceNegativeValuesFinalFixture,
  getPatronBalanceWithNegativeValuesFixture,
  getPatronBalanceWithZeroValuesFinalFixture,
  getPatronBalanceWithZeroValuesFixture,
} from './mocks/fixtures/sig';
import { sigBalanceServiceMock } from './mocks/sig/sig-balance.service.mock';
import { cookieOtpTokenHelper } from './helpers';
import { getPatronBalanceQuery } from './queries';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Balance (e2e)', () => {
  let app: INestApplication;
  let postOtpToken: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
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

  it('Get Patron Balance', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getPatronBalanceQuery,
      });
    const { getPatronBalance } = response.body.data;

    expect(getPatronBalance).toEqual(getPatronBalanceFinalFixture);
  });

  it('Get Patron Balance with negative values', async () => {
    sigBalanceServiceMock.getBalance.mockImplementationOnce(() =>
      Promise.resolve(getPatronBalanceWithNegativeValuesFixture),
    );
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getPatronBalanceQuery,
      });
    const { getPatronBalance } = response.body.data;

    expect(getPatronBalance).toEqual(
      getPatronBalanceNegativeValuesFinalFixture,
    );
  });

  it('Get Patron Balance with zero values', async () => {
    sigBalanceServiceMock.getBalance.mockImplementationOnce(() =>
      Promise.resolve(getPatronBalanceWithZeroValuesFixture),
    );
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getPatronBalanceQuery,
      });
    const { getPatronBalance } = response.body.data;

    expect(getPatronBalance).toEqual(
      getPatronBalanceWithZeroValuesFinalFixture,
    );
  });

  it('Unable to Get Patron Balance for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getPatronBalanceQuery,
    });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });

  it('Should return unauthorized for invalid or expired cookie for getPatronBalance Query', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', 'invalid_cookie') // Simulating an invalid cookie
      .send({
        query: getPatronBalanceQuery,
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });
});
