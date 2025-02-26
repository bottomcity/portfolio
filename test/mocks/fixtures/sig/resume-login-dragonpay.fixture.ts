export const resumeLoginDragonPayTokenFixture =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNWQ4MzY0NTI3MWIxMmE0MTczZjY5MzIyMmE1ZTc0NmI2NTlkMTg4NTU1NGE0NmNhM2U1N2NmODMxMmExN2ZhMTMzNjg0YTZkYjk3NWUzNjkiLCJpYXQiOjE3MTQ5ODYwNDguODM2MDExLCJuYmYiOjE3MTQ5ODYwNDguODM2MDEzLCJleHAiOjE3NDY1MjIwNDguODMxNjU4LCJzdWIiOiIyNjgiLCJzY29wZXMiOlsicG9zdC1sb2dpbiJdfQ.IGfFkHcxdAsgCQy6NY7BUM6viEE_AmSYYuJnmaKqY9xG0v4pxygbxDY_SNGlE26I3k3UW0JejAPHDiMTlL0s_0vofCkWGI65i6mlD4irGl_ab5eVP_sRKMHM80mhiKkHXyqyaTcZ0wDP-nHbhByv8o_cb1k0YN767uoLPv4OEFPhV-Cbsxx3gvrkLnjhvMwGYwxTbQazAlTXsBQST6Vdhxdb4vEYnzzcYXmTylDlMRaG0L60Fo_1mQ9pnEtmpQEze7rTQMxUoHto7x3LTHeSSManexJwN64R5a7WmVT4IFIjccDqSmb0umMXHhoVI3q1hoyT4N_Kqrgy_vc6Wh-iwaKUXZvbKlf5Y_rqWgm6pExrl4ylAIrWvfj5KIkJtlqFdxrotd_tTXkS0uJT22BmCkwlQzD9g9GGFGomHTKXughBG7P-LsND6LGgUS7PyhQ9Y5MiKY_qH08V-6mpUbGxaW0KdGT-7TH9d1TFfHFuABbjMVu7fOd_npw3c_PtAghFt3s2HGlEWRWYn0JaRMD6YKmdpdLMyE-eZzHH8dTb6MdKT2MLIMylSeik7UX5pXumGixmqJca9AMKBUkeGZgYzoIgEkCZ4xQtRwzxCs0NT_eOzW7I8DyKC52NCqmij5NIGxXGj8OtRnboWDYfNcWxEF5Gvtj60ffennH3c1SU7-I';

export const resumeLoginDragonPayFixture = {
  status: true,
  code: 'AUT-0001',
  message: 'Resume User Login Session success',
  data: {
    user: {
      username: '300983439',
      email: 'carparktest@gmail.com',
      mobile_country_code: '63',
      mobile_number: null,
      first_name: 'SILVER',
      middle_name: null,
      last_name: 'TEST',
      date_of_birth: '1987-08-10',
      track_data: 'SASILVER    30098343951901',
    },
    token: resumeLoginDragonPayTokenFixture,
  },
};

export const resumeLoginDragonPayFinalFixture = {
  status: true,
  code: 'AUT-0001',
  userData: {
    userId: null,
    username: '300983439',
    tier: null,
    email: 'carparktest@gmail.com',
    mobilePrefix: '63',
    mobileNumber: null,
    firstName: 'SILVER',
    middleName: null,
    lastName: 'TEST',
    dateOfBirth: '1987-08-10',
    trackData: 'SASILVER    30098343951901',
  },
};
