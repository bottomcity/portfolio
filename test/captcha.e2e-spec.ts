import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CaptchaEnum } from '@enums';
import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@filters';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { validateCaptchaFinalFixture } from './mocks/fixtures/cf';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import { logoutMutation, ValidateCaptureMutation } from './mutations';

const gql = '/graphql';

describe('Captcha (e2e)', () => {
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

    //TODO: will have TypeError: Cannot read properties of null (reading 'publish') if remove
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Validate captcha', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: ValidateCaptureMutation,
    });

    const result = extractGqlResponse(response, 'validateCapture');

    expect(result).toEqual(validateCaptchaFinalFixture);
  });

  it('Should have cookie after captcha validation', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: ValidateCaptureMutation,
    });

    const result = extractGqlResponse(response, 'validateCapture');

    expect(result).toEqual(validateCaptchaFinalFixture);

    const cookies = response.headers['set-cookie'] as unknown as string[];

    expect(
      cookies.some((str) => str.startsWith(CaptchaEnum.validateCaptcha)),
    ).toBe(true);
  });

  it('Should save captcha cookie after logout', async () => {
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);

    const response = await request(app.getHttpServer()).post(gql).send({
      query: ValidateCaptureMutation,
    });

    const result = extractGqlResponse(response, 'validateCapture');

    const cookies = response.headers['set-cookie'] as unknown as string[];

    expect(result).toEqual(validateCaptchaFinalFixture);

    const logOutresponse = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken.concat(cookies))
      .send({
        query: logoutMutation,
      });

    const cookiesAfterLogout = logOutresponse.headers[
      'set-cookie'
    ] as unknown as string[];

    expect(
      cookiesAfterLogout.some((str) =>
        str.startsWith(CaptchaEnum.validateCaptcha),
      ),
    ).toBe(false);
  });
});
