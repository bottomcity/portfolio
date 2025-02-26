import { getQueueToken } from '@nestjs/bullmq';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  AxiosExceptionFilter,
  HttpExceptionFilter,
  TypeScriptExceptionFilter,
} from '@common/filters';
import { BACKOFFICE_API_KEY } from '@config';
import {
  GameAccessControlEntity,
  ProviderMaintenanceAccessControlEntity,
  ProvidersMaintenanceEntity,
} from '@db/entity';
import { QueueEnum } from '@enums';
import {
  GACGameProviderEnum,
  GameCategoryEnum,
  GameProvidersEnum,
  MaintenanceConstrantsEnum,
} from '@gateway/enums';
import { GameV1, GetGames } from '@gateway/models';
import { gatewayGACMACErrorMessages } from '@test/enums/messages-enums';
import { gameAccessControlManagmentQueryHelper } from '@test/helpers/game-access-control-gql-mutation.helper';
import { getGameByIdWithProviderHelper } from '@test/helpers/get-game-gql-query.helper';

import { Queue } from 'bullmq';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from './../src/app.module';
import {
  arpSlotResponseFinalFixture,
  arpSlotResponseFixture,
  GACLiveSlotGameId,
  GACPublicklyBlacklistedLiveSlotGameId,
} from './mocks/fixtures/arp-slots';
import {
  arpStudioGamesFixture,
  GACLiveStudioGameId,
  GACPublicklyBlacklistedLiveStudioGameId,
} from './mocks/fixtures/arp-studio/arp-studio-games.fixture';
import {
  GACLiveStadiumGameId,
  GACPublicklyBlacklistedLiveStadiumGameId,
  opmgLobbyGamesFixture,
} from './mocks/fixtures/opmg';
import { sigGamesFixture } from './mocks/fixtures/sig';
import { getGamesByCategoryQuery } from './queries/get-games-by-category.query';
import { SOME_BLACKLISTED_E_GAMES_FOR_TEST } from './enums';
import { cookieOtpTokenHelper, extractGqlResponse } from './helpers';
import {
  addWhitelistedUserIdsMutation,
  enterLiveSlotsGameMutation,
  gameAccessControlManagmentMutation,
  removeWhitelistedUserIdsMutation,
} from './mutations';
import {
  getEGamesQuery,
  getEnterLiveGameQuery,
  getGACProvidersGameData,
  getGameByIdWithProviderQuery,
  getLiveSlotsQuery,
  getPubliclyClosedGames,
  getWhitelistedUserIdsData,
} from './queries';

const gql = '/graphql';
const requestId = 'abec9645-17a4-45cf-99d8-5a9074f9722f';
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => requestId),
}));

describe('GAC API (e2e)', () => {
  let app: INestApplication;
  let postOtpToken: string[];
  let gameAccessControlRepository: Repository<GameAccessControlEntity>;
  let providerMaintenanceRepository: Repository<ProvidersMaintenanceEntity>;
  let accessControlRepository: Repository<ProviderMaintenanceAccessControlEntity>;
  let queue: Queue;
  const gameIdsArrayLiveStudio = [
    String(GACLiveStudioGameId),
    String(GACPublicklyBlacklistedLiveStudioGameId),
  ];

  const gameIdsArrayLiveStadium = [
    String(GACLiveStadiumGameId),
    String(GACPublicklyBlacklistedLiveStadiumGameId),
  ];

  const gameIdsArrayLiveSlot = [
    String(GACLiveSlotGameId),
    String(GACPublicklyBlacklistedLiveSlotGameId),
  ];
  const gameActions = [
    {
      provider: GameProvidersEnum.EVOLUTION,
      gameIds: ['1', '2'],
      blacklistGames: true,
    },
    {
      provider: GameProvidersEnum.EVOLUTION,
      gameIds: ['1', '2'],
      blacklistGames: false,
    },
  ];

  const gameDifferentProvidersActions = [
    {
      provider: GameProvidersEnum.EVOLUTION,
      gameIds: ['1', '2'],
      blacklistGames: true,
    },
    {
      provider: GameProvidersEnum.PRAGMATIC_PLAY,
      gameIds: ['1', '2'],
      blacklistGames: true,
    },
  ];

  const blacklistedGames = [
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION,
      provider: GameProvidersEnum.EVOLUTION,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOPLAY,
      provider: GameProvidersEnum.EVOPLAY,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.NETENT,
      provider: GameProvidersEnum.NETENT,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.NOLIMITCITY,
      provider: GameProvidersEnum.NOLIMITCITY,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.REDTIGER,
      provider: GameProvidersEnum.REDTIGER,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.CQ9,
      provider: GameProvidersEnum.CQ9,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.KING_MIDAS,
      provider: GameProvidersEnum.KING_MIDAS,
    },
    {
      gameId: SOME_BLACKLISTED_E_GAMES_FOR_TEST.PRAGMATIC_PLAY,
      provider: GameProvidersEnum.PRAGMATIC_PLAY,
    },
  ];

  const gameAccessControlConfigs = [
    {
      provider: GameProvidersEnum.LIVE_STUDIO,
      gameIds: gameIdsArrayLiveStudio,
      blacklistGames: true,
    },
    {
      provider: GameProvidersEnum.LIVE_STADIUM,
      gameIds: gameIdsArrayLiveStadium,
      blacklistGames: true,
    },
  ];

  const whitelistedUserIds = ['123123', '321321'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(
      app.get(TypeScriptExceptionFilter),
      app.get(AxiosExceptionFilter),
      app.get(HttpExceptionFilter),
    );

    await app.init();

    gameAccessControlRepository = moduleFixture.get<
      Repository<GameAccessControlEntity>
    >(getRepositoryToken(GameAccessControlEntity));
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);

    providerMaintenanceRepository = moduleFixture.get<
      Repository<ProvidersMaintenanceEntity>
    >(getRepositoryToken(ProvidersMaintenanceEntity));

    accessControlRepository = moduleFixture.get<
      Repository<ProviderMaintenanceAccessControlEntity>
    >(getRepositoryToken(ProviderMaintenanceAccessControlEntity));

    queue = moduleFixture.get<Queue>(
      getQueueToken(QueueEnum.MAINTENANCE_QUEUE),
    );
  });

  beforeEach(async () => {
    await gameAccessControlRepository.clear();
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
    await providerMaintenanceRepository.clear();
    await accessControlRepository.clear();
    await queue.clean(0, 100, 'delayed');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await providerMaintenanceRepository.clear();
    await accessControlRepository.clear();
    await queue.clean(0, 100, 'delayed');
    await app.close();
  });

  it('Should return forbidden for invalid API KEY (getPubliclyClosedGames query)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', GACGameProviderEnum.LIVE_STUDIO)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return forbidden for invalid API KEY (getWhitelistedUserIdsData query)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', GACGameProviderEnum.LIVE_STUDIO)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return forbidden for invalid API KEY (getGACProvidersGameData query)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', GACGameProviderEnum.LIVE_STUDIO)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_STUDIO),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return forbidden for invalid API KEY (removeWhitelistedUserIdsFromGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', GACGameProviderEnum.LIVE_STUDIO)
      .send({
        query: removeWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          whitelistedUserIds: ['123123', '321321'],
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return forbidden for invalid API KEY (gameAccessControlManagment mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', GACGameProviderEnum.LIVE_STUDIO)
      .send({
        query: gameAccessControlManagmentMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          blacklistGames: true,
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return forbidden for invalid API KEY (addWhitelistedUserIdsToGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', GACGameProviderEnum.LIVE_STUDIO)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          whitelistedUserIds: ['123123', '321321'],
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should handle removal of non-existent whitelisted user IDs (removeWhitelistedUserIdsFromGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: removeWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          whitelistedUserIds: ['999999'], // Assuming this user ID doesn't exist
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.incorrectWhitelistedUserIdsOrGameIds,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error for empty game ID list (removeWhitelistedUserIdsFromGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: removeWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: [],
          whitelistedUserIds: ['123123'],
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.gameIdsMustNotBeEmpty,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error for empty whitelisted user ID list (removeWhitelistedUserIdsFromGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: removeWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1'],
          whitelistedUserIds: [],
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.whitelistedUserIdsMustNotBeEmpty,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error for empty game ID list (addWhitelistedUserIdsToGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: [],
          whitelistedUserIds: ['123123'],
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.gameIdsMustNotBeEmpty,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error for empty whitelisted user ID list (addWhitelistedUserIdsToGAC mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1'],
          whitelistedUserIds: [],
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.whitelistedUserIdsMustNotBeEmpty,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return error for empty game ID list (gameAccessControlManagment mutation)', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: gameAccessControlManagmentMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: [],
          blacklistGames: false,
        }),
      });

    expect(response.body.errors[0].message).toContain(
      gatewayGACMACErrorMessages.gameIdsMustNotBeEmpty,
    );
    expect(response.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should return LIVE_STUDIO games', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_STUDIO),
      });

    const result = arpStudioGamesFixture.map((game) => {
      return {
        gameId: String(game.gameid),
        gameName: game.gametitle,
        assetId: null, //live studio doesn't have assetId
      };
    });

    expect(extractGqlResponse(response, 'getProvidersGameData')).toEqual({
      status: true,
      code: 200,
      providersGameData: result,
    });
  });

  it('Should return LIVE_STADIUM games', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_STADIUM),
      });

    const result = opmgLobbyGamesFixture.map((game) => {
      return {
        gameId: String(game.game),
        gameName: game.title,
        assetId: null, //live stadium doesn't have assetId
      };
    });

    expect(extractGqlResponse(response, 'getProvidersGameData')).toEqual({
      status: true,
      code: 200,
      providersGameData: result,
    });
  });

  it('Should return LIVE_SLOTS games', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_SLOTS),
      });

    const result = arpSlotResponseFixture.gameData.map((game) => {
      return {
        gameId: String(game.id),
        gameName: game.game_name,
        assetId: game.name,
      };
    });

    expect(extractGqlResponse(response, 'getProvidersGameData')).toEqual({
      status: true,
      code: 200,
      providersGameData: result,
    });
  });

  it('Should return all LIVE_SLOTS games even if some games blacklisted', async () => {
    const blacklistResponse = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      ['1', '2', '3'],
      GameProvidersEnum.LIVE_SLOTS,
      true,
    );

    expect(
      extractGqlResponse(blacklistResponse, 'gameAccessControlManagment'),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_SLOTS,
          gameIds: ['1', '2', '3'],
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_SLOTS),
      });

    const result = arpSlotResponseFixture.gameData.map((game) => {
      return {
        gameId: String(game.id),
        gameName: game.game_name,
        assetId: game.name,
      };
    });

    expect(extractGqlResponse(response, 'getProvidersGameData')).toEqual({
      status: true,
      code: 200,
      providersGameData: result,
    });
  });

  it('Should return all LIVE_STADIUM games even if some games blacklisted', async () => {
    const blacklistResponse = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      ['2', '5', '6'],
      GameProvidersEnum.LIVE_STADIUM,
      true,
    );

    expect(
      extractGqlResponse(blacklistResponse, 'gameAccessControlManagment'),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_STADIUM,
          gameIds: ['2', '5', '6'],
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_STADIUM),
      });

    const result = opmgLobbyGamesFixture.map((game) => {
      return {
        gameId: String(game.game),
        gameName: game.title,
        assetId: null, //live stadium doesn't have assetId
      };
    });

    expect(extractGqlResponse(response, 'getProvidersGameData')).toEqual({
      status: true,
      code: 200,
      providersGameData: result,
    });
  });

  it('Should return all LIVE_STUDIO games even if some games blacklisted', async () => {
    const blacklistResponse = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      ['2822', '2824', '2826'],
      GameProvidersEnum.LIVE_STUDIO,
      true,
    );

    expect(
      extractGqlResponse(blacklistResponse, 'gameAccessControlManagment'),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_STUDIO,
          gameIds: ['2822', '2824', '2826'],
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getGACProvidersGameData(GACGameProviderEnum.LIVE_STUDIO),
      });

    const result = arpStudioGamesFixture.map((game) => {
      return {
        gameId: String(game.gameid),
        gameName: game.gametitle,
        assetId: null, //live studio doesn't have assetId
      };
    });

    expect(extractGqlResponse(response, 'getProvidersGameData')).toEqual({
      status: true,
      code: 200,
      providersGameData: result,
    });
  });

  it('Should publicly blacklist specific games of specific provider', async () => {
    const response = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      ['1', '2'],
      GameProvidersEnum.EVOLUTION,
      true,
    );

    expect(extractGqlResponse(response, 'gameAccessControlManagment')).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
        },
      ],
    });
  });

  it('Should remove publicly blacklisted specific games of specific provider', async () => {
    const responseFromBlacklistGame =
      await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        ['1', '2'],
        GameProvidersEnum.EVOLUTION,
        true,
      );

    expect(
      extractGqlResponse(
        responseFromBlacklistGame,
        'gameAccessControlManagment',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseFromRemoveBlacklistGame =
      await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        ['1', '2'],
        GameProvidersEnum.EVOLUTION,
        false,
      );

    expect(
      extractGqlResponse(
        responseFromRemoveBlacklistGame,
        'gameAccessControlManagment',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });
  });

  it('Should not allow to duplicate publicly blacklist specific games of specific provider', async () => {
    const responseFromBlacklistGame =
      await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        ['1', '2'],
        GameProvidersEnum.EVOLUTION,
        true,
      );

    expect(
      extractGqlResponse(
        responseFromBlacklistGame,
        'gameAccessControlManagment',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseFromBlacklistGameDuplicate =
      await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        ['1', '2'],
        GameProvidersEnum.EVOLUTION,
        true,
      );

    expect(responseFromBlacklistGameDuplicate.body.errors).toEqual([
      {
        message: gatewayGACMACErrorMessages.haveSomeProvidersInGAC,
        code: HttpStatus.BAD_REQUEST,
        timestamp: responseFromBlacklistGameDuplicate.body.errors[0].timestamp,
        requestId,
      },
    ]);
  });

  it('Should not allow to duplicate remove of publicly blacklisted specific games of specific provider', async () => {
    for (const { provider, gameIds, blacklistGames } of gameActions) {
      const response = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        gameIds,
        provider,
        blacklistGames,
      );

      expect(
        extractGqlResponse(response, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseFromBlacklistGameDuplicate =
      await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        ['1', '2'],
        GameProvidersEnum.EVOLUTION,
        false,
      );

    expect(responseFromBlacklistGameDuplicate.body.errors).toEqual([
      {
        message: gatewayGACMACErrorMessages.incorrectGameIds,
        code: HttpStatus.BAD_REQUEST,
        requestId,
        timestamp: responseFromBlacklistGameDuplicate.body.errors[0].timestamp,
      },
    ]);
  });

  it('Should add whitelisted users to specific games of specific provider', async () => {
    const responseAddWhitelistedUserIds = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          whitelistedUserIds: ['123123', '321321'],
        }),
      });

    expect(
      extractGqlResponse(
        responseAddWhitelistedUserIds,
        'addWhitelistedUserIdsToGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '123123',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
          ],
        },
        {
          userId: '321321',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
          ],
        },
      ],
    });
  });

  it('Should remove whitelisted users to specific games of specific provider', async () => {
    const responseAddWhitelistedUserIds = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          whitelistedUserIds: ['123123', '321321'],
        }),
      });

    expect(
      extractGqlResponse(
        responseAddWhitelistedUserIds,
        'addWhitelistedUserIdsToGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '123123',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
          ],
        },
        {
          userId: '321321',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
          ],
        },
      ],
    });

    const responseRemoveWhitelistedUserIdsMutation = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: removeWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
          whitelistedUserIds: ['123123', '321321'],
        }),
      });

    expect(
      extractGqlResponse(
        responseRemoveWhitelistedUserIdsMutation,
        'removeWhitelistedUserIdsFromGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData2 = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData2,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [],
    });
  });

  it('Should return empty array of publicly blacklisted games', async () => {
    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [],
    });
  });

  it('Should return empty array of whitelisted userIds data from GAC', async () => {
    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [],
    });
  });

  it('Should blacklist same gameIds but for different providers', async () => {
    for (const {
      provider,
      gameIds,
      blacklistGames,
    } of gameDifferentProvidersActions) {
      const response = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        gameIds,
        provider,
        blacklistGames,
      );

      expect(
        extractGqlResponse(response, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1', '2'],
        },
        {
          provider: GameProvidersEnum.PRAGMATIC_PLAY,
          gameIds: ['1', '2'],
        },
      ],
    });
  });

  it('Should add whitelisted users for same gameIds but for different game providers', async () => {
    for (const { provider, gameIds } of gameDifferentProvidersActions) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          query: addWhitelistedUserIdsMutation({
            gameProvider: provider,
            gameIds: gameIds,
            whitelistedUserIds: whitelistedUserIds,
          }),
        });

      expect(
        extractGqlResponse(response, 'addWhitelistedUserIdsToGAC'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '123123',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
            {
              provider: GameProvidersEnum.PRAGMATIC_PLAY,
              gameIds: ['1', '2'],
            },
          ],
        },
        {
          userId: '321321',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
            {
              provider: GameProvidersEnum.PRAGMATIC_PLAY,
              gameIds: ['1', '2'],
            },
          ],
        },
      ],
    });
  });

  it('Should remove gameId for specific whitelisted user', async () => {
    for (const { provider, gameIds } of gameDifferentProvidersActions) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          query: addWhitelistedUserIdsMutation({
            gameProvider: provider,
            gameIds: gameIds,
            whitelistedUserIds: whitelistedUserIds,
          }),
        });

      expect(
        extractGqlResponse(response, 'addWhitelistedUserIdsToGAC'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '123123',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
            {
              provider: GameProvidersEnum.PRAGMATIC_PLAY,
              gameIds: ['1', '2'],
            },
          ],
        },
        {
          userId: '321321',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
            {
              provider: GameProvidersEnum.PRAGMATIC_PLAY,
              gameIds: ['1', '2'],
            },
          ],
        },
      ],
    });

    const responseRemoveWhitelistedUserIdsMutation = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: removeWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: ['1'],
          whitelistedUserIds: ['123123'],
        }),
      });

    expect(
      extractGqlResponse(
        responseRemoveWhitelistedUserIdsMutation,
        'removeWhitelistedUserIdsFromGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData2 = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData2,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '123123',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['2'],
            },
            {
              provider: GameProvidersEnum.PRAGMATIC_PLAY,
              gameIds: ['1', '2'],
            },
          ],
        },
        {
          userId: '321321',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: ['1', '2'],
            },
            {
              provider: GameProvidersEnum.PRAGMATIC_PLAY,
              gameIds: ['1', '2'],
            },
          ],
        },
      ],
    });
  });

  it('Should publicly blacklist specific games of specific provider and should not return in getGamesByCategory(LIVE_CASINO)', async () => {
    for (const {
      provider,
      gameIds,
      blacklistGames,
    } of gameAccessControlConfigs) {
      const response = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        gameIds,
        provider,
        blacklistGames,
      );

      expect(
        extractGqlResponse(response, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_STADIUM,
          gameIds: gameIdsArrayLiveStadium,
        },
        {
          provider: GameProvidersEnum.LIVE_STUDIO,
          gameIds: gameIdsArrayLiveStudio,
        },
      ],
    });

    const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: getGamesByCategoryQuery(GameCategoryEnum.LIVE_CASINO),
      });

    const arpStudioGames = arpStudioGamesFixture.filter(
      (game) =>
        game.gameid !== GACLiveStudioGameId &&
        game.gameid !== GACPublicklyBlacklistedLiveStudioGameId,
    );

    const arpStadiumGames = opmgLobbyGamesFixture.filter(
      (game) =>
        game.game !== GACLiveStadiumGameId &&
        game.game !== GACPublicklyBlacklistedLiveStadiumGameId,
    );

    const { games } = extractGqlResponse<GetGames>(
      responseGetGamesByCategoryQuery,
      'getGamesByCategory',
    );

    const gameIds = games.map(({ id }) => id);
    const gameNames = games.map(({ name }) => name);

    expect(gameNames.sort()).toEqual(
      [
        ...arpStadiumGames.map(({ title }) => title),
        ...arpStudioGames.map(({ gametitle }) => gametitle),
      ].sort(),
    );
    expect(gameIds.includes(String(GACLiveStudioGameId))).toBeFalsy();
    expect(gameIds.includes(String(GACLiveStadiumGameId))).toBeFalsy();
  });

  it('Should publicly blacklist specific games of specific provider and should not return in getGamesByCategory(LIVE_SLOTS)', async () => {
    const response = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      gameIdsArrayLiveSlot,
      GameProvidersEnum.LIVE_SLOTS,
      true,
    );

    expect(extractGqlResponse(response, 'gameAccessControlManagment')).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_SLOTS,
          gameIds: gameIdsArrayLiveSlot,
        },
      ],
    });

    const responseGetLiveSlotsQuery = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: getLiveSlotsQuery,
      });

    const { games } = extractGqlResponse<GetGames>(
      responseGetLiveSlotsQuery,
      'getGamesByCategory',
    );

    const gameNames = games.map(({ gameName }) => gameName);
    const gameIds = games.map(({ id }) => id);

    const arpSlotsGames = arpSlotResponseFixture.gameData.filter(
      (game) =>
        game.id !== GACLiveSlotGameId &&
        game.id !== GACPublicklyBlacklistedLiveSlotGameId,
    );

    const expectedResult = [...arpSlotsGames.map((game) => game.game_name)];

    expect(gameNames.sort()).toEqual([...expectedResult].sort());
    expect(gameIds.includes(String(GACLiveSlotGameId))).toBeFalsy();
  });

  it('Should publicly blacklist specific games of specific provider and should not return in getGamesByCategory(E_GAMES)', async () => {
    for (const { provider, gameId } of blacklistedGames) {
      const response = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        [gameId],
        provider,
        true,
      );

      expect(
        extractGqlResponse(response, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.CQ9],
          provider: GameProvidersEnum.CQ9,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION],
          provider: GameProvidersEnum.EVOLUTION,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOPLAY],
          provider: GameProvidersEnum.EVOPLAY,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.KING_MIDAS],
          provider: GameProvidersEnum.KING_MIDAS,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.NETENT],
          provider: GameProvidersEnum.NETENT,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.NOLIMITCITY],
          provider: GameProvidersEnum.NOLIMITCITY,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.PRAGMATIC_PLAY],
          provider: GameProvidersEnum.PRAGMATIC_PLAY,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.REDTIGER],
          provider: GameProvidersEnum.REDTIGER,
        },
      ],
    });

    const responseGetEGamesQuery = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: getEGamesQuery,
      });

    const { games } = extractGqlResponse<GetGames>(
      responseGetEGamesQuery,
      'getGamesByCategory',
    );

    const gameIds = games.map(({ id }) => id);

    const sigGames = sigGamesFixture.data.games.filter(
      (game) =>
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOPLAY &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.NETENT &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.NOLIMITCITY &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.KING_MIDAS &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.CQ9 &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.PRAGMATIC_PLAY &&
        game.gameid !== SOME_BLACKLISTED_E_GAMES_FOR_TEST.REDTIGER,
    );

    const sigGamesGameIds = [...sigGames.map((game) => game.gameid)];

    expect(gameIds.sort()).toEqual(sigGamesGameIds.sort());
  });

  it('Should publicly blacklist specific games of specific provider and prevent access for unauthorized user(E_GAMES)', async () => {
    for (const { provider, gameId } of blacklistedGames) {
      const response = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        [gameId],
        provider,
        true,
      );

      expect(
        extractGqlResponse(response, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.CQ9],
          provider: GameProvidersEnum.CQ9,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION],
          provider: GameProvidersEnum.EVOLUTION,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOPLAY],
          provider: GameProvidersEnum.EVOPLAY,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.KING_MIDAS],
          provider: GameProvidersEnum.KING_MIDAS,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.NETENT],
          provider: GameProvidersEnum.NETENT,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.NOLIMITCITY],
          provider: GameProvidersEnum.NOLIMITCITY,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.PRAGMATIC_PLAY],
          provider: GameProvidersEnum.PRAGMATIC_PLAY,
        },
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.REDTIGER],
          provider: GameProvidersEnum.REDTIGER,
        },
      ],
    });

    for (const { gameId, provider } of blacklistedGames) {
      const response = await getGameByIdWithProviderHelper(
        app.getHttpServer(),
        gql,
        gameId,
        provider,
        postOtpToken,
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0]).toMatchObject({
        message: gatewayGACMACErrorMessages.blackList,
        code: HttpStatus.FORBIDDEN,
        requestId,
      });
    }
  });

  it('Should publicly blacklist specific games of specific provider and prevent access for authorized user(LIVE_SLOTS)', async () => {
    const response = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      gameIdsArrayLiveSlot,
      GameProvidersEnum.LIVE_SLOTS,
      true,
    );

    expect(extractGqlResponse(response, 'gameAccessControlManagment')).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_SLOTS,
          gameIds: gameIdsArrayLiveSlot,
        },
      ],
    });

    const responseEnterLiveSlotsGameMutation = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: enterLiveSlotsGameMutation(
          String(GACPublicklyBlacklistedLiveSlotGameId),
        ),
      });

    expect(responseEnterLiveSlotsGameMutation.body.errors).toBeDefined();
    expect(responseEnterLiveSlotsGameMutation.body.errors[0]).toMatchObject({
      message: gatewayGACMACErrorMessages.blackList,
      code: HttpStatus.FORBIDDEN,
      requestId,
    });

    const responseEnterLiveSlotsGameMutation2 = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: enterLiveSlotsGameMutation(String(GACLiveSlotGameId)),
      });

    expect(responseEnterLiveSlotsGameMutation2.body.errors).toBeDefined();
    expect(responseEnterLiveSlotsGameMutation2.body.errors[0]).toMatchObject({
      message: gatewayGACMACErrorMessages.blackList,
      code: HttpStatus.FORBIDDEN,
      requestId,
    });
  });

  it('Should publicly blacklist specific games of specific provider and prevent access for authorized user(LIVE_CASINO)', async () => {
    const response = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      gameIdsArrayLiveStudio,
      GameProvidersEnum.LIVE_STUDIO,
      true,
    );

    expect(extractGqlResponse(response, 'gameAccessControlManagment')).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_STUDIO,
          gameIds: gameIdsArrayLiveStudio,
        },
      ],
    });

    for (const gameId of gameIdsArrayLiveStudio) {
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({
          query: getEnterLiveGameQuery(gameId),
        });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0]).toMatchObject({
        message: gatewayGACMACErrorMessages.blackList,
        code: HttpStatus.FORBIDDEN,
        requestId,
      });
    }
  });

  it('Should publicly blacklist specific games of specific provider and allow access for whitelisted user(EVOLUTION)', async () => {
    const responseGameAccessControlManagmentMutation =
      await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION],
        GameProvidersEnum.EVOLUTION,
        true,
      );

    expect(
      extractGqlResponse(
        responseGameAccessControlManagmentMutation,
        'gameAccessControlManagment',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION],
          provider: GameProvidersEnum.EVOLUTION,
        },
      ],
    });

    const responseAddWhitelistedUserIds = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.EVOLUTION,
          gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION],
          whitelistedUserIds: ['300923738'],
        }),
      });

    expect(
      extractGqlResponse(
        responseAddWhitelistedUserIds,
        'addWhitelistedUserIdsToGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '300923738',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.EVOLUTION,
              gameIds: [SOME_BLACKLISTED_E_GAMES_FOR_TEST.EVOLUTION],
            },
          ],
        },
      ],
    });

    const responseGetGameByIdWithProviderQuery =
      await getGameByIdWithProviderHelper(
        app.getHttpServer(),
        gql,
        '265',
        GameProvidersEnum.EVOLUTION,
        postOtpToken,
      );

    expect(
      extractGqlResponse<GameV1>(
        responseGetGameByIdWithProviderQuery,
        'getGameById',
      ),
    ).toEqual({
      id: '265',
      name: 'test',
      assetId: '123',
      gameType: 'BACCARAT',
      iframeUrl: 'test',
    });
  });

  it('Should publicly blacklist specific games of specific provider and allow access for whitelisted user(LIVE_SLOTS)', async () => {
    const response = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      [String(GACLiveSlotGameId)],
      GameProvidersEnum.LIVE_SLOTS,
      true,
    );

    expect(extractGqlResponse(response, 'gameAccessControlManagment')).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_SLOTS,
          gameIds: [String(GACLiveSlotGameId)],
        },
      ],
    });

    const responseAddWhitelistedUserIds = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.LIVE_SLOTS,
          gameIds: [String(GACLiveSlotGameId)],
          whitelistedUserIds: ['300923738'],
        }),
      });

    expect(
      extractGqlResponse(
        responseAddWhitelistedUserIds,
        'addWhitelistedUserIdsToGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '300923738',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.LIVE_SLOTS,
              gameIds: [String(GACLiveSlotGameId)],
            },
          ],
        },
      ],
    });

    const responseEnterLiveSlotsGameMutation = await request(
      app.getHttpServer(),
    )
      .post(gql)
      .set('Cookie', postOtpToken)
      .send({
        query: enterLiveSlotsGameMutation(String(GACLiveSlotGameId)),
      });

    expect(
      extractGqlResponse(
        responseEnterLiveSlotsGameMutation,
        'enterLiveSlotsGame',
      ),
    ).toEqual(arpSlotResponseFinalFixture);
  });

  test(`Get live casino games(should ignore ${GACLiveStudioGameId}, ${GACPublicklyBlacklistedLiveStudioGameId}, ${GACPublicklyBlacklistedLiveStadiumGameId}, ${GACLiveStadiumGameId} because of GAC)`, async () => {
    for (const {
      provider,
      gameIds,
      blacklistGames,
    } of gameAccessControlConfigs) {
      const response = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        gameIds,
        provider,
        blacklistGames,
      );

      expect(
        extractGqlResponse(response, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });
    }

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_STADIUM,
          gameIds: gameIdsArrayLiveStadium,
        },
        {
          provider: GameProvidersEnum.LIVE_STUDIO,
          gameIds: gameIdsArrayLiveStudio,
        },
      ],
    });

    const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: getGamesByCategoryQuery(GameCategoryEnum.LIVE_CASINO),
      });

    const arpStudioGames = arpStudioGamesFixture.filter(
      (game) =>
        game.gameid !== GACLiveStudioGameId &&
        game.gameid !== GACPublicklyBlacklistedLiveStudioGameId,
    );

    const arpStadiumGames = opmgLobbyGamesFixture.filter(
      (game) =>
        game.game !== GACLiveStadiumGameId &&
        game.game !== GACPublicklyBlacklistedLiveStadiumGameId,
    );

    const { games } = extractGqlResponse<GetGames>(
      responseGetGamesByCategoryQuery,
      'getGamesByCategory',
    );

    const gameIds = games.map(({ id }) => id);
    const gameNames = games.map(({ name }) => name);

    expect(gameNames.sort()).toEqual(
      [
        ...arpStadiumGames.map(({ title }) => title),
        ...arpStudioGames.map(({ gametitle }) => gametitle),
      ].sort(),
    );
    expect(gameIds.includes(String(GACLiveStudioGameId))).toBeFalsy();
    expect(gameIds.includes(String(GACLiveStadiumGameId))).toBeFalsy();
  });

  it('Should publicly blacklist specific games of specific provider and allow access for whitelisted user(LIVE_CASINO)', async () => {
    const response = await gameAccessControlManagmentQueryHelper(
      app.getHttpServer(),
      gql,
      gameIdsArrayLiveStudio,
      GameProvidersEnum.LIVE_STUDIO,
      true,
    );

    expect(extractGqlResponse(response, 'gameAccessControlManagment')).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetPubliclyClosedGames = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getPubliclyClosedGames,
      });

    expect(
      extractGqlResponse(
        responseGetPubliclyClosedGames,
        'getPubliclyClosedGames',
      ),
    ).toEqual({
      status: true,
      code: 200,
      blacklistedGamesFromGACData: [
        {
          provider: GameProvidersEnum.LIVE_STUDIO,
          gameIds: gameIdsArrayLiveStudio,
        },
      ],
    });

    const responseAddWhitelistedUserIds = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: addWhitelistedUserIdsMutation({
          gameProvider: GameProvidersEnum.LIVE_STUDIO,
          gameIds: gameIdsArrayLiveStudio,
          whitelistedUserIds: ['300923738'],
        }),
      });

    expect(
      extractGqlResponse(
        responseAddWhitelistedUserIds,
        'addWhitelistedUserIdsToGAC',
      ),
    ).toEqual({
      status: true,
      code: 200,
      message: 'success',
    });

    const responseGetWhitelistedUserIdsData = await request(app.getHttpServer())
      .post(gql)
      .set('Cookie', postOtpToken)
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        query: getWhitelistedUserIdsData,
      });

    expect(
      extractGqlResponse(
        responseGetWhitelistedUserIdsData,
        'getWhitelistedUserIdsData',
      ),
    ).toEqual({
      status: true,
      code: 200,
      whitelistedUserIdsDataFromGAC: [
        {
          userId: '300923738',
          whitelistedGames: [
            {
              provider: GameProvidersEnum.LIVE_STUDIO,
              gameIds: gameIdsArrayLiveStudio,
            },
          ],
        },
      ],
    });

    for (const gameId of gameIdsArrayLiveStudio) {
      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', postOtpToken)
        .send({ query: getEnterLiveGameQuery(gameId) });

      const payload = extractGqlResponse<string>(
        enterGameResponse,
        'enterLiveGame',
      );

      expect(payload).toBeTruthy();
    }
  });

  describe('GAC with MAC', () => {
    it('Should not block enter into game providers games for whitelisted user when maintenance is enabled', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const startMaintenanceResponse = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(startMaintenanceResponse.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: startMaintenanceResponse.body.timestamp,
      });

      const addToMACResponse = await request(app.getHttpServer())
        .post('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300923738'], //hardcoded test username from login response
        })
        .expect(HttpStatus.CREATED);

      expect(addToMACResponse.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.addedToMAC,
        timestamp: addToMACResponse.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const gameProviders = [
        {
          provider: GameProvidersEnum.LIVE_SLOTS,
          gameIds: [String(GACLiveSlotGameId)],
        },
        { provider: GameProvidersEnum.EVOLUTION, gameIds: ['265'] },
        { provider: GameProvidersEnum.BIGTIMEGAMING, gameIds: ['265'] },
        { provider: GameProvidersEnum.EVOPLAY, gameIds: ['265'] },
        { provider: GameProvidersEnum.NOLIMITCITY, gameIds: ['265'] },
        { provider: GameProvidersEnum.NETENT, gameIds: ['265'] },
      ];

      for (const { provider, gameIds } of gameProviders) {
        const response = await gameAccessControlManagmentQueryHelper(
          app.getHttpServer(),
          gql,
          gameIds,
          provider,
          true,
        );

        expect(
          extractGqlResponse(response, 'gameAccessControlManagment'),
        ).toEqual({
          status: true,
          code: 200,
          message: 'success',
        });
      }

      const gameQueries = [
        {
          query: getEnterLiveGameQuery('gameId'),
          checkResponse: (response: any) => {
            const payload = extractGqlResponse<string>(
              response,
              'enterLiveGame',
            );
            expect(payload).toBeTruthy();
          },
        },
        {
          query: enterLiveSlotsGameMutation(String(GACLiveSlotGameId)),
          checkResponse: (response: any) => {
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0]).toMatchObject({
              message: gatewayGACMACErrorMessages.blackList,
              code: HttpStatus.FORBIDDEN,
              requestId,
            });
          },
        },
        ...[
          GameProvidersEnum.EVOLUTION,
          GameProvidersEnum.BIGTIMEGAMING,
          GameProvidersEnum.EVOPLAY,
          GameProvidersEnum.NETENT,
          GameProvidersEnum.NOLIMITCITY,
        ].map((provider) => ({
          query: getGameByIdWithProviderQuery('265', provider),
          checkResponse: (response: any) => {
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0]).toMatchObject({
              message: gatewayGACMACErrorMessages.blackList,
              code: HttpStatus.FORBIDDEN,
              requestId,
            });
          },
        })),
      ];

      for (const { query, checkResponse } of gameQueries) {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set('Cookie', postOtpToken)
          .send({ query });

        checkResponse(response);
      }

      const gameByIdQueries = [
        {
          provider: GameProvidersEnum.REDTIGER,
          gameId: '265',
          expectedResult: {
            id: '265',
            name: 'test',
            assetId: '123',
            gameType: 'BACCARAT',
            iframeUrl: 'test',
          },
        },
        {
          provider: GameProvidersEnum.PRAGMATIC_PLAY,
          gameId: '265',
          expectedResult: {
            id: '265',
            name: 'test',
            assetId: '123',
            gameType: 'BACCARAT',
            iframeUrl: 'test',
          },
        },
      ];

      for (const { provider, gameId, expectedResult } of gameByIdQueries) {
        const response = await getGameByIdWithProviderHelper(
          app.getHttpServer(),
          gql,
          gameId,
          provider,
          postOtpToken,
        );

        expect(extractGqlResponse<GameV1>(response, 'getGameById')).toEqual(
          expectedResult,
        );
      }
    });
  });
});
