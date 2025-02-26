import { GameProvidersEnum } from '@gateway/enums';

export const getEGamesQuery = `query{
    getGamesByCategory(category: E_GAME) {
      gameTypes
      gameProviders
      games{
        id,
        thumbnailUrl,
        category,
        name,
        assetId,
        isPublic,
        isVirtual,
        isFavorite
        settings{
          provider,
          vertical,
          walletGameType,
          platform
        },
        gameType,
        thumbnailUrl,
        category,
        description
      }
    }
  }`;

export const getAllGamesQuery = `
query GetAllGames {
    getAllGames {
        gameTypes
        gameProviders
        games {
            minBet
            maxBet
            dealerImg
            dealerName
            videoSource
            gameSubType
            gameState
            isAvailable
            enable
            denom
            stadiumState
            version
            machineId
            id
            name
            dataSource
            assetId
            gameName
            gameType
            isPublic
            isVirtual
            isFavorite
            platformId
            thumbnailUrl
            category
            description
            iframeUrl
            tags
            order
            gameHistory {
                result
                status
            }
            stadiumHistory {
                action
                gameid
                num_scores
                scores
                numbers
            }
            settings {
                provider
                vertical
                walletGameType
                platform
            }
            thumbnails {
                S
                M
                L
                XL
                square
            }
        }
    }
}

`;

export const getGameByIdQuery = `query{
  getGameById(id: "265", demo: true, gameProvider: EVOLUTION) {
      id,
      name,
      assetId,
      gameType,
      iframeUrl
    }
  }
`;

export const getGameByIdWithProviderQuery = (
  id: string,
  gameProvider: GameProvidersEnum,
): string => `query{
  getGameById(id: "${id}", demo: true, gameProvider: ${gameProvider}) {
      id,
      name,
      assetId,
      gameType,
      iframeUrl
    }
  }
`;

export const getPubliclyBlacklistedGameByIdQuery = `query{
  getGameById(id: "256", demo: true, gameProvider: EVOLUTION) {
      id,
      name,
      assetId,
      gameType,
      iframeUrl
    }
  }
`;

export const getRealGameByIdQuery = `query{
  getGameById(id: "265", demo: false, gameProvider: EVOLUTION) {
      id,
      name,
      assetId,
      gameType,
      iframeUrl
    }
  }
`;
