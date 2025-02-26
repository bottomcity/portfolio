import { GameCategoryEnum } from '@gateway/enums';

export const getFavoriteGamesQuery = (category: GameCategoryEnum) => `{
  getFavoriteGames(category: ${category}) {
    name
    id
    gameSubType
  }
}`;
