import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { UpdateAccountFinalFixture } from './mocks/fixtures/sig';
import { cookieLoginTokenHelper } from './helpers';
import {
  updateAccountMutation,
  updateAccountMutationWitInvalidEmail,
  updateAccountMutationWitInvalidMobileNumber,
  updateAccountMutationWitInvalidPassword,
  updateAccountMutationWitInvalidPasswordConfirmation,
  updateAccountMutationWitInvalidWithMismatchedPasswords,
} from './mutations';

const gql = '/graphql';

describe('Update account (e2e)', () => {
  let app: INestApplication;
  let postLoginToken: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    postLoginToken = await cookieLoginTokenHelper(app.getHttpServer(), gql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Update account', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postLoginToken)
      .send({
        query: updateAccountMutation,
      });
    const { updateAccount } = response.body.data;

    expect(updateAccount).toEqual(UpdateAccountFinalFixture);
  });

  it('Update account with invalide email', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: updateAccountMutationWitInvalidEmail,
    });

    expect(response.body.data).toBeNull();
  });

  it('Update account with invalide password', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: updateAccountMutationWitInvalidPassword,
    });

    expect(response.body.data).toBeNull();
  });

  it('Update account with invalide password confirmation', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: updateAccountMutationWitInvalidPasswordConfirmation,
    });

    expect(response.body.data).toBeNull();
  });

  it('Update account with invalide mobile number', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: updateAccountMutationWitInvalidMobileNumber,
    });

    expect(response.body.data).toBeNull();
  });

  it('Update your account with mismatched passwords', async () => {
    const response = await request(app.getHttpServer()).post(gql).send({
      query: updateAccountMutationWitInvalidWithMismatchedPasswords,
    });

    expect(response.body.data).toBeNull();
  });
});
