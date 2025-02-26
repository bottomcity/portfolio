export const uploadDocumentEkycMutation = `
mutation uploadDocumentEkyc($somefile: Upload!) {
    uploadDocumentEkyc(input: { part: BACK }, file: $somefile) {
        status
        code
        message
        part
        nextAction
    }
}
`;

export const partialUploadDocumentEkycMutation = `
mutation uploadDocumentEkyc($somefile: Upload!) {
  uploadDocumentEkyc(input: { part: BACK }, file: $somefile) {
    status
  }
}
`;

export const uploadDocumentEkycMutationWithoutFile = `
mutation uploadDocumentEkyc($somefile: Upload!) {
    uploadDocumentEkyc(input: { part: BACK }, file: "") {
        status
        code
        message
        part
        nextAction
    }
}
`;

export const uploadDocumentEkycWithExtraFieldsMutation = `
mutation uploadDocumentEkyc($somefile: Upload!) {
  uploadDocumentEkyc(input: { part: BACK }, file: $somefile) {
    status
    code
    message
    part
    nextAction
    unexpectedField
  }
}
`;

export const invalidPartUploadDocumentEkycMutation = `
mutation uploadDocumentEkyc($somefile: Upload!) {
  uploadDocumentEkyc(input: { part: INVALID_PART }, file: $somefile) {
    status
    code
    message
    part
    nextAction
  }
}
`;

export const missingFieldUploadDocumentEkycMutation = `
mutation uploadDocumentEkyc($somefile: Upload!) {
  uploadDocumentEkyc(input: {}) {
    status
    code
    message
    part
    nextAction
  }
}
`;
