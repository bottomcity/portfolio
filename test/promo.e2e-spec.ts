import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import {
  getPromoListFinalFixture,
  getPromoRunFalseInteractionFinalFixture,
  getPromoRunFinalTrueIntaractionFixture,
} from './mocks/fixtures/sig';
import {
  partialPromoRunMutation,
  promoRunMutation,
  promoRunWithExtraFieldsMutation,
} from './mutations/promo-run.mutation';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import {
  getQueryPromoList,
  getQueryPromoListWithExtraField,
  partialGetQueryPromoList,
} from './queries';

const gql = '/graphql';

describe('Promo (e2e)', () => {
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

  it('Get Promo List', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getQueryPromoList,
      });

    expect(extractGqlResponse(response, 'getPromoList')).toEqual(
      getPromoListFinalFixture,
    );
  });

  it('Get Promo List with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: partialGetQueryPromoList,
      });

    const requestWithdrawal = extractGqlResponse(response, 'getPromoList');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(requestWithdrawal).toHaveProperty('requestUuid');
    expect(requestWithdrawal).toHaveProperty('message');
    expect(requestWithdrawal).not.toHaveProperty('code');
    expect(requestWithdrawal).not.toHaveProperty('status');
    expect(requestWithdrawal).not.toHaveProperty('accessibilities');
    expect(requestWithdrawal).not.toEqual(getPromoListFinalFixture);
  });

  it('Get Promo List with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: getQueryPromoListWithExtraField,
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.cantQueryField,
    );
    expect(response.body.errors[0].code).toEqual(
      responseBodyErrorMessages.graphValidationFailed,
    );
  });

  it('Unable to Get Promo List for unauthorized user', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: getQueryPromoList,
    });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Promo Run (interaction: false)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: promoRunMutation('false'),
      });

    expect(extractGqlResponse(response, 'promoRun')).toEqual(
      getPromoRunFalseInteractionFinalFixture,
    );
  });

  it('Promo Run (interaction: true)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: promoRunMutation('true'),
      });

    expect(extractGqlResponse(response, 'promoRun')).toEqual(
      getPromoRunFinalTrueIntaractionFixture,
    );
  });

  it('Unable to Get Promo Run for unauthorized user', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: promoRunMutation('true'),
      });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Promo Run failed', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: promoRunMutation('fail'),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.failedMessage,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Promo Run with missing promo ID', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: promoRunMutation(''),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.shouldNotBeEmpty,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Promo Run with extra unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: promoRunWithExtraFieldsMutation,
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.cantQueryField,
    );
    expect(response.body.errors[0].code).toEqual(
      responseBodyErrorMessages.graphValidationFailed,
    );
  });

  it('Promo Run with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: partialPromoRunMutation,
      });

    const requestWithdrawal = extractGqlResponse(response, 'promoRun');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(requestWithdrawal).toHaveProperty('requestUuid');
    expect(requestWithdrawal).toHaveProperty('message');
    expect(requestWithdrawal).not.toHaveProperty('code');
    expect(requestWithdrawal).not.toHaveProperty('status');
    expect(requestWithdrawal).not.toHaveProperty('accessibilities');
    expect(requestWithdrawal).not.toEqual(
      getPromoRunFinalTrueIntaractionFixture,
    );
  });
});
