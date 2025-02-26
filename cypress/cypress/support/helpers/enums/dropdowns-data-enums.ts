export enum sortDropdown {
  asc = 'A-Z',
  desc = 'Z-A',
  newest = 'Newest first',
  topRated = 'Top rated first'
}

export enum genderDropdown {
  male = 'Male',
  female = 'Female'
}

export enum sourceOfFundsDropdown {
  employment = 'Employment',
  business = 'Business',
  investments = 'Investments',
  rentals = 'Rentals/lease',
  others = 'Others',
  trust = 'Inheritance/trust',
  sponsors = 'Financial sponsors (parents, other immediate family)',
  annuities = 'Pensions/annuities'
}

export enum natureOfWorkDropdown {
  others = 'Others',
  admin = 'Admin',
  bpo = 'BPO',
  it = 'IT',
  travel = 'Travel'
}

export enum sideBar {
  deposit = 'Deposit',
  // transfer = 'Transfer from Solaire',
  withdraw = 'Withdraw',
  balance = 'Balance history',
  profile = 'My profile',
  vacancy = 'Vacancy',
  gaming = 'Gaming history',
  support = 'Support',
  faq = 'FAQ',
  responsibleGaming = 'Responsible gaming',
  logout = 'Logout'
}

export enum jackpotsDropdown {
  jin_ji_bao_xi_vip_60m = 'Jin Ji Bao Xi Vip 60m',
  lightning_link = 'Lightning Link',
  jin_ji_bao_xi_link_50m_v2 = 'Jin Ji Bao Xi Link 50m v2',
  mighty_cash_50m = 'Mighty Cash 50m',
  duo_fu_duo_cai_minus_15m = 'Duo Fu Duo Cai Minus 15m',
  duo_fu_grand = 'Duo Fu Grand',
  good_fortunes_link_10m = 'Good Fortunes Link 10m',
  fa_fa_fa_php_1_link_b3 = 'Fa Fa Fa Php 1 Link b3',
  dragons_on_the_lake_4 = 'Dragons On The Lake 4',
  tian_ci_jin_lu = 'Tian Ci Jin Lu',
  bao_zhu_zhao_fu = 'Bao Zhu Zhao Fu'
}

export enum transactionshistoryTableFilters {
  all = 'Overview',
  deposit = 'Deposit',
  withdrawal = 'Withdrawal',
  allGames = 'All gaming',
  liveSlots = 'Live Slots',
  liveCasino = 'Live Casino',
  sportsbook = 'Sportsbook',
  eGames = 'e-Games'
}

export enum transactionshistoryTableTimeframe {
  all = 'All',
  month = 'Month',
  week = 'Week'
}
