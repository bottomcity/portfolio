import { Module } from '@nestjs/common';

import {
  OpmgAuthService,
  OpmgGameService,
  OpmgGameUpdateService,
} from '@services/rest/opmg/services';

import {
  opmgAuthServiceMock,
  opmgGameServiceMock,
  opmgGameUpdateServiceMock,
} from './services';

@Module({
  providers: [
    {
      provide: OpmgAuthService,
      useValue: opmgAuthServiceMock,
    },
    {
      provide: OpmgGameService,
      useValue: opmgGameServiceMock,
    },
    {
      provide: OpmgGameUpdateService,
      useValue: opmgGameUpdateServiceMock,
    },
  ],
  exports: [OpmgGameService, OpmgAuthService, OpmgGameUpdateService],
})
export class OpmgModuleMock {}
