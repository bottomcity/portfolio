import { opmgLoginGamesFixture } from './opmg-login-games.fixture';

export const opmgLoginFixture = {
  status: 'ok',
  ngames: 33,
  admin: {
    acc: '9',
    key: 'a042b25c3e4b920a8a32f54f9d0c903d7-f3048f5ff90982e7-2024-02-21-11-39-30',
    history: 1,
    changepw: 0,
  },
  lobby: {
    acc: '9',
    serverurl: 'wss://opmg.solaireonlinecasino.com/sonline',
    key: 'a09676e7a9d930869d41d760203b3059a-01dd4f644717298b-2024-02-21-11-39-30',
    language: 'en',
    minplaycredit: 0,
  },
  games: opmgLoginGamesFixture,
};
