import { BadRequestException } from '@nestjs/common';

import { SigPromoService } from '@services/rest/sig/services';

import {
  getPromoListFixture,
  getPromoRunFailedInteractionFixture,
  getPromoRunFalseInteractionFixture,
  getPromoRunTrueInteractionFixture,
} from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigPromoServiceMock: MockedServiceType<SigPromoService> = {
  getPromoList: jest.fn().mockResolvedValue(getPromoListFixture),
  promoRun: jest.fn().mockImplementation((request) => {
    if (request.promo_id === 'true') {
      return getPromoRunTrueInteractionFixture;
    }
    if (request.promo_id === 'fail') {
      throw new BadRequestException(getPromoRunFailedInteractionFixture);
    } else {
      return getPromoRunFalseInteractionFixture;
    }
  }),
};
