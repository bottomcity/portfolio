import { GameAccessControlManagmentDto } from '@gateway/services/dto';

export const gameAccessControlManagmentMutation = (
  data: GameAccessControlManagmentDto,
): string => `
mutation GameAccessControlManagment {
    gameAccessControlManagment(
        input: { 
          gameProvider: ${data.gameProvider}, 
          gameIds: [${data.gameIds.map((id) => `"${id}"`).join(', ')}], 
          blacklistGames: ${data.blacklistGames} 
        }
    ) {
        status
        code
        message
    }
}
`;
