import { SigSubmitDocumentEkycResponse } from '@services/rest/sig/dto';

export const submitDockumentEkycFixture: SigSubmitDocumentEkycResponse = {
  status: true,
  code: 'KYC-0000',
  message: 'Document submit successful.',
  next_action: 'PENDING',
};

export const submitDockumentEkycFinalFixture = {
  status: true,
  code: 'KYC-0000',
  message: 'Document submit successful.',
  nextAction: 'PENDING',
};
