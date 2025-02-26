import { ArpStudioUpdateService } from '@services/rest/arp-studio/services';
import { MockedServiceType } from '@test/mocks/mocked-service.type';

import { Observable } from 'rxjs';

export const arpStudioUpdateServiceMock: MockedServiceType<ArpStudioUpdateService> =
  {
    publishGameUpdate: jest.fn(),
    getGamesUpdate: jest.fn().mockReturnValue(new Observable()),
  };
