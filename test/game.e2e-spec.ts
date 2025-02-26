import { getQueueToken } from '@nestjs/bullmq';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  AllGamesCacheService,
  GameHistoryCacheService,
  GameStateCacheService,
} from '@cache/services';
import {
  GameAccessControlEntity,
  ProvidersMaintenanceEntity,
} from '@db/entity';
import { QueueEnum } from '@enums';
import {
  GameCategoryEnum,
  GameProvidersEnum,
  GameSubTypeEnum,
} from '@gateway/enums/game.enum';
import { GameV1, GetGames } from '@gateway/models';
import { GatewayGameService } from '@gateway/services';
import { ArpSlotsApiVersionEnum } from '@services/rest/arp-slot/enums';
import { getArpSlotServiceToken } from '@services/rest/arp-slot/helpers/get-arp-slot-service-token';
import { ArpSlotGameService } from '@services/rest/arp-slot/services';
import { ArpStudioGameService } from '@services/rest/arp-studio/services';
import { OpmgGameActionEnum } from '@services/rest/opmg/dto';
import { OpmgAuthService } from '@services/rest/opmg/services';
import { SigGameService } from '@services/rest/sig/services';
import {
  gatewayErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';
import { removeFavoriteGamesQuery } from '@test/queries/remove-favorite.games.query';

import { Queue } from 'bullmq';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { extractGqlResponse } from './helpers/extract-gql-response.helper';
import { gameAccessControlManagmentQueryHelper } from './helpers/game-access-control-gql-mutation.helper';
import {
  arpSlotResponseFinalFixture,
  arpSlotResponseFixture,
  GACLiveSlotGameId,
} from './mocks/fixtures/arp-slots';
import { arpStudioGameLobbyFixture } from './mocks/fixtures/arp-studio/arp-studio-game-lobby.fixture';
import { GACLiveStudioGameId } from './mocks/fixtures/arp-studio/arp-studio-games.fixture';
import {
  allGamesFinalFixture,
  allGamesFinalFixtureWithoutLiveSLots,
  allGamesFinalFixtureWithoutSomeEGames,
  allGamesFinalFixtureWithoutSomeLiveStadium,
  allGamesFixtureFromGatewayGameService,
  allGamesFixtureFromGatewayGameServiceWithoutLIVESLOTS,
  allGamesFixtureFromGatewayGameServiceWithoutSomeEGames,
  allGamesFixtureFromGatewayGameServiceWithoutSomeLiveStadium,
  allGamesWithouLiveSlotsGamesFixtureFromGatewayGameService,
  allGamesWithoutEgamesFinalFixture,
  allGamesWithoutEgamesFixtureFromGatewayGameService,
  allGamesWithoutLiveSlotsGamesFinalFixture,
  allGamesWithoutOPMGGamesFinalFixture,
  allGamesWithoutOPMGGamesFixtureFromGatewayGameService,
  allGamesWithoutStadiumGamesFinalFixture,
  allGamesWithoutStadiumGamesFixtureFromGatewayGameService,
} from './mocks/fixtures/gateway';
import { opmgLobbyGamesFixture } from './mocks/fixtures/opmg';
import { sigGamesFixture } from './mocks/fixtures/sig';
import { addFavoriteGamesQuery } from './queries/add-favorite.games.query';
import { getFavoriteGamesQuery } from './queries/get-favorite-games.query';
import { getGamesByCategoryQuery } from './queries/get-games-by-category.query';
import { cookieOtpTokenHelper } from './helpers';
import { enterLiveSlotsGameMutation } from './mutations';
import {
  getAllGamesQuery,
  getEnterLiveGameQuery,
  getEnterStadiumGameQuery,
  getExitLiveGame,
  getExitStadiumGame,
  getGameByIdQuery,
  getLiveSlotsQuery,
  getRealGameByIdQuery,
} from './queries';

import { AppModule } from '../src/app.module';

const gql = '/graphql';

describe('Games (e2e)', () => {
  let app: INestApplication;
  let gameHistoryCacheService: GameHistoryCacheService;
  let gameStateCacheService: GameStateCacheService;
  let allGamesCacheService: AllGamesCacheService;
  let gatewayGameService: GatewayGameService;
  let gameAccessControlRepository: Repository<GameAccessControlEntity>;
  let providerMaintenanceRepository: Repository<ProvidersMaintenanceEntity>;
  let queue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    gameAccessControlRepository = moduleFixture.get<
      Repository<GameAccessControlEntity>
    >(getRepositoryToken(GameAccessControlEntity));

    providerMaintenanceRepository = moduleFixture.get<
      Repository<ProvidersMaintenanceEntity>
    >(getRepositoryToken(ProvidersMaintenanceEntity));

    queue = moduleFixture.get<Queue>(
      getQueueToken(QueueEnum.ALL_GAMES_CACHE_UPDATE_QUEUE),
    );

    gatewayGameService = app.get(GatewayGameService);

    await app.init();
  });

  beforeEach(async () => {
    gameHistoryCacheService = app.get(GameHistoryCacheService);
    gameStateCacheService = app.get(GameStateCacheService);
    allGamesCacheService = app.get(AllGamesCacheService);
    await queue.obliterate();
    await allGamesCacheService.deleteAllGames();
    await gameAccessControlRepository.clear();
    await providerMaintenanceRepository.clear();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await allGamesCacheService.deleteAllGames();
    await gameAccessControlRepository.clear();
    await providerMaintenanceRepository.clear();
    await app.close();
  });

  describe('Games (E_GAMES)', () => {
    it('Should get all games(e_games, live_slots, live_casino)', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixture,
      );
    });

    it('Should put requestAllGames response in redis', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixture,
      );

      const allGamesInCache = await allGamesCacheService.getAllGames();

      expect(allGamesInCache).toEqual(allGamesFixtureFromGatewayGameService);
    });

    it('Should get all games(e_games, live_slots, live_casino) from redis if cache exists', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixture,
      );

      //should have cache after call without cache
      const allGamesInCache = await allGamesCacheService.getAllGames();

      expect(allGamesInCache).toEqual(allGamesFixtureFromGatewayGameService);

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response2 = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response2, 'getAllGames')).toEqual(
        allGamesFinalFixture,
      );

      expect(requestAllGamesSpy).not.toHaveBeenCalled();
    });

    it('GAC gameAccessControlManagment should add job to update cache', async () => {
      const blacklistResponse = await gameAccessControlManagmentQueryHelper(
        app.getHttpServer(),
        gql,
        ['1', '2', '3'],
        GameProvidersEnum.EGT,
        true,
      );

      expect(
        extractGqlResponse(blacklistResponse, 'gameAccessControlManagment'),
      ).toEqual({
        status: true,
        code: 200,
        message: 'success',
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      //should  have cache
      const allGamesInCache2 = await allGamesCacheService.getAllGames();

      expect(allGamesInCache2).toEqual(allGamesFixtureFromGatewayGameService);

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixture,
      );
    });

    it('GAC gameAccessControlManagment should update cache(remove blacklisted games from cache(LIVE_SLOTS))', async () => {
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesFixtureFromGatewayGameServiceWithoutLIVESLOTS,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );
      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixtureWithoutLiveSLots,
      );
    });

    it('GAC gameAccessControlManagment should update cache(remove blacklisted games from cache(LIVE_STADIUM))', async () => {
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesFixtureFromGatewayGameServiceWithoutSomeLiveStadium,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixtureWithoutSomeLiveStadium,
      );
    });

    it('GAC gameAccessControlManagment should update cache(remove blacklisted games from cache(E_GAMES))', async () => {
      const responseFromBlacklistGame =
        await gameAccessControlManagmentQueryHelper(
          app.getHttpServer(),
          gql,
          ['265', '256'],
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesFixtureFromGatewayGameServiceWithoutSomeEGames,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesFinalFixtureWithoutSomeEGames,
      );
    });

    it('getAllGames should not provide OPMG games in case of OPMG API error(response without cache, and response from cache )', async () => {
      const opmgAuthService = app.get<OpmgAuthService>(OpmgAuthService);

      // Mock OpmgAuthService.enterOnlineLobby to throw an error
      jest
        .spyOn(opmgAuthService, 'enterOnlineLobby')
        .mockRejectedValueOnce(new Error('OPMG API Error'));

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesWithoutOPMGGamesFinalFixture,
      );

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesWithoutOPMGGamesFixtureFromGatewayGameService,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response2 = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response2, 'getAllGames')).toEqual(
        allGamesWithoutOPMGGamesFinalFixture,
      );
    });

    it('getAllGames should not provide STADIUM games in case of STADIUM API error(response without cache, and response from cache )', async () => {
      const arpStudioGameService =
        app.get<ArpStudioGameService>(ArpStudioGameService);

      // Mock ArpStudioGameService.gameLobby to throw an error
      jest
        .spyOn(arpStudioGameService, 'gameLobby')
        .mockRejectedValueOnce(new Error('STADIUM API Error'));

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesWithoutStadiumGamesFinalFixture,
      );

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesWithoutStadiumGamesFixtureFromGatewayGameService,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response2 = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response2, 'getAllGames')).toEqual(
        allGamesWithoutStadiumGamesFinalFixture,
      );
    });

    it('getAllGames should not provide LIVE_SLOTS games in case of LIVE_SLOTS API error(response without cache, and response from cache )', async () => {
      const gameServiceToken = getArpSlotServiceToken(
        ArpSlotGameService,
        ArpSlotsApiVersionEnum.V2,
      );
      const arpSlotGameService = app.get<ArpSlotGameService>(gameServiceToken);

      // Mock ArpSlotGameService.getSlotData to throw an error
      jest
        .spyOn(arpSlotGameService, 'getSlotData')
        .mockRejectedValueOnce(new Error('LIVE_SLOTS API Error'));

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesWithoutLiveSlotsGamesFinalFixture,
      );

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesWithouLiveSlotsGamesFixtureFromGatewayGameService,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response2 = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response2, 'getAllGames')).toEqual(
        allGamesWithoutLiveSlotsGamesFinalFixture,
      );
    });

    it('getAllGames should not provide E_GAMES games in case of E_GAMES API error(response without cache, and response from cache )', async () => {
      const sigGameService = app.get<SigGameService>(SigGameService);

      // Mock SigGameService.getGames to throw an error
      jest
        .spyOn(sigGameService, 'getGames')
        .mockRejectedValueOnce(new Error('E_GAMES API Error'));

      const response = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getAllGames')).toEqual(
        allGamesWithoutEgamesFinalFixture,
      );

      //should  have cache
      const allGamesInCacheAfterGACActivity =
        await allGamesCacheService.getAllGames();

      expect(allGamesInCacheAfterGACActivity).toEqual(
        allGamesWithoutEgamesFixtureFromGatewayGameService,
      );

      const requestAllGamesSpy = jest.spyOn(
        gatewayGameService,
        'requestAllGames',
      );

      const response2 = await request(app.getHttpServer()).post(gql).send({
        query: getAllGamesQuery,
      });

      expect(requestAllGamesSpy).not.toHaveBeenCalled();

      expect(extractGqlResponse<GameV1>(response2, 'getAllGames')).toEqual(
        allGamesWithoutEgamesFinalFixture,
      );
    });

    it('get game by id', async () => {
      const response = await request(app.getHttpServer()).post(gql).send({
        query: getGameByIdQuery,
      });

      expect(extractGqlResponse<GameV1>(response, 'getGameById')).toEqual({
        id: '265',
        name: 'test',
        assetId: '123',
        gameType: 'BACCARAT',
        iframeUrl: 'test',
      });
    });

    it('get real game by id (negative)', async () => {
      const response = (await request(app.getHttpServer()).post(gql).send({
        query: getRealGameByIdQuery,
      })) as any;

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.userShouldBeLoggedIn,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('get real game by id (positive)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: getRealGameByIdQuery,
        });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.getGameById).toEqual({
        id: '265',
        name: 'test',
        assetId: '123',
        gameType: 'BACCARAT',
        iframeUrl: 'test',
      });
    });

    it('categories query', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query { categories }
      `,
        });

      const { categories } = response.body.data;
      expect(categories).toEqual(Object.keys(GameCategoryEnum));
    });

    it('exit virtual game mutation', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: `mutation{
            exitVirtualGame(gameId:"265", platformId: 16)
          }
      `,
        });

      const { exitVirtualGame } = response.body.data;
      expect(exitVirtualGame).toEqual(true);
    });

    it('Should set isFavorite flag to game(E_GAME) - default subType is NONE', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const favoriteGame = sigGamesFixture.data.games[0];

      await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: addFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.E_GAME,
          ),
        });

      const favoriteGames = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getGamesByCategoryQuery(GameCategoryEnum.E_GAME) });

      const getGamesResp = extractGqlResponse<GetGames>(
        favoriteGames,
        'getGamesByCategory',
      );

      const favGameFromResp = getGamesResp.games.find(
        ({ id }) => id === String(favoriteGame.gameid),
      );

      expect(
        favGameFromResp.isFavorite === true &&
          favGameFromResp.gameSubType === 'NONE',
      ).toBeTruthy();
    });

    it('Should unable to set isFavorite flag to game(E_GAME) for unauthorized user - default subType is NONE', async () => {
      const favoriteGame = sigGamesFixture.data.games[0];

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: addFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.E_GAME,
          ),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Should remove isFavorite flag to game(E_GAME) - default subType is NONE', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const favoriteGame = sigGamesFixture.data.games[0];

      await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: removeFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.E_GAME,
          ),
        });

      const favoriteGames = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getGamesByCategoryQuery(GameCategoryEnum.E_GAME) });

      const getGamesResp = extractGqlResponse<GetGames>(
        favoriteGames,
        'getGamesByCategory',
      );

      const favGameFromResp = getGamesResp.games.find(
        ({ id }) => id === String(favoriteGame.gameid),
      );

      expect(
        favGameFromResp.isFavorite === false &&
          favGameFromResp.gameSubType === 'NONE',
      ).toBeTruthy();
    });
  });

  it('Should unable to remove isFavorite flag to game(E_GAME) for unauthorized user - default subType is NONE', async () => {
    const favoriteGame = sigGamesFixture.data.games[0];

    const response = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: removeFavoriteGamesQuery(
          String(favoriteGame.gameid),
          GameCategoryEnum.E_GAME,
        ),
      });

    expect(response.body.errors[0].message).toBe(
      gatewayErrorMessages.unauthorized,
    );
    expect(response.body.errors[0].code).toContain(
      responseBodyErrorMessages.unauthenticated,
    );
  });

  describe('Games (LIVE_CASINO)', () => {
    test(`Get live casino gameTypes`, async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query{
            getGamesByCategory(category: LIVE_CASINO) {
              gameTypes
            }
          }`,
        });

      expect(
        extractGqlResponse<GetGames>(response, 'getGamesByCategory').gameTypes,
      ).toEqual(['BACCARAT', 'ROULETTE', 'SICBO', 'SLOT']);
    });

    it('Should store favorite games(STADIUM)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const favoriteGame = opmgLobbyGamesFixture[2];

      await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: addFavoriteGamesQuery(
            String(favoriteGame.game),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.STADIUM,
          ),
        });

      const favoriteGames = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getFavoriteGamesQuery(GameCategoryEnum.LIVE_CASINO) });

      const data = extractGqlResponse<GameV1[]>(
        favoriteGames,
        'getFavoriteGames',
      );

      expect(
        data.some(({ id }) => id === String(favoriteGame.game)),
      ).toBeTruthy();
    });

    it('Should unable to store favorite games(STADIUM) for unauthorized user ', async () => {
      const favoriteGame = opmgLobbyGamesFixture[2];

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: addFavoriteGamesQuery(
            String(favoriteGame.game),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.STADIUM,
          ),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Should remove favorite games(STADIUM)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const favoriteGame = opmgLobbyGamesFixture[2];

      await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: removeFavoriteGamesQuery(
            String(favoriteGame.game),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.STADIUM,
          ),
        });

      const favoriteGames = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getFavoriteGamesQuery(GameCategoryEnum.LIVE_CASINO) });

      const data = extractGqlResponse<GameV1[]>(
        favoriteGames,
        'getFavoriteGames',
      );

      expect(
        data.some(({ id }) => id === String(favoriteGame.game)),
      ).toBeFalsy();
    });

    it('Should unable to remove favorite games(STADIUM) for unauthorized user ', async () => {
      const favoriteGame = opmgLobbyGamesFixture[2];

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: removeFavoriteGamesQuery(
            String(favoriteGame.game),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.STADIUM,
          ),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Should remove isFavorite flag to game(LIVE_CASINO)', async () => {
      const randomARPStudioFixtureGame = 2;
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const favoriteGame =
        arpStudioGameLobbyFixture.array[randomARPStudioFixtureGame];

      await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: removeFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.LIVE,
          ),
        });

      const favoriteGames = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getGamesByCategoryQuery(GameCategoryEnum.LIVE_CASINO) });

      const getGamesResp = extractGqlResponse<GetGames>(
        favoriteGames,
        'getGamesByCategory',
      );

      const favGameFromResp = getGamesResp.games.find(
        ({ id }) => id === String(favoriteGame.gameid),
      );

      expect(favGameFromResp.isFavorite).toBeFalsy();
    });

    it('Should unable to remove isFavorite flag to game(LIVE_CASINO) for unauthorized user ', async () => {
      const randomARPStudioFixtureGame = 2;
      const favoriteGame =
        arpStudioGameLobbyFixture.array[randomARPStudioFixtureGame];

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: removeFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.LIVE,
          ),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Should set isFavorite flag to game(LIVE_CASINO)', async () => {
      const randomARPStudioFixtureGame = 2;
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const favoriteGame =
        arpStudioGameLobbyFixture.array[randomARPStudioFixtureGame];

      await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: addFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.LIVE,
          ),
        });

      const favoriteGames = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getGamesByCategoryQuery(GameCategoryEnum.LIVE_CASINO) });

      const getGamesResp = extractGqlResponse<GetGames>(
        favoriteGames,
        'getGamesByCategory',
      );

      const favGameFromResp = getGamesResp.games.find(
        ({ id }) => id === String(favoriteGame.gameid),
      );

      expect(favGameFromResp.isFavorite).toBeTruthy();
    });

    it('Should unable to set isFavorite flag to game(LIVE_CASINO) for unauthorized user ', async () => {
      const randomARPStudioFixtureGame = 2;
      const favoriteGame =
        arpStudioGameLobbyFixture.array[randomARPStudioFixtureGame];

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: addFavoriteGamesQuery(
            String(favoriteGame.gameid),
            GameCategoryEnum.LIVE_CASINO,
            GameSubTypeEnum.LIVE,
          ),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Enter live game(enter OPMG game)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getEnterStadiumGameQuery('gameId') });

      const payload = extractGqlResponse<string>(
        enterGameResponse,
        'enterStadiumGame',
      );

      expect(payload).toBeTruthy();
    });

    it('Enter live game(enter Arp studio game)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getEnterLiveGameQuery('gameId') });

      const payload = extractGqlResponse<string>(
        enterGameResponse,
        'enterLiveGame',
      );

      expect(payload).toBeTruthy();
    });

    it('Unable to Enter live game(enter OPMG game) for unauthorized user', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({ query: getEnterStadiumGameQuery('gameId') });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Unable to Enter live game(enter Arp studio game) for unauthorized user', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({ query: getEnterLiveGameQuery('gameId') });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });

    it('Exit live game(exit Arp studio game)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getExitLiveGame() });

      const payload = extractGqlResponse<boolean>(
        enterGameResponse,
        'exitLiveGame',
      );

      expect(payload).toBeTruthy();
    });

    it('Exit live game(exit OPMG game)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getExitStadiumGame('gameId') });

      const payload = extractGqlResponse<any>(
        enterGameResponse,
        'exitStadiumGame',
      );

      expect(payload).toBeTruthy();
    });

    it('Whitelisted user should enter into publicly blacklisted live game(enter Arp studio game)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getEnterLiveGameQuery(String(GACLiveStudioGameId)) });

      const payload = extractGqlResponse<string>(
        enterGameResponse,
        'enterLiveGame',
      );

      expect(payload).toBeTruthy();
    });

    test(`Get live casino games with history (NOT stadium)`, async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query{
            getGamesByCategory(category: LIVE_CASINO) {
              gameTypes
              games{
                id,
                name
                gameHistory{
                  status
                  result
                }
              }
            }
          }`,
        });

      const { games } = extractGqlResponse<GetGames>(
        response,
        'getGamesByCategory',
      );

      const stadiumGamesHistory = games
        .filter(({ gameSubType }) => gameSubType === GameSubTypeEnum.STADIUM)
        .map(({ gameHistory }) => gameHistory);

      expect(
        stadiumGamesHistory.every((history) => history.length == 0),
      ).toEqual(true);
    });

    test(`Get live casino games with history (STADIUM)`, async () => {
      const gameData = opmgLobbyGamesFixture[2];

      await gameHistoryCacheService.setGameHistory(String(gameData.game), {
        action: OpmgGameActionEnum.gameHistory,
        gameid: gameData.game,
        numbers: '1,2,3,4,5,6,7,8,9,10',
      });

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query{
            getGamesByCategory(category: LIVE_CASINO) {
              gameTypes
              games{
                id,
                name
                stadiumHistory{
                  gameid
                }
              }
            }
          }`,
        });

      const gamesResponse = extractGqlResponse<GetGames>(
        response,
        'getGamesByCategory',
      );

      const find = gamesResponse.games.find(
        ({ id }) => id === String(gameData.game),
      );

      expect(find.stadiumHistory).toBeDefined();
    });

    test(`Get live casino games with state (STADIUM)`, async () => {
      const gameData = opmgLobbyGamesFixture[2];

      await gameStateCacheService.setGameState(String(gameData.game), {
        msg: 'test',
        action: OpmgGameActionEnum.gameState,
        gameid: gameData.game,
      });

      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query{
            getGamesByCategory(category: LIVE_CASINO) {
              gameTypes
              games{
                id,
                name
                stadiumState
              }
            }
          }`,
        });

      const gamesResponse = extractGqlResponse<GetGames>(
        response,
        'getGamesByCategory',
      );

      const find = gamesResponse.games.find(
        ({ id }) => id === String(gameData.game),
      );

      expect(find.stadiumState).toBeDefined();
    });

    it('Incorrect exit from unclosed live casino games (STADIUM)', async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getEnterLiveGameQuery(String(GACLiveStudioGameId)) });

      const payload = extractGqlResponse<string>(
        enterGameResponse,
        'enterLiveGame',
      );
      expect(payload).toBeTruthy();

      // const newToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
    });
  });

  describe('Games (LIVE_SLOTS)', () => {
    test(`Get live slots games`, async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: getLiveSlotsQuery,
        });

      const { games } = extractGqlResponse<GetGames>(
        response,
        'getGamesByCategory',
      );

      const gameNames = games.map(({ gameName }) => gameName);
      const gameIds = games.map(({ id }) => id);

      const arpSlotsGames = arpSlotResponseFixture.gameData;

      const expectedResult = [...arpSlotsGames.map((game) => game.game_name)];

      expect(gameNames.sort()).toEqual([...expectedResult].sort());
      expect(gameIds.includes(String(GACLiveSlotGameId))).toBeTruthy();
    });

    test(`Enter live slot game(whitelisted user can enter into publicly blacklisted game) `, async () => {
      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);
      const response = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: enterLiveSlotsGameMutation(String(GACLiveSlotGameId)),
        });

      expect(extractGqlResponse(response, 'enterLiveSlotsGame')).toEqual(
        arpSlotResponseFinalFixture,
      );
    });

    test(`Should unable to Enter live slot game for unauthorized user`, async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: enterLiveSlotsGameMutation(String(GACLiveSlotGameId)),
        });

      expect(response.body.errors[0].message).toBe(
        gatewayErrorMessages.unauthorized,
      );
      expect(response.body.errors[0].code).toContain(
        responseBodyErrorMessages.unauthenticated,
      );
    });
  });
});
