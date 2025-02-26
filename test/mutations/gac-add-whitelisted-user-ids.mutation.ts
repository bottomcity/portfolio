import { GameAccessControlWhitelistDto } from '@gateway/services/dto';

export const addWhitelistedUserIdsMutation = (
  data: GameAccessControlWhitelistDto,
): string => `
mutation AddWhitelistedUserIdsToGAC {
    addWhitelistedUserIdsToGAC(
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
