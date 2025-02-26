import { OpmgGameService } from '@services/rest/opmg/services';

import { MockedServiceType } from '../../mocked-service.type';

export const opmgGameServiceMock: MockedServiceType<OpmgGameService> = {
  enterGame: jest.fn().mockResolvedValue({ status: 'ok' }),
  exitGame: jest.fn().mockResolvedValue(true),
};
