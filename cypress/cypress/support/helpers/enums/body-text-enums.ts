import { submitBtn } from './btn-names-enums';

export enum errorPageBodyText {
  p404 = 'The page you were looking for does not exist.',
  p500 = 'The server has an issue that prevents the requested page from loading.',
  maintenanceLobby = 'Please check back soon.',
  maintenanceGeneral = 'Unfortunately, you cannot log in or create an account at this time, but demo mode for games is still available.',
  maintenanceCategoryTitle = 'Category down for maintenance',
  maintenanceCategorySubtitle = 'Please check back soon.',
  maintenanceLogin = 'Unfortunately, you cannot log in, reset pin or create an account at this time, but demo mode for games is still available.'
}

export enum errorPageBodyTitle {
  p404 = 'Nothing here!',
  p500 = 'Internal Server Error',
  maintenanceLobby = 'Sorry! We are down for maintenance.',
  maintenanceGeneral = 'We are currently updating our site'
}

export const regLoginFlowsBodyText = {
  otpBody: submitBtn.sendOTP.slice(-3),
  registerSuccessBody: submitBtn.register.toLowerCase(),
  updateSuccessBody: submitBtn.update.toLowerCase()
};

export enum gamesTableText {
  closed = 'BETS ARE CLOSED',
  open = 'BETS ARE OPEN',
  sicbo = 'SicBo',
  baccarat = 'Baccarat',
  roulette = 'Roulette',
  stadium = 'Stadium',
  jackpot = 'Jackpot',
  available = 'Available',
  hardwareError = 'Hardware error',
  occupied = 'Occupied',
  awaiting = 'Awaiting status',
  noMoreGamesSearchResult = 'No more games',
  nothingFound = 'Nothing found'
}

export enum inputsPlaceholders {
  dropdown = 'Select',
  enter = 'Enter',
  password = 'password',
  PIN = 'PIN',
  mobile = 'Enter mobile number',
  OTP = 'OTP',
  star = '*** ***',
  input = 'Type',
  search = 'search',
  filter = 'Filter'
}

export enum eGamesBodyTitle {
  recentWinsSection = 'Recent Wins',
  newGamesSection = 'New Games',
  ancientCivilizationsSection = 'Ancient Civilizations',
  tableSection = 'Table',
  megawaysSection = 'Megaways',
  classicStyleSection = 'Classic Style',
  topGamesSection = 'Top Games',
  allGamesSection = 'All Games',
  evolution = 'Evolution',
  netent = 'Netent',
  redtiger = 'Redtiger',
  evoplay = 'Evoplay',
  noLimitCity = 'No Limit City'
}

export enum sectionSEOText {
  mainLanding = 'Get ready to embark on a journey',
  slots = 'Experience the thrill of Solaire, anytime, anywhere! Solaire Online offers the finest gaming excitement right at your fingertips. Redefining online casino gaming in the Philippines, Solaire brings all your beloved casino games into the comfort of your home or wherever you are on the move.',
  casino = 'Experience the thrill of Solaire, anytime, anywhere!',
  eGames = 'Experience the ultimate thrill ',
  general = 'Fortune Favors The Game'
}

export enum profileBodyText {
  failed = 'failed',
  created = 'created',
  warning = 'Make sure the information is correct!'
}

export enum gameTitles {
  shadowOfLuxor = 'Shadow Of Luxor',
  bonanza = 'Bonanza Wheel',
  faceUp = 'FaceUp',
  faFa = 'Fa Fa Babies'
}
