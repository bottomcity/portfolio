import { SigGenerateOtpResponse } from '@services/rest/sig/dto';
export const generateOtpFixture: SigGenerateOtpResponse = {
  status: true,
  data: {
    id: 'string',
    expiration: 123,
    attempt_limit: 123,
    code_length: 123,
  },
};
