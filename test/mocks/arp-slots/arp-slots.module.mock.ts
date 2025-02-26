import { Module } from '@nestjs/common';

import { ArpSlotsApiVersionEnum } from '@services/rest/arp-slot/enums';
import { getArpSlotServiceToken } from '@services/rest/arp-slot/helpers/get-arp-slot-service-token';
import {
  ArpSlotAuthService,
  ArpSlotGameService,
} from '@services/rest/arp-slot/services';

import { arpSlotsAuthServiceMock, arpSlotsGameServiceMock } from './services';

const gameServiceTokenV1 = getArpSlotServiceToken(
  ArpSlotGameService,
  ArpSlotsApiVersionEnum.V1,
);
const authServiceTokenV1 = getArpSlotServiceToken(
  ArpSlotAuthService,
  ArpSlotsApiVersionEnum.V1,
);

const gameServiceTokenV2 = getArpSlotServiceToken(
  ArpSlotGameService,
  ArpSlotsApiVersionEnum.V2,
);
const authServiceTokenV2 = getArpSlotServiceToken(
  ArpSlotAuthService,
  ArpSlotsApiVersionEnum.V2,
);

@Module({
  providers: [
    {
      provide: gameServiceTokenV1,
      useValue: arpSlotsGameServiceMock,
    },
    {
      provide: authServiceTokenV1,
      useValue: arpSlotsAuthServiceMock,
    },
    {
      provide: gameServiceTokenV2,
      useValue: arpSlotsGameServiceMock,
    },
    {
      provide: authServiceTokenV2,
      useValue: arpSlotsAuthServiceMock,
    },
  ],
  exports: [
    gameServiceTokenV1,
    authServiceTokenV1,
    gameServiceTokenV2,
    authServiceTokenV2,
  ],
})
export class ArpSlotsModuleMock {}
