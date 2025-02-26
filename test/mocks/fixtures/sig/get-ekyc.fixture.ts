import { SigGetEkycResponse } from '@services/rest/sig/dto';

export const GetEkycServiceFixture: SigGetEkycResponse = {
  status: true,
  code: 'USR-0000',
  data: {
    user: {
      user_id: 28575,
      username: 'YQ35557758',
      tier: '',
      email: null,
      mobile_country_code: '60',
      mobile_number: '103009429',
      first_name: 'PUAN',
      middle_name: '',
      last_name: 'TEST',
      date_of_birth: '1999-10-13',
      track_data: '',
      sms_opt_in: false,
      email_opt_in: false,
    },
    ekyc: {
      status: false,
      jumio_verified: true,
      remaining_day: 2,
      remaining_attempt: 3,
      remaining_hour: 71,
      selfie_status: 'NOT STARTED',
      document_status: 'NOT STARTED',
    },
  },
};

export const GetEkycFinalFixture = {
  status: true,
  code: 'USR-0000',
  getEkycData: {
    user: {
      userId: 28575,
      username: 'YQ35557758',
      tier: '',
      email: null,
      mobilePrefix: '60',
      mobileNumber: '103009429',
      firstName: 'PUAN',
      middleName: '',
      lastName: 'TEST',
      dateOfBirth: '1999-10-13',
      trackData: '',
      smsOptIn: false,
      emailOptIn: false,
    },
    ekyc: {
      status: false,
      jumioVerified: true,
      remainingDay: 2,
      remainingAttempt: 3,
      remainingHour: 71,
      selfieStatus: 'NOT STARTED',
      documentStatus: 'NOT STARTED',
    },
  },
};
