import { SigGameService } from '@services/rest/sig/services/sig-game.service';

import { sigGamesFixture } from '../fixtures/sig/game.fixture';
import { MockedServiceType } from '../mocked-service.type';

export const sigGameServiceMock: MockedServiceType<SigGameService> = {
  virtualGameLogin: jest.fn().mockResolvedValue({
    status: true,
    data: {
      url: 'test',
    },
  }),
  getGames: jest.fn().mockResolvedValue(sigGamesFixture),
  getGamesByGameType: jest.fn().mockResolvedValue(sigGamesFixture),
  exitGame: jest.fn().mockResolvedValue(true),
  getGamesById: jest.fn().mockResolvedValue(sigGamesFixture),
  getGameSession: jest.fn(),
};
