import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WITHDRAWAL_API_KEY } from '@config';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import { EmailService } from '@gateway/services';
import { EmailProvider } from '@gateway/services/email/email.enum';
import {
  amountMoney,
  testNames,
  testUsernames,
} from '@test/enums/data-for-inputs-enums';
import { gatewayErrorMessages } from '@test/enums/messages-enums';
import { cookieOtpTokenHelper } from '@test/helpers';
import {
  requestWithdrawalMutationForAggregatedEmail,
  requestWithdrawalMutationForMoreThan500kEmail,
} from '@test/mutations/request-withdrawal.mutation';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { getPatronBalanceFixture } from './mocks/fixtures/sig';

import { AppModule } from '../src/app.module';
const gql = '/graphql';

describe('Email Service (e2e)', () => {
  let app: INestApplication;
  let sendMailSpy: jest.SpyInstance;
  let loggerErrorMock: jest.SpyInstance<
    void,
    [message: any, ...optionalParams: any[]],
    any
  >;
  let postOtpToken: string[];

  const patron_number = testUsernames.defaultUsername;
  const patron_name = testNames.testName;
  const actual_transaction_date = '09/06/2024 10:00 PM';

  const baseRequestBody = {
    patron_number: patron_number,
    patron_name: patron_name,
    from: '09/06/2024 06:00 AM',
    to: '09/07/2024 05:59:59 AM',
    actual_transaction_date: actual_transaction_date,
  };

  const sendMailCommonExpectations = (amount, subjectText, emailText) => {
    expect(sendMailSpy).toHaveBeenCalledWith({
      from: process.env.SENDER_EMAIL,
      to: process.env.RECIPIENT_EMAIL,
      subject: subjectText,
      text: emailText,
    });
  };

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
  });

  beforeEach(async () => {
    const emailService = app.get<EmailService>(
      EmailProvider.ISSUE_EMAIL_SERVICE,
    );

    sendMailSpy = jest
      .spyOn(emailService['transporter'], 'sendMail')
      .mockResolvedValue({
        accepted: [process.env.RECIPIENT_EMAIL],
        rejected: [],
        envelope: {
          from: process.env.SENDER_EMAIL,
          to: [process.env.RECIPIENT_EMAIL],
        },
        messageId: '<test-message-id>',
      });
    loggerErrorMock = jest.spyOn(emailService['logger'], 'error');
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send an email if 400k or more transaction is made', async () => {
    await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', WITHDRAWAL_API_KEY)
      .send({
        ...baseRequestBody, // Spread the common object
        aggregate_amount: amountMoney.amount400k, // Override this field
      })
      .expect(HttpStatus.CREATED);

    expect(sendMailSpy).toHaveBeenCalledTimes(1);

    sendMailCommonExpectations(
      amountMoney.amount400k,
      `Big Amount 400k to 500k - ${patron_number} - ${actual_transaction_date}`,
      `Please note that Patron ${patron_number} ${patron_name} did a single/aggregate withdrawal of ${amountMoney.amount400k}.\n
  Please conduct the SOF and Game review report.\n
  *This message is system generated.`,
    );
  });

  it('should send an email when big amount 500k transaction is made', async () => {
    await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', WITHDRAWAL_API_KEY)
      .send({
        ...baseRequestBody, // Spread the common object
        aggregate_amount: amountMoney.invalidTopLevel, // Override this field
      })
      .expect(HttpStatus.CREATED);

    expect(sendMailSpy).toHaveBeenCalledTimes(1);

    sendMailCommonExpectations(
      amountMoney.invalidTopLevel,
      `Big Amount > 500k - ${patron_number} - ${actual_transaction_date}`,
      `Please note that Patron ${patron_number} ${patron_name} did a single/aggregate withdrawal of ${amountMoney.invalidTopLevel}.\n
  Allowable Daily Withdrawable amount is 500000.\n
  Please report the technical issue to the Payment Manager and Tech team.\n
  *This message is system generated.`,
    );
  });

  it('should log an error if email sending fails for 500k limit', async () => {
    sendMailSpy.mockRejectedValueOnce(
      new Error('Simulated email sending failure'),
    );

    await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', WITHDRAWAL_API_KEY)
      .send({
        ...baseRequestBody, // Spread the common object
        aggregate_amount: amountMoney.invalidTopLevel, // Override this field
      });

    expect(loggerErrorMock).toHaveBeenCalledWith(
      'Error sending email: ',
      expect.any(Error),
    );
  });

  it('should log an error if email sending fails for 400k to 500k limit', async () => {
    sendMailSpy.mockRejectedValueOnce(
      new Error('Simulated email sending failure'),
    );

    await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', WITHDRAWAL_API_KEY)
      .send({
        ...baseRequestBody, // Spread the common object
        aggregate_amount: amountMoney.amount400k, // Override this field
      });

    expect(loggerErrorMock).toHaveBeenCalledWith(
      'Error sending email: ',
      expect.any(Error),
    );
  });

  it('send an email when query withdrawal more than 400k aggregate', async () => {
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
    getPatronBalanceFixture.data.sig_wallet.CASH = 600000;
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutationForAggregatedEmail,
      });

    const { requestWithdrawal } = response.body.data;

    expect(requestWithdrawal.message).toEqual(
      gatewayErrorMessages.aggregatedAmount400kAggregated,
    );

    if (
      requestWithdrawal.message ===
      gatewayErrorMessages.aggregatedAmount400kAggregated
    ) {
      await request(app.getHttpServer())
        .post('/withdrawal/aggregate-amount')
        .set('api-key', WITHDRAWAL_API_KEY)
        .send({
          ...baseRequestBody, // Spread the common object
          aggregate_amount: amountMoney.amount400k, // Override this field
        })
        .expect(HttpStatus.CREATED);
    }

    expect(sendMailSpy).toHaveBeenCalledTimes(1);

    sendMailCommonExpectations(
      amountMoney.amount400k,
      `Big Amount 400k to 500k - ${patron_number} - ${actual_transaction_date}`,
      `Please note that Patron ${patron_number} ${patron_name} did a single/aggregate withdrawal of ${amountMoney.amount400k}.\n
  Please conduct the SOF and Game review report.\n
  *This message is system generated.`,
    );
  });

  it('send an email when query withdrawal more than 500k is made', async () => {
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: requestWithdrawalMutationForMoreThan500kEmail,
      });

    const message = response.body.errors[0].message;

    expect(message).toEqual(gatewayErrorMessages.maximumCashoutLimitExceed);

    if (message === gatewayErrorMessages.maximumCashoutLimitExceed) {
      await request(app.getHttpServer())
        .post('/withdrawal/aggregate-amount')
        .set('api-key', WITHDRAWAL_API_KEY)
        .send({
          ...baseRequestBody, // Spread the common object
          aggregate_amount: amountMoney.invalidTopLevel, // Override this field
        })
        .expect(HttpStatus.CREATED);
    }

    expect(sendMailSpy).toHaveBeenCalledTimes(1);

    sendMailCommonExpectations(
      amountMoney.invalidTopLevel,
      `Big Amount > 500k - ${patron_number} - ${actual_transaction_date}`,
      `Please note that Patron ${patron_number} ${patron_name} did a single/aggregate withdrawal of ${amountMoney.invalidTopLevel}.\n
  Allowable Daily Withdrawable amount is 500000.\n
  Please report the technical issue to the Payment Manager and Tech team.\n
  *This message is system generated.`,
    );
  });
});
