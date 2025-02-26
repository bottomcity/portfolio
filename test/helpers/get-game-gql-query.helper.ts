import { GameProvidersEnum } from '@gateway/enums';
import { getGameByIdWithProviderQuery } from '@test/queries';

import * as request from 'supertest';

export const getGameByIdWithProviderHelper = async (
  httpServer: any,
  gql: string,
  gameId: string,
  gameProvider: GameProvidersEnum,
  token?: string[],
): Promise<any> => {
  if (token) {
    return request(httpServer)
      .post(gql)
      .set('Cookie', token)
      .send({
        query: getGameByIdWithProviderQuery(gameId, gameProvider),
      });
  } else {
    return request(httpServer)
      .post(gql)
      .send({
        query: getGameByIdWithProviderQuery(gameId, gameProvider),
      });
  }
};
