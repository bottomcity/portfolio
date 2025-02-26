export const startSelfieEkycMutation = `
mutation StartSelfieEkyc {
    startSelfieEkyc {
        status
        code
        selfieUrl
    }
}
`;

export const partialStartSelfieEkycMutation = `
mutation StartSelfieEkyc {
    startSelfieEkyc {
        status
    }
}
`;

export const startSelfieEkycWithExtraFieldsMutation = `
mutation StartSelfieEkyc {
    startSelfieEkyc {
        status
        code
        selfieUrl
        unexpectedField
    }
}
`;
