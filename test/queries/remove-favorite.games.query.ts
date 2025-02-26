import { GameSubTypeEnum } from '@gateway/enums';

export const removeFavoriteGamesQuery = (
  gameId: string,
  category: string,
  gameSubType?: GameSubTypeEnum,
) => `mutation {
  removeFavoriteGame(gameId: ${gameId}, category: ${category}${
    gameSubType ? `, gameSubType: ${gameSubType}` : ''
  })
}`;
