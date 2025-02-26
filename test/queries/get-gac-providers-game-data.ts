import { GACGameProviderEnum } from '@gateway/enums';

export const getGACProvidersGameData = (
  gameProvider: GACGameProviderEnum,
): string => {
  return `
    query GetProvidersGameData {
  getProvidersGameData(category: ${gameProvider}) {
    status
    code
    providersGameData {
      gameId
      assetId
      gameName
    }
  }
}
    `;
};
