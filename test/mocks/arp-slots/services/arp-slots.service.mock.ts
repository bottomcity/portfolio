import { ArpSlotGameService } from '@services/rest/arp-slot/services';
import {
  arpSlotResponseFixture,
  ArpSlotsSessionV1Fixture,
  ArpSlotsSessionV2Fixture,
} from '@test/mocks/fixtures/arp-slots';
import { MockedServiceType } from '@test/mocks/mocked-service.type';

export const arpSlotsGameServiceMock: MockedServiceType<ArpSlotGameService> = {
  getSlotData: jest.fn().mockResolvedValue(arpSlotResponseFixture),
  generateGameLink: jest.fn().mockReturnValue('https://test.com'),
  connectGameSessionV2: jest.fn().mockResolvedValue(ArpSlotsSessionV2Fixture),
  connectGameSessionV1: jest.fn().mockResolvedValue(ArpSlotsSessionV1Fixture),
  reconnectGameSessionV2: jest.fn().mockResolvedValue(ArpSlotsSessionV2Fixture),
  reconnectGameSessionV1: jest.fn().mockResolvedValue(ArpSlotsSessionV1Fixture),
};
