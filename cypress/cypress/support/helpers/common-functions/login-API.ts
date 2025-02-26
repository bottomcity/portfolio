import { JWTPayload } from 'jose';
import { encode } from '../../../../node_modules/next-auth/jwt.js';

export async function getSessionToken(UserName: string) {
  const user: JWTPayload = { username: UserName };
  cy.wrap(null).then(() => {
    return encode({
      token: user,
      secret: Cypress.env('NEXTAUTH_JWT_SECRET'),
      //salt: 'authjs.session-token'
      salt: '__Secure-authjs.session-token'
    });
  });
}

//   module.exports = { getSessionToken };
