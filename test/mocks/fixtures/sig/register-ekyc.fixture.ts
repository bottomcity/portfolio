import * as jwt from 'jsonwebtoken';

export const RegisterEkycUserServiceFixture = {
  status: true,
  code: 'AUT-0000',
  data: {
    user: {
      user_id: null,
      username: 'OI00217493',
      tier: 'SILVER',
      email: 'test20@mail.com',
      first_name: 'ALFA',
      middle_name: null,
      last_name: 'TEST',
      date_of_birth: '2020-02-02',
      mobile_country_code: '63',
      mobile_number: '123456789',
      track_data: null,
      sms_opt_in: null,
      email_opt_in: null,
    },
    token: jwt.sign({ payload: 'Dummy payload' }, 'Dummy secret', {
      expiresIn: 72000,
    }),
  },
};

export const RegisterEkycUserFinalFixture = {
  status: true,
  code: 'AUT-0000',
  userData: {
    userId: null,
    username: 'OI00217493',
    tier: 'SILVER',
    email: 'test20@mail.com',
    mobilePrefix: '63',
    mobileNumber: '123456789',
    firstName: 'ALFA',
    middleName: null,
    lastName: 'TEST',
    dateOfBirth: '2020-02-02',
    trackData: null,
    smsOptIn: null,
    emailOptIn: null,
  },
};
