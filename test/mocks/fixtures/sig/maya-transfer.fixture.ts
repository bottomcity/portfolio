import { SigRequestMayaTransferResponse } from '@services/rest/sig/dto';

export const mayaTransferFixture: SigRequestMayaTransferResponse = {
  request_uuid: '770d75aa-8b0c-4ede-b959-0695bdad57d2',
  status: true,
  code: 'WIT-0002',
  message: 'Maya transfer successfully',
  data: {
    bankRefId: '',
    completedAt: '2024-07-01T09:52:33.263Z',
    code: 'FAILED',
    solaireTranId: '7d808380-378f-11ef-b173-3342d4bb4768',
    bankMessage: 'Invalid correlation id',
  },
};

export const mayaTransferFinalFixture = {
  requestUuid: '770d75aa-8b0c-4ede-b959-0695bdad57d2',
  status: true,
  code: 'WIT-0002',
  message: 'Maya transfer successfully',
  data: {
    bankRefId: '',
    completedAt: '2024-07-01T09:52:33.263Z',
    code: 'FAILED',
    solaireTranId: '7d808380-378f-11ef-b173-3342d4bb4768',
    bankMessage: 'Invalid correlation id',
  },
};
