export const getTransactionsHistoryQueryHelper = (
  page,
  limit,
  filter,
  startDate,
  endDate,
) => `
query getTransactionsHistory {
    getTransactionsHistory(input: { page: ${page}, limit: ${limit}, filter: ${filter}, startDate: "${startDate}", endDate: "${endDate}" }) {
        status
        code
        count
        message
        skip
        limit
        page
        totalPages
        data {
            id
            amount
            type
            description
            transactionId
            assetNo
            gameLink
            gameLinkId
            gameNo
            balance
            status
            createdAt
        }
    }
}
`;

export const getTransactionsHistoryQuery = `
query getTransactionsHistory {
    getTransactionsHistory(input: { page: 1, limit: 20, filter: ALL, startDate: "2024-10-01", endDate: "2024-10-16" }) {
        status
        code
        count
        message
        skip
        limit
        page
        totalPages
        data {
            id
            amount
            type
            description
            transactionId
            assetNo
            gameLink
            gameLinkId
            gameNo
            balance
            status
            createdAt
        }
    }
}
`;

export const getTransactionsHistoryWithoutFilterFieldQuery = `
query getTransactionsHistory {
    getTransactionsHistory(input: { page: 1, limit: 20, startDate: "2024-10-01", endDate: "2024-10-16" }) {
        status
        code
        count
        message
        skip
        limit
        page
        totalPages
        data {
            id
            amount
            type
            description
            transactionId
            assetNo
            gameLink
            gameLinkId
            gameNo
            balance
            status
            createdAt
        }
    }
}
`;

export const getTransactionsQueryUnexpectedField = `
query getTransactionsHistory {
    getTransactionsHistory(input: { page: 1, limit: 20, filter: ALL, startDate: "2024-10-01", endDate: "2024-10-16" }) {
        status
        code
        count
        message
        skip
        limit
        page
        totalPages
        data {
            id
            amount
            type
            description
            transactionId
            assetNo
            gameLink
            gameLinkId
            gameNo
            balance
            status
            createdAt
            unexpectedField
        }
    }
}
`;

export const getTransactionsQueryPartialResponse = `
query getTransactionsHistory {
    getTransactionsHistory(input: { page: 1, limit: 20, filter: ALL, startDate: "2024-10-01", endDate: "2024-10-16" }) {
        code
        count
        message
        skip
        limit
        page
        totalPages
        data {
            id
            amount
            type
            description
            transactionId
            assetNo
            gameLink
            gameLinkId
            gameNo
            balance
            status
            createdAt
        }
    }
}
`;
