import { Response } from 'supertest';

export const extractGqlResponse = <T>(
  response: Response,
  queryName: string,
): T => response.body['data'][queryName];
