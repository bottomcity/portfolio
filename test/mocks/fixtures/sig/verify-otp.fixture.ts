import { SigVerifyOtpResponse } from '@services/rest/sig/dto';

export const verifyOtpTokenFixture =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTQyNmFiYzQ4OTU0ZjkyYzNiMDQwMzgyN2M5N2FlZjllZDIxMGQ1NWMxZDYyODE4NjZkODc3MDMxMDgzNGY3NDk1ZDBjYzMyYzkxYzUzZjQiLCJpYXQiOjE3MDY0OTkxMDkuMzQzMzE1LCJuYmYiOjE3MDY0OTkxMDkuMzQzMzE4LCJleHAiOjE3MzgxMjE1MDkuMzM2MzIzLCJzdWIiOiI0MTA3Iiwic2NvcGVzIjpbInVzZXItZ2VuZXJhdGUtb3RwIiwidXNlci12ZXJpZnktb3RwIiwicG9zdC1sb2dpbiJdfQ.DU6hEfbv3txtpVQ8vTTlOCw023WbkJbCLFq75E77WyuHUXsP5QpjRMvhkG-tMtAFr_LTGFuTqWq41Em5WOTx2QfaEM0fdyuJOjPPvX8qakOthKETjxX_4POaOkFk7lz6_QNmk1r5q3bWj3ElBmlzBMCsSBbeOHwnAZq6yeNJs9E8MJOshGs5BlCDCYkJuM6KlDzRl61WtPUk2ZwABTF0V7JeX2M4cXUDUo0r9gQ4hYgBHNNFGsYnKJsIxUiL1q_qYnuVDfmPc_fFyjSnL_qnT8LU1WFBagRGJ6Lrx30t7xHC7F-i-J5Wuq6PPakWeCTAsziCGRBiTNnTdbVFqf4ujocZwfOiifYGMpf7dEeUBBT0tbw0vKQzN1bwO_kxN6a81oO9JCnnTYJEuxNXaQm7dzzb5lt9PvLEuXXTxPvJGlZ5EKLGqqXJ2Ipwqq_AMX9nzTWTiocwjA_ZsnScnWkdYnbTIRqjpuc3AvoPhhD3Sym936KgbQMm263lufKL3gZODYiwbk8YJYQ9Zcb7yHwjygWKpaeFX4A1Qe5aAWP5LvdhXGB7C_Uy-x0zkd4I_COh3t9yfpASgZJH9zvT12LKbivgr1dDmDj9caMG2DsWRNv9WTvksE6xfuXk3Ccd4Dxp6i_GOIddtj-bPBe_mBayzoS1Cwxa-a9K5JI9xISo9kg';

export const verifyOtpFixture: SigVerifyOtpResponse = {
  status: true,
  code: 'AUT-0000',
  message:
    'Account type will always be 1, since register create account type 1 for this phase.',
  data: {
    user: {
      user_id: 16066,
      username: '300923738',
      tier: 'SILVER',
      email: null,
      mobile_country_code: '63',
      mobile_number: '123456789',
      first_name: 'ALFA',
      middle_name: null,
      last_name: 'TEST',
      date_of_birth: '2020-02-02',
      track_data: 'SAALE30093431081900',
    },
    user_session: 'test',
    session_state: 1,
    opmg: {
      acc: 1,
      key: 'OPMG_KEY',
    },
    token: verifyOtpTokenFixture,
  },
};

export const verifyOtpFixtureWithTemporalUsername: SigVerifyOtpResponse = {
  status: true,
  code: 'AUT-0000',
  message:
    'Account type will always be 1, since register create account type 1 for this phase.',
  data: {
    user: {
      user_id: 16066,
      username: 'OI00217493',
      tier: 'SILVER',
      email: null,
      mobile_country_code: '63',
      mobile_number: '123456789',
      first_name: 'ALFA',
      middle_name: null,
      last_name: 'TEST',
      date_of_birth: '2020-02-02',
      track_data: 'SAALE30093431081900',
    },
    user_session: 'test',
    session_state: 1,
    opmg: {
      acc: 1,
      key: 'OPMG_KEY',
    },
    token: verifyOtpTokenFixture,
  },
};
