import { SigUploadDocumentEkycResponse } from '@services/rest/sig/dto';

export const uploadDocumentEkycPartBackFixture: SigUploadDocumentEkycResponse =
  {
    status: true,
    code: 'KYC-0000',
    part: 'BACK',
    message: 'Document upload successful.',
    next_action: 'FRONT',
  };

export const uploadDocumentEkycPartBackFinalFixture = {
  status: true,
  code: 'KYC-0000',
  part: 'BACK',
  message: 'Document upload successful.',
  nextAction: 'FRONT',
};
