import { ArpStudioGameLobbyResponse } from '@services/rest/arp-studio/dto';

import { arpStudioGamesFixture } from './arp-studio-games.fixture';

export const arpStudioGameLobbyFixture: ArpStudioGameLobbyResponse = {
  result: 0,
  desc: 'succeed',
  total: 18,
  arraysize: 18,
  array: arpStudioGamesFixture,
};
