import { BadRequestException } from '@nestjs/common';

import { SigDepositService } from '@services/rest/sig/services';

import {
  requestDepositFailedFixture,
  requestDepositFixture,
} from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigDepositServiceMock: MockedServiceType<SigDepositService> = {
  requestDeposit: jest.fn().mockImplementation((request) => {
    if (request.bank_code === 'BDO') {
      throw new BadRequestException(requestDepositFailedFixture);
    } else {
      return requestDepositFixture;
    }
  }),
};
