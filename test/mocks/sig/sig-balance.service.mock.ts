import { SigBalanceService } from '@services/rest/sig/services';

import { getPatronBalanceFixture } from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigBalanceServiceMock: MockedServiceType<SigBalanceService> = {
  getBalance: jest.fn().mockResolvedValue(getPatronBalanceFixture),
};
