import { SigGetStepResponse } from '@services/rest/sig/dto';

export const GetStepServiceFixture: SigGetStepResponse = {
  status: true,
  code: 'REG-0000',
  data: {
    step: 4,
    status: 4,
  },
};

export const GetStepFinalFixture = {
  status: true,
  code: 'REG-0000',
  data: {
    step: 4,
    status: 4,
  },
};
