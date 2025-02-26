export const getWhitelistedUserIdsData = `
query GetWhitelistedUserIdsData {
    getWhitelistedUserIdsData {
        status
        code
        whitelistedUserIdsDataFromGAC {
            userId
            whitelistedGames {
                provider
                gameIds
            }
        }
    }
}
`;
