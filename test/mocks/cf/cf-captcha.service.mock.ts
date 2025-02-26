import { CloudFlareCaptchaService } from '@services/rest/cf/services';

import {
  validateCaptchaFixture,
  validateFailedCaptchaFixture,
} from '../fixtures/cf';
import { MockedServiceType } from '../mocked-service.type';

export const CloudFlareCaptchaServiceMock: MockedServiceType<CloudFlareCaptchaService> =
  {
    validateCaptcha: jest.fn().mockImplementation((data) => {
      if (data.response === 'faile') {
        return validateFailedCaptchaFixture;
      }
      return validateCaptchaFixture;
    }),
  };
