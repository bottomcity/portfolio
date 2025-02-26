import { testNames, testPINs } from '@test/enums/data-for-inputs-enums';
import { loginMutation } from '@test/mutations';

import * as request from 'supertest';

import { cookieCaptchaTokenHelper } from './cookie-captcha-token.helper';
export const cookieLoginTokenHelper = async (httpServer: any, gql: string) => {
  const captchaToken = await cookieCaptchaTokenHelper(httpServer, gql);

  const loginResponse = await request(httpServer)
    .post(gql)
    .set('Cookie', captchaToken)
    .send({
      query: loginMutation(
        testNames.testName,
        testPINs.defaultPIN,
        testNames.firefox,
      ),
    });

  const loginCookies = loginResponse.headers[
    'set-cookie'
  ] as unknown as string[];

  return loginCookies;
};
