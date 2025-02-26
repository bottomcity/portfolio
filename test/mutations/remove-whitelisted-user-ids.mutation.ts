import { GameAccessControlWhitelistDto } from '@gateway/services/dto';

export const removeWhitelistedUserIdsMutation = (
  data: GameAccessControlWhitelistDto,
): string => `
mutation RemoveWhitelistedUserIdsFromGAC {
    removeWhitelistedUserIdsFromGAC(
        input: { gameProvider: ${data.gameProvider}, gameIds: [${data.gameIds
          .map((id) => `"${id}"`)
          .join(', ')}], whitelistedUserIds: [${data.whitelistedUserIds
          .map((id) => `"${id}"`)
          .join(', ')}] }
    ) {
        status
        code
        message
    }
}

`;
