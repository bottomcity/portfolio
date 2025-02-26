import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ArpSlotsModuleMock } from '@test/mocks/arp-slots/arp-slots.module.mock';
import { ArpStudioModuleMock } from '@test/mocks/arp-studio/arp-studio.module.mock';
import { CloudFlareModuleMock } from '@test/mocks/cf';

import { OpmgModuleMock } from '../mocks/opmg/opmg.module.mock';
import { SigModuleMock } from '../mocks/sig/sig.module.mock';
//Prevent reading local .env file during testing
jest.mock('dotenv');

jest.mock('@db/data.source', () => {
  const dbDataSource: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
  };
  return {
    dbDataSource,
  };
});

jest.mock('@websockets/opmg/opmg-online-connection', () => {
  return {
    OpmgWebsocketConnection: jest.fn().mockImplementation(() => {
      return {
        init: jest.fn(),
        subscribe: jest.fn(),
      };
    }),
  };
});

jest.mock('@services/rest/arp-studio/arp-studio.module', () => {
  return { ArpStudioModule: ArpStudioModuleMock };
});

jest.mock('@services/rest/opmg/opmg.module', () => {
  return { OpmgModule: OpmgModuleMock };
});

jest.mock('@services/rest/sig/sig.module', () => {
  return { SigModule: SigModuleMock };
});

jest.mock('@services/rest/cf/cf.module', () => {
  return { CloudFlareModule: CloudFlareModuleMock };
});

jest.mock('@services/rest/arp-slot/arp-slot.module', () => {
  return {
    //Only SLOT_MODULEV_2 contains all the logic
    ArpSlotModule: ArpSlotsModuleMock,
    ArpSlotModuleV2: ArpSlotsModuleMock,
    ArpSlotModuleV1: ArpSlotsModuleMock,
  };
});
