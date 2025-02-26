import { OpmgAuthService } from '@services/rest/opmg/services';

import { opmgLobbyFixture, opmgLoginFixture } from '../../fixtures/opmg';
import { MockedServiceType } from '../../mocked-service.type';

export const opmgAuthServiceMock: MockedServiceType<OpmgAuthService> = {
  login: jest.fn().mockResolvedValue(opmgLoginFixture),
  enterOnlineLobby: jest.fn().mockResolvedValue(opmgLobbyFixture),
};
