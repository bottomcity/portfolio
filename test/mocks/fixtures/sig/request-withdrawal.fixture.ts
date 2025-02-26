export const requestWithdrawalFixture = {
  request_uuid: 'b53f0257-5af6-4971-9461-74d3561adb9f',
  status: true,
  code: 'PRV-0000',
  message: 'Status updated successfully',
  data: {
    code: 'SUCCESS',
    bankRefId: 'UB12552',
    completedAt: '2024-02-22T07:40:18.792Z',
    solaireTranId: '5571a2f3-62c1-43df-8cba-943b19fea2fb',
  },
};

export const requestWithdrawalFinalFixture = {
  requestUuid: 'b53f0257-5af6-4971-9461-74d3561adb9f',
  status: true,
  code: 'PRV-0000',
  message: 'Status updated successfully',
  data: {
    code: 'SUCCESS',
    bankRefId: 'UB12552',
    completedAt: '2024-02-22T07:40:18.792Z',
    solaireTranId: '5571a2f3-62c1-43df-8cba-943b19fea2fb',
    url: null,
  },
};

export const requestWithdrawalPaymayaFixture = {
  request_uuid: 'd26154b9-1205-4137-bf0e-5b7ceca2cfab',
  status: true,
  code: 'WIT-0000',
  message: 'Withdraw Transaction create successfully',
  data: {
    url: 'https://connect-sb-issuing.paymaya.com/authorize?response_type=code&client_id=solaire&state=1cb04610-4dad-11ef-81d3-9305817ef29e&user_id=%2B639691630266&prompt=login&redirect_uri=test',
  },
};

export const requestWithdrawalPaymayaFinalFixture = {
  requestUuid: 'd26154b9-1205-4137-bf0e-5b7ceca2cfab',
  status: true,
  code: 'WIT-0000',
  message: 'Withdraw Transaction create successfully',
  data: {
    code: null,
    bankRefId: null,
    completedAt: null,
    solaireTranId: null,
    url: 'https://connect-sb-issuing.paymaya.com/authorize?response_type=code&client_id=solaire&state=1cb04610-4dad-11ef-81d3-9305817ef29e&user_id=%2B639691630266&prompt=login&redirect_uri=test',
  },
};

export const requestWithdrawalExceedAmountFixture = {
  status: false,
  code: 'WIT-1011',
  message: 'Exceed aggregated amount daily limit',
  daily_limit: 500000,
  available_cashout: 50000,
};

export const requestWithdrawalAggregatedAmount400kFixture = {
  status: true,
  code: 'PRV-0000',
  message: 'Aggregated amount is 400k',
  daily_limit: 500000,
  available_cashout: 100000,
};

export const requestWithdrawalAggregatedAmount500kFixture = {
  status: true,
  code: 'PRV-0000',
  message: 'Aggregated amount is 500k',
  daily_limit: 500000,
  available_cashout: 0,
};

export const requestWithdrawalGreaterBalanceFixture = {
  status: false,
  code: 'WIT-1000',
  message: 'Withdrawal is not allowed with outstanding balance',
  daily_limit: 500000,
  available_cashout: 50000,
};

export const requestWithdrawalFailedFixture = {
  status: false,
  code: 'WIT-1000',
  message: 'Create payment failed',
  daily_limit: 500000,
  available_cashout: 50000,
};
