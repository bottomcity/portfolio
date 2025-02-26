import { GameSubTypeEnum } from '@gateway/enums';

export const addFavoriteGamesQuery = (
  gameId: string,
  category: string,
  gameSubType?: GameSubTypeEnum,
) => `mutation {
  addFavoriteGame(gameId: ${gameId}, category: ${category}${
    gameSubType ? `, gameSubType: ${gameSubType}` : ''
  })
}`;
