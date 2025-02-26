import { verifyOtpMutation } from '@test/mutations';

import * as request from 'supertest';

import { cookieLoginTokenHelper } from './cookie-login-token.helper';

export const cookieOtpTokenHelper = async (httpServer: any, gql: string) => {
  const loginToken = await cookieLoginTokenHelper(httpServer, gql);

  const otpResponse = await request(httpServer)
    .post(gql)
    .set('Cookie', loginToken)
    .send({
      query: verifyOtpMutation,
    });

  const otpCookies = otpResponse.headers['set-cookie'] as unknown as string[];

  return otpCookies;
};
