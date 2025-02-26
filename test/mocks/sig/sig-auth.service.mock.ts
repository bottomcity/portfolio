import { SigAuthService } from '@services/rest/sig/services/sig-auth.service';

import { sign } from 'jsonwebtoken';

import {
  defaultLoginFixture,
  RegisterEkycUserServiceFixture,
  resumeUserLoginSessionFixture,
  UpdateAccountServiceFixture,
} from '../fixtures/sig';
import { resumeLoginDragonPayFixture } from '../fixtures/sig/resume-login-dragonpay.fixture';
import { MockedServiceType } from '../mocked-service.type';

export const sigAuthServiceMock: MockedServiceType<SigAuthService> = {
  login: jest.fn().mockResolvedValue(defaultLoginFixture),
  logout: jest.fn().mockResolvedValue({
    status: true,
    code: 'AUT-0000',
    message: 'Logout Success',
  }),
  checkAccount: jest.fn().mockResolvedValue({
    status: true,
    code: 'AUT-0000',
    message:
      'Account type will always be 1, since register create account type 1 for this phase.',
    data: {
      account_type: 1,
      user: {
        username: '300923738',
        email: null,
        mobile_country_code: '63',
        mobile_number: '123456789',
        first_name: 'ALFA',
        middle_name: null,
        last_name: 'TEST',
        date_of_birth: '2020-02-02',
      },
      token: sign({ payload: 'Dummy payload' }, 'Dummy secret', {
        expiresIn: 72000,
      }),
    },
  }),
  refreshUserSession: jest.fn(),
  getUserSessionState: jest.fn(),
  updateAccount: jest.fn().mockResolvedValue(UpdateAccountServiceFixture),
  updateLoginPin: jest.fn().mockResolvedValue({ status: 'ok' }),
  rejectOverwriteUserSession: jest.fn().mockResolvedValue({
    status: true,
    code: 'USR -0000',
    message: 'Reject overwrite Success',
  }),
  resumeUserLoginSession: jest
    .fn()
    .mockResolvedValue(resumeUserLoginSessionFixture),
  forgotLoginPin: jest.fn().mockResolvedValue({
    status: true,
    code: 'AUT-0002',
    data: {
      username: 'GX92613818',
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGY0ZDRjNjRjZDc3ZWNhNzRkMmJkOGQ1ZjhiM2Q5ZDcwZmRhN2RmN2U5ZDg2N2VmMzIxNWZmMGZmY2JiOWJmYjZkMTczMGYzNjcxNWMwZjkiLCJpYXQiOjE3MDY0OTc4NjguODE2NTgxLCJuYmYiOjE3MDY0OTc4NjguODE2NTg0LCJleHAiOjE3MzgxMjAyNjguODEwOTEzLCJzdWIiOiI0MTA3Iiwic2NvcGVzIjpbInVzZXItZ2VuZXJhdGUtb3RwIiwidXNlci12ZXJpZnktb3RwIl19.SXvbDkfP7FhVOMmXxByeH5s1tBu37KNMeQK5XMSiRarLgAIbdN5QUeplVGt5Nuc4pqeh3T88ts3qj5SrRtnnqFizCVh5hYS7Xj-le7HDHR_AHn6W2s2dTNRgA1APmt_yJ9lAtycuLaC2da1l_CSr7n_UzsSFNNXEoyxz3py79g2cVCVMKAggY1aT5yQA2H8CoLtNQ2ADn6839caokkRS-iLTZmWVy7fVDHj84zzQVDmG5SAUsGFH3T2X1Lr_wveSEHyXf4-ELvSvOM3zAXUiLb0glDADzX_Qd-l9LkSKnasTWxXCo8rzUS255Dv_o1E3vDI8xL8f0PmNanxXv61UeSlChoO2xrFve4RjwaDv0XHHYrTII7KfnLFQ8oAhGkhNDNyVDIGzpnZzocaI1Dqsh8-SmYWQR79wdFTCk8EKGSfqacbTdAjwFjlv_PBppq4LryF00WFFD2lL936VrV12p0jU1zRhRcurrnGcUlYyPZRQ-c-ghcSeSH7vrywNqjGCm-CnHqk-Pvj0BxUO9Ik4mWDw_M80mBvqWtnV6nVrp3r3QXIiNybEvUvdZZF6cUP2sE0ZLmm88n4VDHapN3dBYIC7hEPAF2aLiprIuK_GABRMz4shl-xCfU9Io49tDqJsLzVQ5Dn3WY8MOZW06LzilJiHUoDl-YoGyddaNW4ASJY',
    },
  }),
  resetLoginPin: jest.fn().mockResolvedValue({ status: 'ok' }),
  registerEkyc: jest.fn().mockResolvedValue(RegisterEkycUserServiceFixture),
  resumeLoginDragonpay: jest
    .fn()
    .mockResolvedValue(resumeLoginDragonPayFixture),
};
