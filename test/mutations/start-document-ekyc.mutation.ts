export const startDocumentEkycMutation = `
mutation startDocumentEkyc {
    startDocumentEkyc {
        status
        code
        message
    }
}
`;

export const partialDocumentEkycMutation = `
mutation startDocumentEkyc {
    startDocumentEkyc {
        status
    }
}
`;

export const startDocumentEkycWithExtraFieldsMutation = `
mutation startDocumentEkyc {
    startDocumentEkyc {
        status
        code
        message
        unexpectedField
    }
}
`;
