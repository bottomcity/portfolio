export const startJumioEkycMutation = `
mutation StartJumioEkyc {
    startJumioEkyc {
        status
        code
        ekycUrl
    }
}
`;

export const partialStartJumioEkycMutation = `
mutation StartJumioEkyc {
    startJumioEkyc {
        status
    }
}
`;

export const startJumioEkycWithExtraFieldsMutation = `
mutation StartJumioEkyc {
    startJumioEkyc {
        status
        code
        ekycUrl
        unexpectedField
    }
}
`;
