import { SigGetExclusionResponse } from '@services/rest/sig/dto';

export const GetUsernameServiceFixture: SigGetExclusionResponse = {
  status: true,
  code: 'USR-0000',
  data: {
    exclusion_code: '01',
    allow: ['login'],
    restrict: ['withdrawal'],
  },
};

export const GetUsernameFinalFixture = {
  status: true,
  code: 'USR-0000',
  exclusionData: {
    exclusionCode: '01',
    allow: ['login'],
    restrict: ['withdrawal'],
  },
};
