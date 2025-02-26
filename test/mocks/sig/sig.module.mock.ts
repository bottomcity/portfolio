import { Module } from '@nestjs/common';

import {
  SigBalanceService,
  SigDatamagineService,
  SigDepositService,
  SigEkycService,
  SigHealthCheckService,
  SigHistoryService,
  SigProfileService,
  SigPromoService,
  SigSportBetHistoryService,
  SigWithdrawalService,
} from '@services/rest/sig/services';
import { SigAuthService } from '@services/rest/sig/services/sig-auth.service';
import { SigGameService } from '@services/rest/sig/services/sig-game.service';
import { SigOtpService } from '@services/rest/sig/services/sig-otp.service';
import { SigRegisterService } from '@services/rest/sig/services/sig-register.service';

import { sigAuthServiceMock } from './sig-auth.service.mock';
import { sigBalanceServiceMock } from './sig-balance.service.mock';
import { sigDatamagineService } from './sig-datamagine.service.mock';
import { sigDepositServiceMock } from './sig-deposit.mock';
import { sigEkycServiceMock } from './sig-ekyc.service.mock';
import { sigGameServiceMock } from './sig-game.service.mock';
import { sigHistoryServiceMock } from './sig-history.service.mock';
import { sigOtpServiceMock } from './sig-otp.service.mock';
import { sigProfileServiceMock } from './sig-profile.mock';
import { sigPromoServiceMock } from './sig-promo.service.mock';
import { sigRegisterServiceMock } from './sig-register.service.mock';
import { sigSportBetHistoryService } from './sig-sport-bet-history.service';
import { sigWithdrawalService } from './sig-withdrawal.mock';

@Module({
  providers: [
    {
      provide: SigAuthService,
      useValue: sigAuthServiceMock,
    },
    {
      provide: SigOtpService,
      useValue: sigOtpServiceMock,
    },
    {
      provide: SigGameService,
      useValue: sigGameServiceMock,
    },
    {
      provide: SigProfileService,
      useValue: sigProfileServiceMock,
    },
    {
      provide: SigEkycService,
      useValue: sigEkycServiceMock,
    },
    {
      provide: SigBalanceService,
      useValue: sigBalanceServiceMock,
    },
    {
      provide: SigHistoryService,
      useValue: sigHistoryServiceMock,
    },
    {
      provide: SigDepositService,
      useValue: sigDepositServiceMock,
    },
    {
      provide: SigWithdrawalService,
      useValue: sigWithdrawalService,
    },
    {
      provide: SigPromoService,
      useValue: sigPromoServiceMock,
    },
    {
      provide: SigSportBetHistoryService,
      useValue: sigSportBetHistoryService,
    },
    { provide: SigHealthCheckService, useValue: {} },
    {
      provide: SigRegisterService,
      useValue: sigRegisterServiceMock,
    },
    {
      provide: SigDatamagineService,
      useValue: sigDatamagineService,
    },
  ],
  exports: [
    SigAuthService,
    SigOtpService,
    SigGameService,
    SigProfileService,
    SigEkycService,
    SigBalanceService,
    SigHistoryService,
    SigDepositService,
    SigWithdrawalService,
    SigPromoService,
    SigSportBetHistoryService,
    SigHealthCheckService,
    SigRegisterService,
    SigDatamagineService,
  ],
})
export class SigModuleMock {}
