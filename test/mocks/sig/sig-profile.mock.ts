import { SigProfileService } from '@services/rest/sig/services';

import {
  GetEkycServiceFixture,
  GetExclusionServiceFixture,
  GetUserProfileServiceFixture,
  UpdateUserProfileServiceFixture,
} from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigProfileServiceMock: MockedServiceType<SigProfileService> = {
  updateUserProfile: jest
    .fn()
    .mockResolvedValue(UpdateUserProfileServiceFixture),
  getUserProfile: jest.fn().mockResolvedValue(GetUserProfileServiceFixture),
  getExclusion: jest.fn().mockResolvedValue(GetExclusionServiceFixture),
  getEkyc: jest.fn().mockResolvedValue(GetEkycServiceFixture),
};
