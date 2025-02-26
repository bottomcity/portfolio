import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WITHDRAWAL_API_KEY } from '@config';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';
import {
  amountMoney,
  testNames,
  testUsernames,
} from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  gatewayGACMACErrorMessages,
} from '@test/enums/messages-enums';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Withdrawal (e2e)', () => {
  let app: INestApplication;

  const patron_number = testUsernames.defaultUsername;
  const patron_name = testNames.testName;
  const actual_transaction_date = '09/06/2024 10:00 PM';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return forbidden for WITHDRAWAL API KEY', async () => {
    const response = await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', patron_name)
      .send({
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      });

    expect(response.body.message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return an error for each empty field in the withdrawal request', async () => {
    const testCases = [
      {
        patron_number: '',
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: '',
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: null,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: '',
      },
    ];

    for (const testCase of testCases) {
      const response = await request(app.getHttpServer())
        .post('/withdrawal/aggregate-amount')
        .set('api-key', WITHDRAWAL_API_KEY)
        .send(testCase);

      const containsSubstring = response.body.message.some((msg: any) =>
        msg.includes(gatewayErrorMessages.shouldNotBeEmpty),
      );

      expect(containsSubstring).toBe(true);
      expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Should return error for invalid patron number', async () => {
    const response = await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', WITHDRAWAL_API_KEY)
      .send({
        patron_number: testUsernames.invalidUsername,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      });

    const containsSubstring = response.body.message.some((msg: any) =>
      msg.includes(gatewayErrorMessages.mustBeMax32),
    );

    expect(containsSubstring).toBe(true);
    expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error for aggregated amount less minimum', async () => {
    const response = await request(app.getHttpServer())
      .post('/withdrawal/aggregate-amount')
      .set('api-key', WITHDRAWAL_API_KEY)
      .send({
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount399k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      });

    const containsSubstring = response.body.message.some((msg: any) =>
      msg.includes(gatewayErrorMessages.mustNotBeLess),
    );

    expect(containsSubstring).toBe(true);
    expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error when fields (patron_name, from, to, actual_transaction_date) are numbers', async () => {
    const testCases = [
      {
        patron_number: patron_number,
        patron_name: amountMoney.validAmount,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: amountMoney.validAmount,
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: amountMoney.validAmount,
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: patron_number,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: amountMoney.validAmount,
      },
    ];

    for (const testCase of testCases) {
      const response = await request(app.getHttpServer())
        .post('/withdrawal/aggregate-amount')
        .set('api-key', WITHDRAWAL_API_KEY)
        .send(testCase);

      const containsSubstring = response.body.message.some((msg: any) =>
        msg.includes(gatewayErrorMessages.mustBeAString),
      );

      expect(containsSubstring).toBe(true);
      expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Should return error when fields (patron_number, aggregate_amount) are strings', async () => {
    const testCases = [
      {
        patron_number: patron_name,
        patron_name: patron_name,
        aggregate_amount: amountMoney.amount400k,
        from: '09/06/2024 06:00 AM',
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
      {
        patron_number: '30000012',
        patron_name: patron_name,
        aggregate_amount: patron_name,
        from: amountMoney.validAmount,
        to: '09/07/2024 05:59:59 AM',
        actual_transaction_date: actual_transaction_date,
      },
    ];

    for (const testCase of testCases) {
      const response = await request(app.getHttpServer())
        .post('/withdrawal/aggregate-amount')
        .set('api-key', WITHDRAWAL_API_KEY)
        .send(testCase);

      const containsSubstring = response.body.message.some((msg: any) =>
        msg.includes(gatewayErrorMessages.mustBeANumber),
      );

      expect(containsSubstring).toBe(true);
      expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    }
  });
});
