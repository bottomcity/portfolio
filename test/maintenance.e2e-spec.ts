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
  ProviderMaintenanceAccessControlEntity,
  ProvidersMaintenanceEntity,
} from '@db/entity';
import { QueueEnum } from '@enums';
import {
  GameCategoryEnum,
  GameProvidersEnum,
  MaintenanceConstrantsEnum,
} from '@gateway/enums';
import { GameV1, GetGames } from '@gateway/models';
import {
  testDates,
  testNames,
  testPhoneNumbers,
  testPINs,
} from '@test/enums/data-for-inputs-enums';
import {
  gatewayErrorMessages,
  gatewayGACMACErrorMessages,
  responseBodyErrorMessages,
} from '@test/enums/messages-enums';
import { RegisterEkycUserFinalFixture } from '@test/mocks/fixtures/sig';

import { Queue } from 'bullmq';
import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { isEqual, sortBy } from 'lodash';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import {
  arpSlotResponseFinalFixture,
  GACLiveSlotGameId,
} from './mocks/fixtures/arp-slots';
import { getGamesByCategorywithGameProvidersQuery } from './queries/get-games-by-category.query';
import {
  cookieCaptchaTokenHelper,
  cookieLoginTokenHelper,
  cookieOtpTokenHelper,
  extractGqlResponse,
} from './helpers';
import {
  enterLiveSlotsGameMutation,
  registerUserEkycMutation,
  verifyOtpMutation,
} from './mutations';
import {
  getEnterLiveGameQuery,
  getGameByIdWithProviderQuery,
  getProvidersInMaintenanceInfoQuery,
  getProvidersInMaintenanceInfoQueryUnexpectedField,
} from './queries';

import { AppModule } from '../src/app.module';

const requestId = 'abec9645-17a4-45cf-99d8-5a9074f9722f';
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => requestId),
}));

const gql = '/graphql';
//TODO: add helper functions to reduce code base
describe('MaintenanceController (e2e)', () => {
  let app: INestApplication;
  let providerMaintenanceRepository: Repository<ProvidersMaintenanceEntity>;
  let accessControlRepository: Repository<ProviderMaintenanceAccessControlEntity>;
  let queue: Queue;
  const endDate = new Date(Date.now() + 10000).toISOString();
  let postOtpToken: string[];
  let captchaCookie: string[];

  const allGameProviders: GameProvidersEnum[] = [
    GameProvidersEnum.EVOLUTION,
    GameProvidersEnum.BIGTIMEGAMING,
    GameProvidersEnum.EVOPLAY,
    GameProvidersEnum.NETENT,
    GameProvidersEnum.NOLIMITCITY,
    GameProvidersEnum.REDTIGER,
    GameProvidersEnum.PRAGMATIC_PLAY,
    GameProvidersEnum.EGT,
    GameProvidersEnum.CQ9,
    GameProvidersEnum.KING_MIDAS,
    GameProvidersEnum.LIVE_STUDIO,
    GameProvidersEnum.LIVE_SLOTS,
    GameProvidersEnum.LIVE_STADIUM,
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    app.use(graphqlUploadExpress());

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(
      app.get(TypeScriptExceptionFilter),
      app.get(AxiosExceptionFilter),
      app.get(HttpExceptionFilter),
    );

    await app.init();

    providerMaintenanceRepository = moduleFixture.get<
      Repository<ProvidersMaintenanceEntity>
    >(getRepositoryToken(ProvidersMaintenanceEntity));

    accessControlRepository = moduleFixture.get<
      Repository<ProviderMaintenanceAccessControlEntity>
    >(getRepositoryToken(ProviderMaintenanceAccessControlEntity));

    queue = moduleFixture.get<Queue>(
      getQueueToken(QueueEnum.MAINTENANCE_QUEUE),
    );

    captchaCookie = await cookieCaptchaTokenHelper(app.getHttpServer(), gql);
  });

  beforeEach(async () => {
    await providerMaintenanceRepository.delete({});
    await accessControlRepository.delete({});
    await queue.obliterate({ force: true });
    postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await providerMaintenanceRepository.delete({});
    await accessControlRepository.delete({});
    await queue.obliterate({ force: true });
    await app.close();
  });

  it('Should return forbidden for invalid API KEY start maintenance (POST)', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();

    const response = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', MaintenanceConstrantsEnum.LIVE_SLOTS)
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
      });

    expect(response.body.message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return error for each empty field when starting maintenance (POST)', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();

    const basePayload = {
      providers: [MaintenanceConstrantsEnum.LIVE_SLOTS],
      disable_login: true,
      info_bar: 'info_bar',
      text: 'text',
      start_date: startDate,
      end_date: endDate,
    };

    for (const field of Object.keys(basePayload)) {
      const payload = { ...basePayload };

      if (Array.isArray(payload[field])) {
        payload[field] = []; // Set array fields to empty array
      } else if (typeof payload[field] === 'boolean') {
        delete payload[field]; // Remove boolean fields to simulate 'missing'
      } else {
        payload[field] = ''; // Set other fields to an empty string
      }

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send(payload);

      // Check if the response contains the common error message
      const containsSubstring = response.body.message.some((msg: any) =>
        msg.includes(gatewayErrorMessages.shouldNotBeEmpty),
      );

      expect(containsSubstring).toBe(true);
      expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('Should start maintenance (POST)', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const response = await request(app.getHttpServer())
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

    expect(response.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: response.body.timestamp,
    });
  });

  it('Should return forbidden for invalid API KEY stop maintenance (POST)', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const response = await request(app.getHttpServer())
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

    expect(response.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: response.body.timestamp,
    });

    const responseFromStopMaintenanceEndpoint = await request(
      app.getHttpServer(),
    )
      .post('/maintenance/stop')
      .set('api-key', MaintenanceConstrantsEnum.LIVE_SLOTS)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.E_GAME,
        ],
      });

    expect(responseFromStopMaintenanceEndpoint.body.message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(responseFromStopMaintenanceEndpoint.body.statusCode).toEqual(
      HttpStatus.FORBIDDEN,
    );
  });

  it('Should return error for each empty field when stopping maintenance (POST)', async () => {
    // Define a base payload with valid data
    const basePayload = {
      providers: [MaintenanceConstrantsEnum.LIVE_SLOTS],
      disable_login: true,
      info_bar: 'info_bar',
      text: 'text',
      start_date: 'startDate',
      end_date: 'endDate',
    };

    const payload = { ...basePayload };

    for (const field of Object.keys(payload)) {
      if (Array.isArray(payload[field])) {
        payload[field] = []; // Set array fields to empty array
      } else if (typeof payload[field] === 'boolean') {
        delete payload[field]; // Remove boolean fields to simulate 'missing'
      } else {
        payload[field] = ''; // Set other fields to an empty string
      }
    }

    const response = await request(app.getHttpServer())
      .post('/maintenance/stop')
      .set('api-key', BACKOFFICE_API_KEY)
      .send(payload);

    const containsSubstring = response.body.message.some((msg: any) =>
      msg.includes(gatewayErrorMessages.shouldNotBeEmpty),
    );

    expect(containsSubstring).toBe(true);
    expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Should stop scheduled maintenance', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const response = await request(app.getHttpServer())
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

    expect(response.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: response.body.timestamp,
    });

    const responseFromStopMaintenanceEndpoint = await request(
      app.getHttpServer(),
    )
      .post('/maintenance/stop')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.E_GAME,
        ],
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStopMaintenanceEndpoint.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.stoppedMAC,
      timestamp: responseFromStopMaintenanceEndpoint.body.timestamp,
    });
  });

  it('Should stop enabled maintenance', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const response = await request(app.getHttpServer())
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

    expect(response.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: response.body.timestamp,
    });

    // wait for 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responseFromStopMaintenanceEndpoint = await request(
      app.getHttpServer(),
    )
      .post('/maintenance/stop')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.E_GAME,
        ],
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStopMaintenanceEndpoint.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.stoppedMAC,
      timestamp: responseFromStopMaintenanceEndpoint.body.timestamp,
    });
  }, 10000);

  it('Should not start maintenance for E_GAME providers twice(check E_GAME providers constraint)', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const responseFromStart1 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [MaintenanceConstrantsEnum.E_GAME],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStart1.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: responseFromStart1.body.timestamp,
    });

    const responseFromStart2 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.BIGTIMEGAMING,
          MaintenanceConstrantsEnum.EVOLUTION,
          MaintenanceConstrantsEnum.EVOPLAY,
          MaintenanceConstrantsEnum.NETENT,
          MaintenanceConstrantsEnum.NOLIMITCITY,
          MaintenanceConstrantsEnum.REDTIGER,
          MaintenanceConstrantsEnum.PRAGMATIC_PLAY,
          MaintenanceConstrantsEnum.CQ9,
          MaintenanceConstrantsEnum.KING_MIDAS,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseFromStart2.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: gatewayGACMACErrorMessages.unableToStart,
      timestamp: responseFromStart2.body.timestamp,
      requestId,
    });
  });

  it('Should not start maintenance for LIVE_CASINO providers twice(check LIVE_CASINO providers constraint)', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const responseFromStart1 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [MaintenanceConstrantsEnum.LIVE_CASINO],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStart1.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: responseFromStart1.body.timestamp,
    });

    const responseFromStart2 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_STADIUM,
          MaintenanceConstrantsEnum.LIVE_STUDIO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseFromStart2.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: gatewayGACMACErrorMessages.unableToStart,
      timestamp: responseFromStart2.body.timestamp,
      requestId,
    });
  });

  it('Should not start maintenance for game provider which is scheduled', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    const responseFromStart1 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [MaintenanceConstrantsEnum.LIVE_CASINO],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStart1.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: responseFromStart1.body.timestamp,
    });

    const responseFromStart2 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_STADIUM,
          MaintenanceConstrantsEnum.LIVE_SLOTS,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseFromStart2.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: gatewayGACMACErrorMessages.unableToStart,
      timestamp: responseFromStart2.body.timestamp,
      requestId,
    });
  });

  it('Should not start maintenance for game provider which maintenance is enabled', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 7000).toISOString();

    const responseFromStart1 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [MaintenanceConstrantsEnum.LIVE_CASINO],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStart1.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: responseFromStart1.body.timestamp,
    });

    await new Promise((resolve) => setTimeout(resolve, 15000));

    const startDate2 = new Date(Date.now() + 500).toISOString();
    const endDate2 = new Date(Date.now() + 2000).toISOString();

    const responseFromStart2 = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_STADIUM,
          MaintenanceConstrantsEnum.LIVE_SLOTS,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate2,
        end_date: endDate2,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseFromStart2.body).toEqual({
      requestId,
      statusCode: HttpStatus.BAD_REQUEST,
      message: gatewayGACMACErrorMessages.unableToStart,
      timestamp: responseFromStart2.body.timestamp,
    });
  }, 20000);

  it('Should not start maintenance (check start_date, end_date constraints)', async () => {
    const incorrectStartDate = new Date(Date.now()).toISOString();
    const incorrectEndDate = incorrectStartDate;

    const responseDatesLateThenCurrentTime = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: incorrectStartDate,
        end_date: incorrectEndDate,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseDatesLateThenCurrentTime.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      requestId,
      message: [
        'start_date must be later than current time',
        'end_date must be later than start_date',
      ],
      timestamp: responseDatesLateThenCurrentTime.body.timestamp,
    });

    const startDate = new Date(Date.now() + 500).toISOString();
    const endDateBeforeStart = new Date(Date.now() + 490).toISOString();

    const responseEndDateLaterThanStartDate = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDateBeforeStart,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseEndDateLaterThanStartDate.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['end_date must be later than start_date'],
      requestId,
      timestamp: responseEndDateLaterThanStartDate.body.timestamp,
    });
  });

  it('Should not start maintenance with invalid start_date and end_date', async () => {
    const startDate = new Date(Date.now() + 5000).toISOString();
    const endDate = new Date(Date.now() + 10000).toISOString();

    // Test invalid start_date
    const responseInvalidStartDate = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: 'invalid_start_date', // Invalid start_date
        end_date: endDate,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseInvalidStartDate.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      requestId,
      message: [
        'start_date must be later than current time',
        'start_date must be a valid ISO 8601 date string',
        'end_date must be later than start_date', // Adjusted for both validation errors
      ],
      timestamp: responseInvalidStartDate.body.timestamp, // Keep the timestamp dynamic
    });

    // Test invalid end_date
    const responseInvalidEndDate = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: 'invalid_end_date', // Invalid end_date
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseInvalidEndDate.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: [
        'end_date must be later than start_date',
        'end_date must be a valid ISO 8601 date string', // Include additional validation messages for the end_date
      ],
      requestId,
      timestamp: responseInvalidEndDate.body.timestamp, // Keep the timestamp dynamic
    });
  });

  it('Should not stop maintenance because of game provider do not have scheduled or enabled maintenance)', async () => {
    const startDate = new Date(Date.now() + 500).toISOString();
    const endDate = new Date(Date.now() + 1000).toISOString();

    const response = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDate,
        end_date: endDate,
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: response.body.timestamp,
    });

    const responseFromStopMaintenanceEndpoint = await request(
      app.getHttpServer(),
    )
      .post('/maintenance/stop')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [MaintenanceConstrantsEnum.E_GAME],
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseFromStopMaintenanceEndpoint.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: gatewayGACMACErrorMessages.unableToStop,
      requestId,
      timestamp: responseFromStopMaintenanceEndpoint.body.timestamp,
    });
  });

  it('Should stop maintenance for game providers(some of them are scheduled, others are in enabled mode)', async () => {
    //set short period of time to start maintenance
    const startDateShort = new Date(Date.now() + 500).toISOString();
    const endDateShort = new Date(Date.now() + 1000).toISOString();

    const responseFromStartShort = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
        ],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDateShort,
        end_date: endDateShort,
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStartShort.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: responseFromStartShort.body.timestamp,
    });

    //set long period of time to start maintenance
    const startDateLong = new Date(Date.now() + 20000).toISOString();
    const endDateLong = new Date(Date.now() + 30000).toISOString();

    const responseFromStartLong = await request(app.getHttpServer())
      .post('/maintenance/start')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [MaintenanceConstrantsEnum.E_GAME],
        disable_login: true,
        info_bar: 'info_bar',
        text: 'text',
        start_date: startDateLong,
        end_date: endDateLong,
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStartLong.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.scheduledMAC,
      timestamp: responseFromStartLong.body.timestamp,
    });

    // wait for 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responseFromStopMaintenanceEndpoint = await request(
      app.getHttpServer(),
    )
      .post('/maintenance/stop')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.E_GAME,
        ],
      })
      .expect(HttpStatus.CREATED);

    expect(responseFromStopMaintenanceEndpoint.body).toEqual({
      statusCode: HttpStatus.CREATED,
      message: gatewayGACMACErrorMessages.stoppedMAC,
      timestamp: responseFromStopMaintenanceEndpoint.body.timestamp,
    });
  });

  it('Should not stop maintenance because of no scheduled maintenance for game provider or providers', async () => {
    const response = await request(app.getHttpServer())
      .post('/maintenance/stop')
      .set('api-key', BACKOFFICE_API_KEY)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.E_GAME,
        ],
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      requestId,
      message: gatewayGACMACErrorMessages.unableToStop,
      timestamp: response.body.timestamp,
    });
  });

  it('Should return forbidden for invalid API KEY access control (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/maintenance/access-control')
      .set('api-key', MaintenanceConstrantsEnum.LIVE_SLOTS)
      .send({
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.E_GAME,
        ],
        user_ids: ['300936010'],
      });

    expect(response.body.message).toContain(
      gatewayGACMACErrorMessages.forbidden,
    );
    expect(response.body.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('Should return error for each empty field when accessing control (DELETE)', async () => {
    const testCases = [
      {
        providers: [],
        user_ids: ['300936010'],
        field: 'providers',
      },
      {
        providers: [
          MaintenanceConstrantsEnum.LIVE_SLOTS,
          MaintenanceConstrantsEnum.LIVE_CASINO,
          MaintenanceConstrantsEnum.E_GAME,
        ],
        user_ids: [],
        field: 'user_ids',
      },
    ];

    for (const { providers, user_ids } of testCases) {
      const response = await request(app.getHttpServer())
        .delete('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers,
          user_ids,
        });

      const containsSubstring = response.body.message.some((msg: any) =>
        msg.includes(gatewayErrorMessages.shouldNotBeEmpty),
      );

      expect(containsSubstring).toBe(true);
      expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  describe('MAC flow', () => {
    const providers = [
      GameProvidersEnum.EVOLUTION,
      GameProvidersEnum.BIGTIMEGAMING,
      GameProvidersEnum.EVOPLAY,
      GameProvidersEnum.NETENT,
      GameProvidersEnum.NOLIMITCITY,
      GameProvidersEnum.REDTIGER,
      GameProvidersEnum.PRAGMATIC_PLAY,
    ];

    it('Should add username to MAC', async () => {
      const response = await request(app.getHttpServer())
        .post('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300936010'],
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.addedToMAC,
        timestamp: response.body.timestamp,
      });
    });

    it('Should not remove username from MAC that has not been added', async () => {
      const response = await request(app.getHttpServer())
        .delete('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300936010'],
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        requestId,
        message:
          'Invalid user_ids. We do not have one of the user_id for one of the providers.',
        timestamp: response.body.timestamp,
      });
    });

    it('Should remove username from MAC with appropriate game providers', async () => {
      const responseFromAddUsernameToMAC = await request(app.getHttpServer())
        .post('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300936010'],
        })
        .expect(HttpStatus.CREATED);

      expect(responseFromAddUsernameToMAC.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.addedToMAC,
        timestamp: responseFromAddUsernameToMAC.body.timestamp,
      });

      const responseFromDeleteMAC = await request(app.getHttpServer())
        .delete('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300936010'],
        })
        .expect(HttpStatus.OK);

      expect(responseFromDeleteMAC.body).toEqual({
        statusCode: HttpStatus.OK,
        message: gatewayGACMACErrorMessages.updatedToMAC,
        timestamp: responseFromDeleteMAC.body.timestamp,
      });
    });

    it('Should remove username from MAC with appropriate game providers and do not affect other game providers', async () => {
      const responseFromAddUsernameToMAC = await request(app.getHttpServer())
        .post('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300936010'],
        })
        .expect(HttpStatus.CREATED);

      expect(responseFromAddUsernameToMAC.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.addedToMAC,
        timestamp: responseFromAddUsernameToMAC.body.timestamp,
      });

      const responseFromDeleteMAC = await request(app.getHttpServer())
        .delete('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          user_ids: ['300936010'],
        })
        .expect(HttpStatus.OK);

      expect(responseFromDeleteMAC.body).toEqual({
        statusCode: HttpStatus.OK,
        message: gatewayGACMACErrorMessages.updatedToMAC,
        timestamp: responseFromDeleteMAC.body.timestamp,
      });

      const responseFromGetMAC = await request(app.getHttpServer())
        .get('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .expect(HttpStatus.OK);

      expect(responseFromGetMAC.body).toEqual({
        statusCode: HttpStatus.OK,
        message: gatewayGACMACErrorMessages.extractUser,
        timestamp: responseFromGetMAC.body.timestamp,
        data: [
          {
            provider: MaintenanceConstrantsEnum.LIVE_SLOTS,
            user_ids: ['300936010'],
          },
        ],
      });
    });

    it('Should get empty data in maintenance access control', async () => {
      const response = await request(app.getHttpServer())
        .get('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: gatewayGACMACErrorMessages.extractUser,
        timestamp: response.body.timestamp,
        data: [],
      });
    });

    it('Should block login flow when maintenance is enabled', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const loginToken = await cookieLoginTokenHelper(app.getHttpServer(), gql);

      const otpResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', loginToken)
        .send({
          query: verifyOtpMutation,
        });

      const otpCookies = otpResponse.headers[
        'set-cookie'
      ] as unknown as string[];

      expect(otpResponse.body.errors).toEqual([
        {
          message: 'login is not available now',
          requestId,
          code: HttpStatus.BAD_REQUEST,
          timestamp: otpResponse.body.errors[0].timestamp,
        },
      ]);

      expect(otpCookies).toBeUndefined();
    });

    it('Should not block login flow when maintenance is enabled (disable_login: false)', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          disable_login: false,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      expect(postOtpToken).toBeDefined();
    });

    it('Should not block login flow when maintenance is scheduled', async () => {
      const startDate = new Date(Date.now() + 2000).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      const postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      expect(postOtpToken).toBeDefined();
    });

    it('Should not block login flow for whitelisted user when maintenance is enabled', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const postOtpToken = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      expect(postOtpToken).toBeDefined();
    });

    it('Should not block enter into game providers games for whitelisted user when maintenance is enabled', async () => {
      //TODO: need to add enterStadiumGame check for MAC
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const token = await cookieOtpTokenHelper(app.getHttpServer(), gql);

      expect(token).toBeDefined();

      const enterGameResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({ query: getEnterLiveGameQuery('gameId') });

      const payload = extractGqlResponse<string>(
        enterGameResponse,
        'enterLiveGame',
      );

      expect(payload).toBeTruthy();

      const enterLiveSlotsResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', token)
        .send({
          query: enterLiveSlotsGameMutation(String(GACLiveSlotGameId)),
        });

      expect(
        extractGqlResponse(enterLiveSlotsResponse, 'enterLiveSlotsGame'),
      ).toEqual(arpSlotResponseFinalFixture);

      const expectedGameDetails = {
        id: '265',
        name: 'test',
        assetId: '123',
        gameType: 'BACCARAT',
        iframeUrl: 'test',
      };

      for (const provider of providers) {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set('Cookie', token)
          .send({
            query: getGameByIdWithProviderQuery('265', provider),
          });

        expect(extractGqlResponse<GameV1>(response, 'getGameById')).toEqual(
          expectedGameDetails,
        );
      }
    });

    it('Should block enter into game providers games for unauthorized user when maintenance is enabled', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      for (const provider of providers) {
        const response = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: getGameByIdWithProviderQuery('265', provider),
          });

        expect(response.body.errors).toEqual([
          {
            message: `${provider} is in maintenance now`,
            code: HttpStatus.BAD_REQUEST,
            requestId,
            timestamp: response.body.errors[0].timestamp,
          },
        ]);
      }
    });

    it('Should block registration flow when maintenance is enabled (disable_login: false)', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
          disable_login: false,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const regResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: registerUserEkycMutation(
            testPINs.defaultPIN,
            testPINs.defaultPIN,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.testName,
            testDates.defaultValidDate,
          ),
        });

      expect(regResponse.body.data).toBeNull();
      expect(regResponse.body.errors[0].message).toContain(
        gatewayGACMACErrorMessages.registrationDisabled,
      );
      expect(regResponse.body.errors[0].code).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('Should not block registration flow when maintenance is scheduled', async () => {
      const startDate = new Date(Date.now() + 2000).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      const regResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Cookie', captchaCookie)
        .send({
          query: registerUserEkycMutation(
            testPINs.defaultPIN,
            testPINs.defaultPIN,
            testNames.testName,
            testNames.testName,
            testPhoneNumbers.defaultMobileCode,
            testPhoneNumbers.defaultMobileNumber,
            testNames.testName,
            testDates.defaultValidDate,
          ),
        });
      const registerUserEkyc = extractGqlResponse(
        regResponse,
        'registerUserEkyc',
      );

      expect(registerUserEkyc).toEqual(RegisterEkycUserFinalFixture);
    });

    it('Should return empty maintenance info after maintenance has ended', async () => {
      const startDate = new Date(Date.now() + 5000).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      // wait for 1s
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await request(app.getHttpServer())
        .post('/maintenance/stop')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [
            MaintenanceConstrantsEnum.LIVE_SLOTS,
            MaintenanceConstrantsEnum.LIVE_CASINO,
            MaintenanceConstrantsEnum.E_GAME,
          ],
        })
        .expect(HttpStatus.CREATED);

      // Wait for the maintenance period to end
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Fetch maintenance info after the maintenance window has ended
      const responseGetProvidersInMaintenanceInfoQuery = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .set('Cookie', postOtpToken)
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          query: getProvidersInMaintenanceInfoQuery,
        });

      // Expect no providers to be in maintenance
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.data
          .getProvidersMaintenanceInfo.providersInMaintenance,
      ).toEqual([]);
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.data
          .getProvidersMaintenanceInfo.status,
      ).toEqual(true);
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.data
          .getProvidersMaintenanceInfo.code,
      ).toEqual('200');
    });

    it('Should return providers maintenance info for unauthorized user', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      //all providers are in maintenance
      const responseGetProvidersInMaintenanceInfoQuery = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: getProvidersInMaintenanceInfoQuery,
        });

      const result = extractGqlResponse(
        responseGetProvidersInMaintenanceInfoQuery,
        'getProvidersMaintenanceInfo',
      );

      const allGameProvidersUnderMaintenanceInfoQuery = result[
        'providersInMaintenance'
      ].map((item) => item.provider);

      const areArraysEqual = isEqual(
        sortBy(allGameProvidersUnderMaintenanceInfoQuery),
        sortBy(allGameProviders),
      );

      expect(areArraysEqual).toBe(true);
    });

    it('getProvidersInMaintenanceInfoQuery with missing required fields', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      //all providers are in maintenance
      const responseGetProvidersInMaintenanceInfoQuery = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .set('Cookie', postOtpToken)
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          query: getProvidersInMaintenanceInfoQueryUnexpectedField,
        });

      expect(responseGetProvidersInMaintenanceInfoQuery.status).toEqual(
        HttpStatus.BAD_REQUEST,
      );
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.errors[0].message,
      ).toContain(gatewayErrorMessages.cantQueryField);
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.errors[0].code,
      ).toEqual(responseBodyErrorMessages.graphValidationFailed);
    });

    it('Should return an empty array when no providers are in maintenance', async () => {
      // Ensure no maintenance is scheduled
      const responseGetProvidersInMaintenanceInfoQuery = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .set('Cookie', postOtpToken)
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          query: getProvidersInMaintenanceInfoQuery,
        });

      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.data
          .getProvidersMaintenanceInfo.providersInMaintenance,
      ).toEqual([]);
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.data
          .getProvidersMaintenanceInfo.status,
      ).toEqual(true);
      expect(
        responseGetProvidersInMaintenanceInfoQuery.body.data
          .getProvidersMaintenanceInfo.code,
      ).toEqual('200');
    });

    it('Should return correct maintenance info for authorized user', async () => {
      //start maintenance
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 5000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const expectedResult = [...allGameProviders].reverse();

      //whitelist user for game providers
      for await (const gameProvider of allGameProviders) {
        const addToMACResponseAll = await request(app.getHttpServer())
          .post('/maintenance/access-control')
          .set('api-key', BACKOFFICE_API_KEY)
          .send({
            providers: [gameProvider],
            user_ids: ['300923738'], //hardcoded test username from login response
          })
          .expect(HttpStatus.CREATED);

        expect(addToMACResponseAll.body).toEqual({
          statusCode: HttpStatus.CREATED,
          message: gatewayGACMACErrorMessages.addedToMAC,
          timestamp: addToMACResponseAll.body.timestamp,
        });

        const responseGetProvidersInMaintenanceInfoQueryWithToken =
          await request(app.getHttpServer())
            .post(gql)
            .set('Cookie', postOtpToken)
            .set('api-key', BACKOFFICE_API_KEY)
            .send({
              query: getProvidersInMaintenanceInfoQuery,
            });

        const result = extractGqlResponse(
          responseGetProvidersInMaintenanceInfoQueryWithToken,
          'getProvidersMaintenanceInfo',
        );

        const providersInMaintenance = result['providersInMaintenance'].map(
          (item) => item.provider,
        );

        expectedResult.pop();

        const isResultsEqual = isEqual(
          sortBy(providersInMaintenance),
          sortBy(expectedResult),
        );

        expect(isResultsEqual).toBe(true);
      }

      const expectedRemoveResult = [];
      //remove user from whitelist
      for await (const gameProvider of allGameProviders) {
        const removeFromMACResponse = await request(app.getHttpServer())
          .delete('/maintenance/access-control')
          .set('api-key', BACKOFFICE_API_KEY)
          .send({
            providers: [gameProvider],
            user_ids: ['300923738'], //hardcoded test username from login response
          })
          .expect(HttpStatus.OK);

        expect(removeFromMACResponse.body).toEqual({
          statusCode: HttpStatus.OK,
          message: gatewayGACMACErrorMessages.updatedToMAC,
          timestamp: removeFromMACResponse.body.timestamp,
        });

        const responseGetProvidersInMaintenanceInfoQueryWithToken =
          await request(app.getHttpServer())
            .post(gql)
            .set('Cookie', postOtpToken)
            .set('api-key', BACKOFFICE_API_KEY)
            .send({
              query: getProvidersInMaintenanceInfoQuery,
            });

        const result = extractGqlResponse(
          responseGetProvidersInMaintenanceInfoQueryWithToken,
          'getProvidersMaintenanceInfo',
        );

        const providersInMaintenance = result['providersInMaintenance'].map(
          (item) => item.provider,
        );

        expectedRemoveResult.push(gameProvider);

        const isResultsEqual = isEqual(
          sortBy(providersInMaintenance),
          sortBy(expectedRemoveResult),
        );

        expect(isResultsEqual).toBe(true);
      }
    }, 10000);

    it('Should return different providers maintenance info for unauthorized user, authorized user(whitelisting will not affect unauthorized user)', async () => {
      const startDate = new Date(Date.now() + 200).toISOString();
      const endDate = new Date(Date.now() + 50000).toISOString();

      const response = await request(app.getHttpServer())
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

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const addToMACResponseAll = await request(app.getHttpServer())
        .post('/maintenance/access-control')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: allGameProviders,
          user_ids: ['300923738'], //hardcoded test username from login response
        })
        .expect(HttpStatus.CREATED);

      expect(addToMACResponseAll.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.addedToMAC,
        timestamp: addToMACResponseAll.body.timestamp,
      });

      const responseGetProvidersInMaintenanceInfoQueryWithToken = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .set('Cookie', postOtpToken)
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          query: getProvidersInMaintenanceInfoQuery,
        });

      const result = extractGqlResponse(
        responseGetProvidersInMaintenanceInfoQueryWithToken,
        'getProvidersMaintenanceInfo',
      );

      const providersInMaintenance: [] = result['providersInMaintenance'].map(
        (item) => item.provider,
      );

      expect(providersInMaintenance).toStrictEqual([]);

      //all providers are in maintenance for unauthrized user
      const responseGetProvidersInMaintenanceInfoQueryWithoutToken =
        await request(app.getHttpServer())
          .post(gql)
          .set('api-key', BACKOFFICE_API_KEY)
          .send({
            query: getProvidersInMaintenanceInfoQuery,
          });

      const resultWithoutToken = extractGqlResponse(
        responseGetProvidersInMaintenanceInfoQueryWithoutToken,
        'getProvidersMaintenanceInfo',
      );

      const allGameProvidersUnderMaintenanceInfoQueryWithoutToken =
        resultWithoutToken['providersInMaintenance'].map(
          (item) => item.provider,
        );

      const maintenanceResult = isEqual(
        sortBy(allGameProvidersUnderMaintenanceInfoQueryWithoutToken),
        sortBy(allGameProviders),
      );

      expect(maintenanceResult).toBe(true);
    });
  });

  describe('MAC and Games', () => {
    it('Should close PRAGMATIC_PLAY and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.PRAGMATIC_PLAY],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const pragmaricPlayGames = games.filter(
        (game) => game.settings.provider === 'Pragmaric Play',
      );

      expect(pragmaricPlayGames.length).toBeFalsy();
      expect(gameProviders.includes('Pragmaric Play')).toBeFalsy();
    });

    it('Should close EVOLUTION and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.EVOLUTION],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const evolutionGames = games.filter(
        (game) => game.settings.provider === 'evolution',
      );

      expect(evolutionGames.length).toBeFalsy();
      expect(gameProviders.includes('evolution')).toBeFalsy();
    });

    it('Should close NETENT and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      // const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.NETENT],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const netentGames = games.filter(
        (game) => game.settings.provider === 'netent',
      );

      expect(netentGames.length).toBeFalsy();
      expect(gameProviders.includes('netent')).toBeFalsy();
    });

    it('Should close REDTIGER and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.REDTIGER],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const redtigerGames = games.filter(
        (game) => game.settings.provider === 'redtiger',
      );

      expect(redtigerGames.length).toBeFalsy();
      expect(gameProviders.includes('redtiger')).toBeFalsy();
    });

    it('Should close NOLIMITCITY and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.NOLIMITCITY],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const nolimitcityGames = games.filter(
        (game) => game.settings.provider === 'nolimitcity',
      );

      expect(nolimitcityGames.length).toBeFalsy();
      expect(gameProviders.includes('nolimitcity')).toBeFalsy();
    });

    it('Should close EVOPLAY and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.EVOPLAY],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const evoplayGames = games.filter(
        (game) => game.settings.provider === 'evoplay',
      );

      expect(evoplayGames.length).toBeFalsy();
      expect(gameProviders.includes('evoplay')).toBeFalsy();
    });

    it('Should close KING_MIDAS and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.KING_MIDAS],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const kingMidasGames = games.filter(
        (game) => game.settings.provider === 'Kingmidas',
      );

      expect(kingMidasGames.length).toBeFalsy();
      expect(gameProviders.includes('Kingmidas')).toBeFalsy();
    });

    it('Should close CQ9 and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.CQ9],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      const CQ9Games = games.filter((game) => game.settings.provider === 'CQ9');

      expect(CQ9Games.length).toBeFalsy();
      expect(gameProviders.includes('CQ9')).toBeFalsy();
    });

    it('Should close E_GAME and should not return in getGamesByCategory(E_GAMES)', async () => {
      const startDate = new Date(Date.now() + 500).toISOString();
      const endDate = new Date(Date.now() + 10000).toISOString();

      const response = await request(app.getHttpServer())
        .post('/maintenance/start')
        .set('api-key', BACKOFFICE_API_KEY)
        .send({
          providers: [MaintenanceConstrantsEnum.E_GAME],
          disable_login: true,
          info_bar: 'info_bar',
          text: 'text',
          start_date: startDate,
          end_date: endDate,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: gatewayGACMACErrorMessages.scheduledMAC,
        timestamp: response.body.timestamp,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseGetGamesByCategoryQuery = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: getGamesByCategorywithGameProvidersQuery(
            GameCategoryEnum.E_GAME,
          ),
        });

      const { games, gameProviders } = extractGqlResponse<GetGames>(
        responseGetGamesByCategoryQuery,
        'getGamesByCategory',
      );

      expect(games.length).toBeFalsy();
      expect(gameProviders.length).toBeFalsy();
    });
  });
});
