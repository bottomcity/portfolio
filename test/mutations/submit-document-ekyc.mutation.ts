export const submitDocumentEkycMutation = `
mutation submitDocumentEkyc {
    submitDocumentEkyc {
        status
        code
        message
        nextAction
    }
}
`;

export const partialSubmitDocumentEkycMutation = `
mutation submitDocumentEkyc {
    submitDocumentEkyc {
        status
    }
}
`;

export const submitDocumentEkycWithExtraFieldsMutation = `
mutation submitDocumentEkyc {
    submitDocumentEkyc {
        status
        code
        message
        nextAction
        unexpectedField
    }
}
`;
