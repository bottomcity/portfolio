import {
  FailedCaptureMutation,
  ValidateCaptureMutation,
} from '@test/mutations';

import * as request from 'supertest';

export const cookieCaptchaTokenHelper = async (
  httpServer: any,
  gql: string,
  generateFailedCaptchaVerificationToken: boolean = false,
) => {
  let captchaResponse: any;
  if (!generateFailedCaptchaVerificationToken) {
    captchaResponse = await request(httpServer).post(gql).send({
      query: ValidateCaptureMutation,
    });
  } else {
    captchaResponse = await request(httpServer).post(gql).send({
      query: FailedCaptureMutation,
    });
  }

  const captchaCookies = captchaResponse.headers[
    'set-cookie'
  ] as unknown as string[];

  return captchaCookies;
};
