import { SigBalanceResponse } from '@services/rest/sig/dto';

export const getPatronBalanceFixture: SigBalanceResponse = {
  status: true,
  code: 'PRV-0000',
  message: 'Balance retrieved successfully',
  data: {
    username: '300923738',
    sig_wallet: {
      CASH: 2700,
      BP: 0,
      SP: 0,
      NCCU: 0,
    },
    acsc_wallet: {
      CASH: 4998,
      BP: 100,
      SP: 0,
      NCCU: 200,
    },
  },
};

export const getPatronBalanceFinalFixture = {
  status: true,
  code: 'PRV-0000',
  message: 'Balance retrieved successfully',
  data: {
    username: '300923738',
    sigWallet: {
      CASH: 2700,
      BP: 0,
      SP: 0,
      NCCU: 0,
    },
    acscWallet: {
      CASH: 4998,
      BP: 100,
      SP: 0,
      NCCU: 200,
    },
  },
};

export const getPatronBalanceWithNegativeValuesFixture: SigBalanceResponse = {
  status: true,
  code: 'PRV-0000',
  message: 'Balance retrieved successfully',
  data: {
    username: '300923738',
    sig_wallet: {
      CASH: -2700,
      BP: -98,
      SP: -80,
      NCCU: -75,
    },
    acsc_wallet: {
      CASH: -4998,
      BP: -100,
      SP: -99,
      NCCU: -200,
    },
  },
};

export const getPatronBalanceNegativeValuesFinalFixture = {
  status: true,
  code: 'PRV-0000',
  message: 'Balance retrieved successfully',
  data: {
    username: '300923738',
    sigWallet: {
      CASH: -2700,
      BP: -98,
      SP: -80,
      NCCU: -75,
    },
    acscWallet: {
      CASH: -4998,
      BP: -100,
      SP: -99,
      NCCU: -200,
    },
  },
};

export const getPatronBalanceWithZeroValuesFixture: SigBalanceResponse = {
  status: true,
  code: 'PRV-0000',
  message: 'Balance retrieved successfully',
  data: {
    username: '300923738',
    sig_wallet: {
      CASH: 0,
      BP: 0,
      SP: 0,
      NCCU: 0,
    },
    acsc_wallet: {
      CASH: 0,
      BP: 0,
      SP: 0,
      NCCU: 0,
    },
  },
};

export const getPatronBalanceWithZeroValuesFinalFixture = {
  status: true,
  code: 'PRV-0000',
  message: 'Balance retrieved successfully',
  data: {
    username: '300923738',
    sigWallet: {
      CASH: 0,
      BP: 0,
      SP: 0,
      NCCU: 0,
    },
    acscWallet: {
      CASH: 0,
      BP: 0,
      SP: 0,
      NCCU: 0,
    },
  },
};
