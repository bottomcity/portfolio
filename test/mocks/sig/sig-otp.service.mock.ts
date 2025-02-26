import { SigOtpService } from '@services/rest/sig/services/sig-otp.service';

import { generateOtpFixture, verifyOtpFixture } from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigOtpServiceMock: MockedServiceType<SigOtpService> = {
  generateOtp: jest.fn().mockResolvedValue(generateOtpFixture),
  verifyOtp: jest.fn().mockResolvedValue(verifyOtpFixture),
};
