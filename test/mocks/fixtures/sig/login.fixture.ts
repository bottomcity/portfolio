import { sign } from 'jsonwebtoken';

export const defaultLoginFixture = {
  status: true,
  data: {
    user: {
      username: '300923738',
      email: null,
      mobile_country_code: '63',
      mobile_number: null,
      first_name: 'ALFA',
      middle_name: null,
      last_name: 'TEST',
      date_of_birth: '2020-02-02',
      tier: 'SILVER',
      track_data: 'SATEST      30092373831900',
    },
    token: sign({ payload: 'Dummy payload' }, 'Dummy secret', {
      expiresIn: 72000,
    }),
    outstandingBalance: false,
  },
};

export const loginResponseWithUsernameForNewRegistrationFixture = {
  status: true,
  data: {
    user: {
      username: '300939632',
      email: null,
      mobile_country_code: '63',
      mobile_number: null,
      first_name: 'ALFA',
      middle_name: null,
      last_name: 'TEST',
      date_of_birth: '2020-02-02',
      tier: 'SILVER',
      track_data: 'SATEST      30092373831900',
    },
    token: sign({ payload: 'Dummy payload' }, 'Dummy secret', {
      expiresIn: 72000,
    }),
    outstandingBalance: false,
  },
};
