import { BACKOFFICE_API_KEY } from '@config';
import { GameProvidersEnum } from '@gateway/enums';
import { gameAccessControlManagmentMutation } from '@test/mutations';

import * as request from 'supertest';

export const gameAccessControlManagmentQueryHelper = async (
  httpServer: any,
  gql: string,
  gameIds: string[],
  gameProvider: GameProvidersEnum,
  blacklistGames: boolean,
): Promise<any> => {
  return request(httpServer)
    .post(gql)
    .set('api-key', BACKOFFICE_API_KEY)
    .send({
      query: gameAccessControlManagmentMutation({
        gameIds,
        gameProvider,
        blacklistGames,
      }),
    });
};
