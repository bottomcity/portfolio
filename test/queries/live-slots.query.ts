export const getLiveSlotsQuery = `query{
  getGamesByCategory(category: LIVE_SLOTS){
    games{
      id
      name
      gameName
      thumbnailUrl
      gameType
      category
      denom
    }
  }
}`;
