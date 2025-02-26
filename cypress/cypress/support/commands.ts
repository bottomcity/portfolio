declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByTestId(selector: string, options?: any): Cypress.Chainable;
    shouldExist(selector: string): Cypress.Chainable;
    shouldNotExist(selector: string): Cypress.Chainable;
    getGameTitle(
      selector: string,
      indexOfHeading: number,
      options?: any
    ): Cypress.Chainable;
    getIframe(iframeSelector: string): Cypress.Chainable;
    setMaintenance(state: string, requestPayload: {}): Cypress.Chainable;
    stopMaintenance(providersList: string[]): Cypress.Chainable;
    checkLinksLocale(locale: string, locator: Chainable): Cypress.Chainable;
    getCookiesValue(cookieName: string): string;
    checkLocaleCookie(locale: string): Cypress.Chainable;
    loginAPIV2(phone: string, id: string, pin: string): Cypress.Chainable;
    authAPI(
      phone: string,
      pin: string,
      encryptedToken: string
    ): Cypress.Chainable;
    logout(): Cypress.Chainable;
    login(name: string, phone: string, locale: string): Cypress.Chainable;
  }
}

Cypress.Commands.add('getByTestId', (selector, options) => {
  cy.log(`getByTestId: ${selector}`);
  console.log('getByTestId', {
    name: 'getByTestId',
    displayName: 'getByTestId',
    message: selector,
    Selector: selector
  });

  return cy.get(`[data-testid=${selector}]`, options);
});

Cypress.Commands.add('shouldExist', (selector: string) => {
  cy.get(`[data-testid='${selector}']`, { timeout: 3000 }).should('be.exist');
});

Cypress.Commands.add('shouldNotExist', (selector: string) => {
  cy.get(`[data-testid='${selector}']`, { timeout: 3000 }).should('not.exist');
});

Cypress.Commands.add(
  'getGameTitle',
  (selector: string, indexOfHeading: number, options = {}) => {
    return cy
      .get(selector, { ...options, log: false })
      .find('h4')
      .eq(indexOfHeading)
      .invoke('text')
      .then((text) => {
        return cy.wrap(text.trim());
      });
  }
);

Cypress.Commands.add('getIframe', (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add(
  'setMaintenance',
  (
    // switcher for start/stop
    switcher: string,
    requestPayload: {}
  ) => {
    cy.request(
      'POST',
      `${Cypress.env('apiURL')}/maintenance/${switcher}`,
      requestPayload
    ).then((response) => {
      cy.log(response.body);
    });
  }
);

Cypress.Commands.add(
  'setMaintenance',
  (
    // switcher for start/stop
    switcher: string,
    requestPayload: {}
  ) => {
    cy.request(
      'POST',
      `${Cypress.env('apiURL')}/maintenance/${switcher}`,
      requestPayload
    ).then((response) => {
      cy.log(response.body);
    });
  }
);

Cypress.Commands.add('checkLinksLocale', (locale, locator) => {
  cy.log('Checking links locale');
  return locator.find('a').then(($a) => {
    cy.log(`Number of links: ${$a.length}`);
    for (let i = 0; i < $a.length; i++) {
      cy.log(`Link ${i}: ${$a[i].href}`);

      if ($a[i].href.includes('sec.solaireresort')) {
        switch (locale) {
          case 'en':
            break;
          case 'kr':
            break;
          case 'cn':
            // Waiting for fix
            // expect($a[i].href).contain("/zh-hant/");
            expect($a[i].href).not.contain('/kr');
            expect($a[i].href).not.contain('/en');
            break;
          default:
            break;
        }
      }
      switch (locale) {
        case 'en':
          expect($a[i].href).not.contain('/kr');
          expect($a[i].href).not.contain('/cn');
          break;
        case 'kr':
          expect($a[i].href).not.contain('/en');
          expect($a[i].href).not.contain('/cn');
          break;
        case 'cn':
          expect($a[i].href).not.contain('/kr');
          expect($a[i].href).not.contain('/en');
          break;
        default:
          break;
      }
    }
  });
});

Cypress.Commands.add('getCookiesValue', (cookieName) => {
  cy.getCookie(cookieName).then((cookie) => {
    // do something with the cookie
    if (cookie) {
      console.log(`${cookie.value}`);
      return cookie.value;
    } else {
      throw new Error('Cookie not found');
    }
  });
});

Cypress.Commands.add('checkLocaleCookie', (locale) => {
  cy.log('Checking locale cookie...');
  cy.getCookie('NEXT_LOCALE').then((cookie) => {
    if (cookie) {
      cy.log(`${cookie.value}`);
      expect(cookie.value).to.eq(locale);
    } else {
      throw new Error('Cookie not found');
    }
  });
});

Cypress.Commands.add('authAPI', (phoneNumber, pin) => {
  const uuid = 'ac21c388-fab5-4218-b2b3-94d0871f2aa9';
  const ip = '127.0.0.1';
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cypress/13.8.1 Chrome/118.0.5993.159 Electron/27.1.3 Safari/537.36';
  const otpCode = '824682';

  //Login mutation
  cy.intercept('GET', 'api/auth/session', () => {}).as('session');
  cy.request({
    url: `${Cypress.env('apiURL')}`,
    method: 'POST',
    body: {
      operationName: 'Login',
      query: `
        mutation Login($input: LoginInput!) {login(input: $input) {user {email __typename} __typename}} 
      `,
      variables: {
        input: {
          login: `63${phoneNumber}`,
          password: pin,
          userAgent: userAgent,
          deviceId: uuid,
          clientIp: ip
        }
      }
    },

    headers: {}
  }).then((response) => {
    if (response.status === 200) {
      cy.log(`postLoginToken: ${response.headers['set-cookie']}`);
      Cypress.env(
        'postLoginToken',
        response.headers['set-cookie'][0].split('=')[1].split(';')[0]
      );
      cy.log(`Cypress.env('postLoginToken'): ${Cypress.env('postLoginToken')}`);
      // cy.setCookie('auth_post_login', `${Cypress.env('postLoginToken')}`);

      // Generate OTP mutation
      cy.request({
        url: `${Cypress.env('apiURL')}`,
        method: 'POST',
        body: {
          query: 'mutation {generateOtp {otpId __typename}}'
        },
        headers: {}
      }).then((response) => {
        if (response.status === 200) {
          cy.log(`OTP generated: ${response.body.data.generateOtp.otpId}`);
          // Verify OTP mutation
          cy.request({
            url: `${Cypress.env('apiURL')}`,
            method: 'POST',
            body: {
              query: `mutation verifyOtp($input: VerifyOtpInput!) {verifyOtp(input: $input) {user {username __typename} userSession sessionState}}`,
              variables: {
                input: {
                  otpId: response.body.data.generateOtp.otpId,
                  otpCode: otpCode
                }
              }
            },
            headers: {}
          }).then((response) => {
            if (response.status === 200) {
              cy.log(
                `auth_post_otp: ${response.headers['set-cookie'][0].split('=')[1].split(';')[0]}`
              );
              cy.log(
                `Login successful, session: ${response.body.data.verifyOtp.userSession}`
              );
              cy.log(
                `Login successful, session state: ${response.body.data.verifyOtp.sessionState}`
              );
              cy.log(
                `User name: ${response.body.data.verifyOtp.user.username}`
              );

              // en/login POST request

              Cypress.env(
                'postOtpToken',
                response.headers['set-cookie'][0].split('=')[1].split(';')[0]
              );
              // cy.setCookie('auth_post_otp', `${Cypress.env('postOtpToken')}`);

              // aditional research needed on how to generate __Secure-authjs.session-token from Cypress
              //cy.setCookie("__Secure-authjs.session-token", token, {secure: true});
            } else {
              throw new Error(
                `OTP Verification mutation failed: ${response.body}`
              );
            }
          });
        } else {
          throw new Error(`OTP Generation mutation failed: ${response.body}`);
        }
      });
    } else {
      throw new Error(`Login mutation failed: ${response.body}`);
    }
  });
});

Cypress.Commands.add('loginAPIV2', (phoneNumber, id, pin) => {
  const uuid = 'ac21c388-fab5-4218-b2b3-94d0871f2aa9';
  const ip = '127.0.0.1';
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cypress/13.8.1 Chrome/118.0.5993.159 Electron/27.1.3 Safari/537.36';
  const otpCode = '824682';

  cy.request({
    url: `${Cypress.env('apiV2URL')}/auth/generate-csrf`,
    method: 'GET',
    headers: {
      Authorization:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWYwODhlZDUwMjUwNmVjOGE5OWU1ZTM3MjM5ZmMzZmYwYTBiN2M1MGMxMTBiMDRjZmZkN2U1Njk0MDQwNzU4NDc2N2E0N2Q1ZjAxNGU5NDEiLCJpYXQiOjE3MDQ3ODU1MjYuMjA3ODEyLCJuYmYiOjE3MDQ3ODU1MjYuMjA3ODE5LCJleHAiOjE3MzY0MDc5MjYuMTkwMDc5LCJzdWIiOiI0MTMxIiwic2NvcGVzIjpbInVzZXItZ2VuZXJhdGUtb3RwIiwidXNlci12ZXJpZnktb3RwIiwicG9zdC1sb2dpbiJdfQ.XraB17PLjQxEMP25j1mrxhn2b9UwPkF1FRA1Qw9knApVaAtgy-kcp8rl4VwpHp9cyNQXefbQA-m1yPAwmlaTJ7-gBWAzQqXSVXEXtR6wIlaswWHSpJ5k7nqvjgHIfDEdQrAZCUipg3r_2h6Zi_lPY0rwXcGV7CrAr2g7zP0Cli0jz4IHtDWjPJ-CkkJN8eFEbNP-chHOh1Yjxh9BWAoR2x6nyeWn8H0mXHlMAxXEJZVc5i3CEp84x8hYgK2SkyT1TSXNlxMKlRiez5MXbkYaHD5BG9n2Q52xG-qkzMDmQ4hYZT8qotlUSe2TpM6JUm5eqWJWWn6FpXZBtPKY79P5P9-J-esYEDifVexCFv9OCfmTGNsdfRhfUEkRD6XqGUjgU74AOnAWtYiphvbhk44Hbopx_duff-pt1mOB1sD_VshBaIclrk6Eqea42NHowwdw-jqr0MH01LCX_lGNG5XUTazKWamfT2zs8Oxvp_JblXFydiVVSdJnJ2KIHgiiM44OehY7OwY6LmWVyXuzKTf3-q0ug2kW_0NFBXucsKkn4B8SW9qpePMTGYCzHQMqKdvbGSAAv0t5D_leJEmMUZfokEmBzfHPSF_Fn8B-JtDd55z-Crvmavc3yomvhhpTiirFE0AElgl7EzWEH4FLWonhMHddROhP2ioRXtVOze2QCaE'
    }
  }).then((response) => {
    if (response.status) {
      cy.log(`Getting CSRF token ${response.body.data.token}`);
      Cypress.env('csrfToken', response.body.data.token);
      // login PIN
      cy.request({
        url: `${Cypress.env('apiV2URL')}/auth/login-pin`,
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': Cypress.env('csrfToken')
        },
        body: {
          login_identifier: `63${phoneNumber}`,
          user_agent: userAgent,
          password: pin,
          client_ip: ip,
          device_id: uuid
        }
      })
        .then((response) => {
          Cypress.env('postLoginToken', response.body.data.token);
        })
        .then((response) => {
          if (response.status === 200) {
            cy.log(
              `Login successful, session: ${response.body.data.verifyOtp.userSession}`
            );
            cy.log(
              `Login successful, session state: ${response.body.data.verifyOtp.sessionState}`
            );
          }
          // otp generate request
          cy.request({
            auth: {
              bearer: Cypress.env('postLoginToken')
            },
            url: `${Cypress.env('apiV2URL')}/otp/generate`,
            method: 'POST',
            body: {
              username: id,
              client_ip: ip,
              user_agent: userAgent,
              device_id: uuid
            }
          }).then((response) => {
            cy.log(response.body);
            if (response.status) {
              // OTP verify request
              cy.request({
                auth: {
                  bearer: Cypress.env('postLoginToken')
                },
                url: `${Cypress.env('apiV2URL')}/otp/verify`,
                method: 'POST',
                body: {
                  username: id,
                  id: response.body.data.id,
                  otp_code: otpCode,
                  client_ip: ip,
                  user_agent: userAgent,
                  device_id: uuid
                }
              }).then((response) => {
                cy.log(response.body);
                if (response.status) {
                  cy.log(
                    `OTP verification successful, postVerifyToken: ${response.body.data.token}`
                  );
                  Cypress.env('postVerifyToken', response.body.data.token);
                  // cy.log(`Cypress.env('postLoginToken'): ${Cypress.env('postLoginToken')}`);
                  cy.setCookie(
                    'auth_post_otp',
                    `${Cypress.env('postVerifyToken')}`
                  );
                } else {
                  throw new Error(
                    `OTP verification failed: ${response.body.code}`
                  );
                }
              });
            } else {
              throw new Error(`OTP generation failed: ${response.body.code}`);
            }
          });
        });
    } else {
      throw new Error(`Failed to get CSRF token: ${response.body.code}`);
    }
  });
});

Cypress.Commands.add('logout', () => {
  cy.request({
    url: `${Cypress.env('apiURL')}`,
    method: 'POST',
    body: {
      operationName: 'logout',
      query: `mutation logout($input: LogoutInput!) {logout(input: $input)}`,
      variables: {
        input: {
          sessionOverride: false
        }
      }
    },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('login', (name, phone, locale) => {
  const { loginPageHelper } = require('./helpers/pages-helpers/login-helper');
  cy.log('Current locale in login: ' + locale);
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  return cy.session([name, phone], () => {
    cy.intercept('POST', '/login').as('login');
    cy.window().then((window) => {
      window.localStorage.setItem('privacypolicyagree', '1');
      window.sessionStorage.setItem('ineligibilityNotice', '1');
    });
    cy.visit(`/login`, { failOnStatusCode: false });
    loginPageHelper.loginWithValidPhone(phone); //  edit-warning-pop-up

    cy.wait('@login', { timeout: 30000 });
  });
});
