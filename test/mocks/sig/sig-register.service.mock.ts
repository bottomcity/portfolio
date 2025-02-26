import { SigRegisterService } from '@services/rest/sig/services/sig-register.service';

import {
  CompleteRegisterationServiceFixture,
  GetStepFinalFixture,
} from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigRegisterServiceMock: MockedServiceType<SigRegisterService> = {
  registerGetStep: jest.fn().mockResolvedValue(GetStepFinalFixture),
  registerCompleteRegistration: jest
    .fn()
    .mockResolvedValue(CompleteRegisterationServiceFixture),
};
