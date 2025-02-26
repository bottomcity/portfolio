export const getSportbookHistoryQueryHelper = (page, limit) => `
  query GetSportbookHistory {
      getSportbookHistory(input: { page: ${page}, limit: ${limit}}) {
        status
        limit
        code
        count
        message
        page
        skip
        totalPages
        data {
            provider
            betId
            betTime
            settleTime
            stake
            winnings
            providerId
            status
            odds
            betType
            selections {
                sport
                home
                away
                odds
                isLive
                isBanker
                isOutright
                eventName
                eventDate
                marketName
                outcomeName
                campaigns {
                    id
                    type
                    amount
                    maxPayout
                }
            }
        }
      }
  }
  `;

export const getSportbookHistoryQuery = `
  query GetSportbookHistory {
      getSportbookHistory(input: { page: 1, limit: 20}) {
        status
        limit
        code
        count
        message
        page
        skip
        totalPages
        data {
            provider
            betId
            betTime
            settleTime
            stake
            winnings
            providerId
            status
            odds
            betType
            selections {
                sport
                home
                away
                odds
                isLive
                isBanker
                isOutright
                eventName
                eventDate
                marketName
                outcomeName
                campaigns {
                    id
                    type
                    amount
                    maxPayout
                }
            }
        }
      }
  }
  `;

export const getSportbookHistoryQueryUnexpectedField = `
  query GetSportbookHistory {
      getSportbookHistory(input: { page: 1, limit: 20 }) {
        status
        limit
        code
        count
        message
        page
        skip
        totalPages
        data {
            provider
            betId
            betTime
            settleTime
            stake
            winnings
            providerId
            status
            odds
            betType
            selections {
                sport
                home
                away
                odds
                isLive
                isBanker
                isOutright
                eventName
                eventDate
                marketName
                outcomeName
                campaigns {
                    id
                    type
                    amount
                    maxPayout
                }
            }
            unexpectedField
        }
      }
  }
  `;

export const getSportbookHistoryQueryPartialResponse = `
  query GetSportbookHistory {
      getSportbookHistory(input: { page: 1, limit: 20 }) {
        status
        limit
        code
        count
        message
        page
        skip
        totalPages
        data {
            provider
            betId
            betTime
            settleTime
            stake
            winnings
            providerId
            status
            odds
            betType
            selections {
                sport
                home
                away
                odds
                isLive
                isBanker
                isOutright
                eventName
                eventDate
                marketName
                outcomeName
            }
        }
      }
  }
  `;

export const getSportbookHistoryQueryWithoutPageAndLimit = `
  query GetSportbookHistory {
      getSportbookHistory(input: {}) {
        status
        limit
        code
        count
        message
        page
        skip
        totalPages
        data {
            provider
            betId
            betTime
            settleTime
            stake
            winnings
            providerId
            status
            odds
            betType
            selections {
                sport
                home
                away
                odds
                isLive
                isBanker
                isOutright
                eventName
                eventDate
                marketName
                outcomeName
                campaigns {
                    id
                    type
                    amount
                    maxPayout
                }
            }
        }
      }
  }
  `;
