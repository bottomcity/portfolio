import { Response } from 'supertest';

export const extractGqlErrors = (response: Response) => response.body['errors'];
