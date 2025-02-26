import { SigHistoryService } from '@services/rest/sig/services';

import { TransactionsHistoryFixture } from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigHistoryServiceMock: MockedServiceType<SigHistoryService> = {
  getUserWalletTransactionHistory: jest.fn().mockResolvedValue({}),
  getUserWalletFundHistory: jest.fn().mockResolvedValue({}),
  getTransactionsHistory: jest
    .fn()
    .mockResolvedValue(TransactionsHistoryFixture),
};
