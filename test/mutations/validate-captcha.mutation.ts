export const ValidateCaptureMutation = `
mutation ValidateCapture {
    validateCapture(input: { turnstile: "test" }) {
        success
		errorCodes
        hostname
        challengeTs
    }
}
`;

export const FailedCaptureMutation = `
mutation ValidateCapture {
    validateCapture(input: { turnstile: "faile" }) {
        success
		errorCodes
        hostname
        challengeTs
    }
}
`;
