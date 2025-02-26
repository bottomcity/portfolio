export const UpdateAccountServiceFixture = {
  status: true,
  code: 'AUT-0000',
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
    },
  },
};

export const UpdateAccountFinalFixture = {
  status: true,
  code: 'AUT-0000',
  userData: {
    username: '300923738',
    email: null,
    mobilePrefix: '63',
    mobileNumber: null,
    firstName: 'ALFA',
    middleName: null,
    lastName: 'TEST',
    dateOfBirth: '2020-02-02',
  },
};
