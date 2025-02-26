export const getEnterLiveGameQuery = (
  gameId: string,
) => `mutation EnterLiveGame {
    enterLiveGame(gameId:"${gameId}")
  }`;

export const getEnterStadiumGameQuery = (
  gameId: string,
) => `mutation EnterStadiumGame {
    enterStadiumGame(gameId:"${gameId}"){
      status
    }
  }`;

export const getExitLiveGame = () => `mutation ExitLiveGame {
    exitLiveGame
  }`;

export const getExitStadiumGame = (
  gameId: string,
) => `mutation ExitStadiumGame {
    exitStadiumGame(gameId:"${gameId}")
  }`;
