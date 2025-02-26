import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import {
  amountMoney,
  bankCode,
  bankMode,
  redirectUrl,
  selectedBankCodeId,
  testNames,
} from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';
import { requestWithdrawalFinalFixture } from '@test/mocks/fixtures/sig';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { requestDepositFinalFixture } from './mocks/fixtures/sig/request-deposit.fixture';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import {
  requestDepositMutation,
  requestDepositMutationExtraFields,
  requestDepositMutationPartialResponse,
} from './mutations';

const gql = '/graphql';

describe('Deposit (e2e)', () => {
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

  it('Request deposit', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          redirectUrl.validRedirectUrl,
        ),
      });

    const { requestDeposit } = response.body.data;

    expect(requestDeposit).toEqual(requestDepositFinalFixture);
  });

  it('Request deposit with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutationPartialResponse,
      });

    const requestWithdrawal = extractGqlResponse(response, 'requestDeposit');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(requestWithdrawal).toHaveProperty('requestUuid');
    expect(requestWithdrawal).toHaveProperty('data');
    expect(requestWithdrawal).not.toHaveProperty('code');
    expect(requestWithdrawal).not.toHaveProperty('status');
    expect(requestWithdrawal).not.toHaveProperty('message');
    expect(requestWithdrawal).not.toEqual(requestWithdrawalFinalFixture);
  });

  it('Request deposit with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutationExtraFields,
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

  it('Unable to request deposit for unauthorized user', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Request invalid deposit with amount below minimum', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.invalidBottomLevel,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustNotBeLess,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request invalid deposit with amount above maximum', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.invalidTopLevel,
          bankCode.UB,
          selectedBankCodeId.DevelopmentBankPhilippines,
          bankMode.instapay,
          redirectUrl.validRedirectUrl,
        ),
      });
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.depositLimitExceeded,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request deposit with invalid long bank code', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmount,
          bankCode.invalidLongBankCode,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe64,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request deposit with invalid long bank mode', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.invalidLongBankMode,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe64,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request deposit with invalid long redirect URL', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          redirectUrl.invalidLongRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe255,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request deposit with missing required fields', async () => {
    const requiredFields = [
      'bankCode',
      'selectedBankCodeId',
      'bankMode',
      'redirectUrl',
    ];

    const baseValidInputs = {
      bankCode: bankCode.UB,
      selectedBankCodeId: selectedBankCodeId.UnionBank,
      bankMode: bankMode.ubOnline,
      redirectUrl: redirectUrl.validRedirectUrl,
    };

    for (const field of requiredFields) {
      const inputs = { ...baseValidInputs, [field]: '' };

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: requestDepositMutation(
            amountMoney.validAmount,
            inputs.bankCode,
            inputs.selectedBankCodeId,
            inputs.bankMode,
            inputs.redirectUrl,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Request deposit failed', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmountGreaterBalance,
          bankCode.BDO,
          selectedBankCodeId.BDOUnibank,
          bankMode.bdo,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.failedMessage,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request deposit failed because of bank code does not exist in DB', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmountGreaterBalance,
          testNames.testName,
          selectedBankCodeId.BDOUnibank,
          bankMode.ubOnline,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.doesNotExist,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Request deposit failed because of bank mode does not exist in DB', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmountGreaterBalance,
          bankCode.UB,
          selectedBankCodeId.BDOUnibank,
          testNames.testName,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.doesNotExist,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Request deposit failed because of bank code ID does not exist in DB', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmountGreaterBalance,
          bankCode.UB,
          testNames.testName,
          bankMode.instapay,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.doesNotExist,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Request deposit failed because of max limit exceed', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.exceedPaymayaLevel,
          bankCode.UB,
          selectedBankCodeId.PhilippineNationalBank,
          bankMode.instapay,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.depositLimitExceeded,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request DragonPay deposit', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDepositMutation(
          amountMoney.validAmount,
          bankCode.DP,
          selectedBankCodeId.DragonPay,
          bankMode.DP,
          redirectUrl.validRedirectUrl,
        ),
      });

    const { requestDeposit } = response.body.data;

    expect(requestDeposit).toEqual(requestDepositFinalFixture);
  });
});
