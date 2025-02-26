import { SigSportBetHistoryService } from '@services/rest/sig/services';

import { SportbookHistoryResponseFixture } from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigSportBetHistoryService: MockedServiceType<SigSportBetHistoryService> =
  {
    geSportBetHistory: jest
      .fn()
      .mockResolvedValue(SportbookHistoryResponseFixture),
  };
