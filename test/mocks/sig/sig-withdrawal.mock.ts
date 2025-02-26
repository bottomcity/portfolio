import { BadRequestException } from '@nestjs/common';

import { SigWithdrawalService } from '@services/rest/sig/services';
import {
  amountMoney,
  selectedBankCodeId,
} from '@test/enums/data-for-inputs-enums';

import {
  mayaTransferFixture,
  requestWithdrawalAggregatedAmount400kFixture,
  requestWithdrawalAggregatedAmount500kFixture,
  requestWithdrawalExceedAmountFixture,
  requestWithdrawalFailedFixture,
  requestWithdrawalFixture,
  requestWithdrawalGreaterBalanceFixture,
  requestWithdrawalPaymayaFixture,
} from '../fixtures/sig';
import { MockedServiceType } from '../mocked-service.type';

export const sigWithdrawalService: MockedServiceType<SigWithdrawalService> = {
  requestWithdrawal: jest.fn().mockImplementation(async (request) => {
    if (
      request.selected_bank_code_id ===
      selectedBankCodeId.DevelopmentBankPhilippines
    ) {
      throw new BadRequestException(requestWithdrawalExceedAmountFixture);
    }
    if (
      request.amount >= amountMoney.amount400k &&
      request.amount < amountMoney.validTopLevel
    ) {
      return requestWithdrawalAggregatedAmount400kFixture;
    }

    if (request.amount > amountMoney.validTopLevel) {
      return requestWithdrawalAggregatedAmount500kFixture;
    }
    if (
      request.selected_bank_code_id ===
      selectedBankCodeId.PhilippineNationalBank
    ) {
      throw new BadRequestException(requestWithdrawalGreaterBalanceFixture);
    }
    if (request.selected_bank_code_id === selectedBankCodeId.BankPaymaya) {
      return requestWithdrawalPaymayaFixture;
    }
    if (request.selected_bank_code_id === selectedBankCodeId.Metrobank) {
      throw new BadRequestException(requestWithdrawalFailedFixture);
    } else {
      return requestWithdrawalFixture;
    }
  }),
  requestMayaTransfer: jest.fn().mockResolvedValue(mayaTransferFixture),
};
