import { OpmgGameUpdateService } from '@services/rest/opmg/services';

import { Observable } from 'rxjs';

import { MockedServiceType } from '../../mocked-service.type';

export const opmgGameUpdateServiceMock: MockedServiceType<OpmgGameUpdateService> =
  {
    getGamesUpdate: jest.fn().mockReturnValue(new Observable()),
  };
