export const getJackpotsQuery = `query {
    getJackpots{
      valid
      success
      datetime
      data{
        name
        balance
        major
        minor
        mini
        levelId
        gameType
      }
      
    }
  }`;
