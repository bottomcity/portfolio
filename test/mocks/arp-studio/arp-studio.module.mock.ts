import { Module } from '@nestjs/common';

import {
  ArpStudioGameService,
  ArpStudioUpdateService,
} from '@services/rest/arp-studio/services';

import {
  arpStudioGameServiceMock,
  arpStudioUpdateServiceMock,
} from './services';

@Module({
  providers: [
    { provide: ArpStudioGameService, useValue: arpStudioGameServiceMock },
    { provide: ArpStudioUpdateService, useValue: arpStudioUpdateServiceMock },
  ],
  exports: [ArpStudioGameService, ArpStudioUpdateService],
})
export class ArpStudioModuleMock {}
