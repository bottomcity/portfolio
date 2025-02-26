import { ArpSlotAuthService } from '@services/rest/arp-slot/services';
import { MockedServiceType } from '@test/mocks/mocked-service.type';

export const arpSlotsAuthServiceMock: MockedServiceType<ArpSlotAuthService> = {
  loginV3: jest.fn().mockResolvedValue({
    data: {
      player_name: 'test_name',
      player_imei: 'player_imei',
      player_token: 'testToken',
      player_current_game_session_id: '0',
      player_current_machine_id: '0',
    },
  }),
};
