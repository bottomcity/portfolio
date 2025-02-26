import { SigEkycService } from '@services/rest/sig/services';

import {
  startDocumentEkycFixture,
  startJumioEkycFixture,
  startSelfieEkycFixture,
  submitDockumentEkycFixture,
  uploadDocumentEkycPartBackFixture,
} from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigEkycServiceMock: MockedServiceType<SigEkycService> = {
  startDocumentEkyc: jest.fn().mockResolvedValue(startDocumentEkycFixture),
  uploadDocumentEkyc: jest
    .fn()
    .mockResolvedValue(uploadDocumentEkycPartBackFixture),
  submitDocumentEkyc: jest.fn().mockResolvedValue(submitDockumentEkycFixture),
  startSelfieEkyc: jest.fn().mockResolvedValue(startSelfieEkycFixture),
  startJumioEkyc: jest.fn().mockResolvedValue(startJumioEkycFixture),
};
