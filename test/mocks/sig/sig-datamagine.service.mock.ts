import { SigDatamagineService } from '@services/rest/sig/services';

import { uploadRegistrationFormFixture } from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigDatamagineService: MockedServiceType<SigDatamagineService> = {
  uploadRegisterForm: jest
    .fn()
    .mockResolvedValue(uploadRegistrationFormFixture),
};
