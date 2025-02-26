import { CAPTCHA_JWT_SECRET } from '@config';

import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  [key: string]: any;
  exp?: number;
}

const secret = CAPTCHA_JWT_SECRET;

export function changeJwtExpiry(token: string, newExp: number): string {
  const decoded = jwt.decode(token) as JwtPayload;

  if (!decoded) {
    throw new Error('Invalid token');
  }

  decoded.exp = newExp;

  const newToken = jwt.sign(decoded, secret);

  return newToken;
}
