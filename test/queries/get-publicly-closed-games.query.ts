export const getPubliclyClosedGames = `
query GetPubliclyClosedGames {
    getPubliclyClosedGames {
        status
        code
        blacklistedGamesFromGACData {
            provider
            gameIds
        }
    }
}
`;
