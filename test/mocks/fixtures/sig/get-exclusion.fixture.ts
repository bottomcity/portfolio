import { SigGetExclusionResponse } from '@services/rest/sig/dto';

export const GetExclusionServiceFixture: SigGetExclusionResponse = {
  status: true,
  code: 'USR-0000',
  data: {
    exclusion_code: '01',
    allow: ['login'],
    restrict: ['withdrawal'],
  },
};

export const GetExclusionFinalFixture = {
  status: true,
  code: 'USR-0000',
  exclusionData: {
    exclusionCode: '01',
    allow: ['login'],
    restrict: ['withdrawal'],
  },
};
