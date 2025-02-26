import { Module } from '@nestjs/common';

import { CloudFlareCaptchaService } from '@services/rest/cf/services';

import { CloudFlareCaptchaServiceMock } from './cf-captcha.service.mock';

@Module({
  providers: [
    {
      provide: CloudFlareCaptchaService,
      useValue: CloudFlareCaptchaServiceMock,
    },
  ],
  exports: [CloudFlareCaptchaService],
})
export class CloudFlareModuleMock {}
