import { GetJackpots } from '@gateway/models';

export const getJackpotsFixture: GetJackpots = {
  valid: true,
  success: true,
  datetime: '01/01/2000',
  data: [
    {
      name: 'Grand',
      balance: '1,000,000.00',
      major: '527,179.03',
      minor: '3,349.37',
      mini: 'N/A',
      levelId: '1',
      gameType: 'Fortunes',
    },
    {
      name: 'Major',
      balance: '100,000.00',
      major: '117,845.35',
      minor: '55,604.38',
      mini: 'N/A',
      levelId: '2',
      gameType: 'Cash',
    },
  ],
};
