import { ArpStudioGameService } from '@services/rest/arp-studio/services';
import { arpStudioExitGameFixture } from '@test/mocks/fixtures/arp-studio/arp-studio.exit-game.fixture';
import { arpStudioEnterGameFixture } from '@test/mocks/fixtures/arp-studio/arp-studio-enter-game.fixture';
import { arpStudioGameLobbyFixture } from '@test/mocks/fixtures/arp-studio/arp-studio-game-lobby.fixture';
import { arpStudioRoadSheetFixture } from '@test/mocks/fixtures/arp-studio/arp-studio-road-sheet.fixture';
import { MockedServiceType } from '@test/mocks/mocked-service.type';

export const arpStudioGameServiceMock: MockedServiceType<ArpStudioGameService> =
  {
    gameLobby: jest.fn().mockResolvedValue(arpStudioGameLobbyFixture),
    roadSheet: jest.fn().mockResolvedValue(arpStudioRoadSheetFixture),
    enterGame: jest.fn().mockResolvedValue(arpStudioEnterGameFixture),
    exitGame: jest.fn().mockResolvedValue(arpStudioExitGameFixture),
  };
