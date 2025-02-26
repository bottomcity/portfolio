import { GameCategoryEnum } from '@gateway/enums';

export const getGamesByCategoryQuery = (category: GameCategoryEnum) => `query{
    getGamesByCategory(category: ${category}) {
      gameTypes
      games{
        id
        name
        gameSubType
        isFavorite
      }
    }
  }`;

export const getGamesByCategorywithGameProvidersQuery = (
  category: GameCategoryEnum,
) => `query{
    getGamesByCategory(category: ${category}) {
      gameProviders
      gameTypes
      games{
        id
        name
        gameSubType
        isFavorite
        settings  {
          provider  
        }
      }
    }
  }`;
