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
  mayaTransfer,
  redirectUrl,
  selectedBankCodeId,
  testNames,
  testPhoneNumbers,
  testPINs,
} from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';
import { sigBalanceServiceMock } from '@test/mocks/sig/sig-balance.service.mock';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import {
  getPatronBalanceWithNegativeValuesFixture,
  GetUserProfileServiceFixture,
  mayaTransferFinalFixture,
  requestWithdrawalFinalFixture,
  requestWithdrawalPaymayaFinalFixture,
} from './mocks/fixtures/sig';
import {
  requestDragonPayWithdrawalMutation,
  requestDragonPayWithdrawalMutationWithInvalidEmail,
  requestDragonPayWithdrawalMutationWithInvalidNames,
  requestDragonPayWithdrawalMutationWithMissingFields,
  requestWithdrawalMutation,
  requestWithdrawalMutationExtraFields,
  requestWithdrawalMutationPartialResponse,
} from './mutations/request-withdrawal.mutation';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import { requestMayaTransferMutation } from './mutations';

const gql = '/graphql';

describe('Withdrawal (e2e)', () => {
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

  it('Request withdrawal', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl[0],
        ),
      });

    const { requestWithdrawal } = response.body.data;

    expect(requestWithdrawal).toEqual(requestWithdrawalFinalFixture);
  });

  it('Request withdrawal with partial response', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutationPartialResponse,
      });

    const requestWithdrawal = extractGqlResponse(response, 'requestWithdrawal');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(requestWithdrawal).toHaveProperty('requestUuid');
    expect(requestWithdrawal).toHaveProperty('data');
    expect(requestWithdrawal).not.toHaveProperty('code');
    expect(requestWithdrawal).not.toHaveProperty('status');
    expect(requestWithdrawal).not.toHaveProperty('message');
    expect(requestWithdrawal).not.toEqual(requestWithdrawalFinalFixture);
  });

  it('Request withdrawal with unexpected response fields', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutationExtraFields,
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

  it('Unable to request withdrawal for unauthorized user', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl[0],
        ),
      });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Request invalid withdrawal with amount below minimum', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.invalidBottomLevel,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl[0],
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustNotBeLess,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal greater than on balance', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmountGreaterBalance,
          bankCode.UB,
          selectedBankCodeId.PhilippineNationalBank,
          bankMode.instapay,
          testPINs.defaultPIN,
          redirectUrl[0],
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.insufficientFunds,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with invalid long bank code', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.invalidLongBankCode,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl[0],
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe64,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with invalid long bank mode', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.invalidLongBankMode,
          testPINs.defaultPIN,
          redirectUrl[0],
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe64,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with invalid long bank account number', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPhoneNumbers.invalidLongBankAccountNumber,
          redirectUrl[0],
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeMax45,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with invalid (string) bank account number', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          bankCode.UB,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBeANumber,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with invalid long redirect URL', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl.invalidLongRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe255,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with missing required fields', async () => {
    const requiredFields = [
      'bankCode',
      'selectedBankCodeId',
      'bankMode',
      'bankAccountNumber',
      'redirectUrl',
    ];

    const baseValidInputs = {
      bankCode: bankCode.UB,
      selectedBankCodeId: selectedBankCodeId.UnionBank,
      bankMode: bankMode.ubOnline,
      bankAccountNumber: testPINs.defaultPIN,
      redirectUrl: redirectUrl.validRedirectUrl,
    };

    for (const field of requiredFields) {
      const inputs = { ...baseValidInputs, [field]: '' };

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: requestWithdrawalMutation(
            amountMoney.validAmount,
            inputs.bankCode,
            inputs.selectedBankCodeId,
            inputs.bankMode,
            inputs.bankAccountNumber,
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

  it('Request withdrawal with exceed daily amount', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.DevelopmentBankPhilippines,
          bankMode.instapay,
          testPINs.defaultPIN,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.exceedDailyAmount,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal failed', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.Metrobank,
          bankMode.instapay,
          testPINs.defaultPIN,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.failedMessage,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request paymaya withdrawal with correct amount', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.MY,
          selectedBankCodeId.BankPaymaya,
          bankMode.paymaya,
          testPINs.defaultPIN,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(extractGqlResponse(response, 'requestWithdrawal')).toEqual(
      requestWithdrawalPaymayaFinalFixture,
    );
  });

  it('Request withdrawal with ekyc status false', async () => {
    GetUserProfileServiceFixture.data.ekyc.status = false;
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl.validRedirectUrl,
        ),
      });
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.notVerifiedProfile,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request withdrawal with amount over the cashout maximum limit', async () => {
    GetUserProfileServiceFixture.data.ekyc.status = false;
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.exceedPaymayaLevel,
          bankCode.MY,
          selectedBankCodeId.BankPaymaya,
          bankMode.paymaya,
          testPINs.defaultPIN,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.maximumCashoutLimitExceed,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors[0].data).toBeDefined();
    expect(response.body.errors[0].data.maxWithdrawalLimit).toEqual(50000);
  });

  it('Request maya transfer(code and correlationId are from maya withdrawal callbackUrl)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestMayaTransferMutation(
          mayaTransfer.correlationId,
          mayaTransfer.code,
        ),
      });

    expect(extractGqlResponse(response, 'requestMayaTransfer')).toEqual(
      mayaTransferFinalFixture,
    );
  });

  it('Request DragonPay withdrawal', async () => {
    GetUserProfileServiceFixture.data.ekyc.status = true;

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDragonPayWithdrawalMutation(
          amountMoney.validAmount,
          bankCode.DP,
          selectedBankCodeId.DragonPayGcash,
          bankMode.DP,
          testPINs.defaultPIN,
          redirectUrl[0],
          testNames.testName,
        ),
      });

    expect(extractGqlResponse(response, 'requestWithdrawal')).toEqual(
      requestWithdrawalFinalFixture,
    );
  });

  it('Request DragonPay withdrawal with invalid email', async () => {
    GetUserProfileServiceFixture.data.ekyc.status = true;

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDragonPayWithdrawalMutationWithInvalidEmail(
          amountMoney.validAmount,
          bankCode.DP,
          selectedBankCodeId.DragonPayGcash,
          bankMode.DP,
          testPINs.defaultPIN,
          redirectUrl[0],
          testNames.testName,
        ),
      });
    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.invalidEmail,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request DragonPay withdrawal with invalid names', async () => {
    GetUserProfileServiceFixture.data.ekyc.status = true;

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDragonPayWithdrawalMutationWithInvalidNames(
          amountMoney.validAmount,
          bankCode.DP,
          selectedBankCodeId.DragonPayGcash,
          bankMode.DP,
          testPINs.defaultPIN,
          redirectUrl[0],
          testNames.invalidLong129Name,
        ),
      });
    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toContain(
      gatewayErrorMessages.mustBe128,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Request DragonPay withdrawal with missing required fields', async () => {
    const requiredDragonPayFields = [
      'lastName',
      'firstName',
      'country',
      'zipCode',
      'province',
      'city',
      'streetAddressOne',
    ];

    const baseValidDragonPayInputs = {
      lastName: testNames.testName,
      firstName: testNames.testName,
      country: testNames.testName,
      zipCode: testPINs.defaultPIN,
      province: testNames.testName,
      city: testNames.testName,
      streetAddressOne: testNames.testName,
    };

    for (const field of requiredDragonPayFields) {
      const inputs = { ...baseValidDragonPayInputs, [field]: '' };

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: requestDragonPayWithdrawalMutationWithMissingFields(
            inputs.lastName,
            inputs.firstName,
            inputs.country,
            inputs.zipCode,
            inputs.province,
            inputs.city,
            inputs.streetAddressOne,
          ),
        });

      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        gatewayErrorMessages.shouldNotBeEmpty,
      );
      expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Request DragonPay withdrawal with bank_dragonpay', async () => {
    GetUserProfileServiceFixture.data.ekyc.status = true;

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestDragonPayWithdrawalMutationWithInvalidEmail(
          amountMoney.validAmount,
          bankCode.DP,
          selectedBankCodeId.DragonPay,
          bankMode.DP,
          testPINs.defaultPIN,
          redirectUrl[0],
          testNames.testName,
        ),
      });
    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Block Withdrawal with Negative Balance', async () => {
    sigBalanceServiceMock.getBalance.mockImplementationOnce(() =>
      Promise.resolve(getPatronBalanceWithNegativeValuesFixture),
    );

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutation(
          amountMoney.validAmount, // Attempting withdrawal
          bankCode.UB,
          selectedBankCodeId.UnionBank,
          bankMode.ubOnline,
          testPINs.defaultPIN,
          redirectUrl.validRedirectUrl,
        ),
      });

    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });
});
