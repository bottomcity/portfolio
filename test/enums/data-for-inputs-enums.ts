export enum testUsernames {
  defaultUsername = '321321312', //default username in tests
  invalidUsername = '321321332132131232132131232132131', //invalid username in tests
}

export enum testPhoneNumbers {
  defaultMobileCode = '63', //default mobile code in tests
  defaultMobileNumber = '0321312312', //default mobile number in tests
  invalidShortNumber = '3213213', //invalid short mobile number in tests
  invalidLongNumber = '321321332132131232132131232132131', //invalid long mobile number in tests
  invalidLongCode = '633434', //invalid long mobile code in tests
  invalidLongBankAccountNumber = '3213213321321312321321312321321312131232132131', //invalid long bank account number in tests
}

export enum testPINs {
  testPIN = '5678',
  defaultPIN = '8765',
  defaultSimplePIN = '1234',
  invalidShortPIN = '098', // invalid short PIN
  invalidLongPIN = '34567', // invalid long PIN
}

export enum testNames {
  testName = 'TEST', // default name in tests
  firefox = 'Firefox', // default userAgent in tests
  defaultDeviceId = 'Desktop', // default deviceId in tests
  invalidLong129Name = 'SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnam', //invalid name in tests
}

export enum testDates {
  defaultValidDate = '2002-02-02', // default valid date in tests
  invalidDate = '20-02-2002', // invalid date in tests
}

export enum testIPs {
  validIP = '188.130.156.249',
  invalidIP = '188.130.156', // invalid IP in tests
}

export enum amountMoney {
  validAmount = 2500.25,
  invalidBottomLevel = 999.99,
  invalidTopLevel = 500000.01,
  invalid550Level = 550000.01,
  validAmountGreaterBalance = 2900,
  exceedPaymayaLevel = 50000.01,
  amount400k = 400000,
  validTopLevel = 500000,
  amount399k = 399999.99,
  amount10k = 10000,
}

export enum bankCode {
  invalidLongBankCode = 'SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongname',
  UB = 'UB',
  DevelopmentBankPhilippines = 'bank_dbp',
  PhilippineNationalBank = 'bank_pnb',
  Metrobank = 'bank_metrobank',
  BDO = 'BDO',
  MY = 'MY',
  DP = 'DP',
}

export enum selectedBankCodeId {
  UnionBank = 'bank_ub',
  DevelopmentBankPhilippines = 'bank_dbp',
  PhilippineNationalBank = 'bank_pnb',
  Metrobank = 'bank_metrobank',
  BDOUnibank = 'bank_bdo',
  BankPaymaya = 'bank_paymaya',
  DragonPay = 'bank_dragonpay',
  DragonPayGcash = 'dragonpay_gcsh',
}

export enum bankMode {
  invalidLongBankMode = 'SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongname',
  ubOnline = 'ub online',
  wechatpay = 'wechatpay',
  instapay = 'instapay',
  grabpay = 'grabpay',
  bdo = 'bdo online',
  paymaya = 'paymaya',
  DP = 'DP',
}

export enum redirectUrl {
  validRedirectUrl = 'https://qa-v2.solaireaccess.net/',
  invalidLongRedirectUrl = 'http://www.returnurl.com/SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnam/SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSupreSuprelongnameSupre',
}

export enum mayaTransfer {
  correlationId = 'correlationId',
  code = 'code',
}
