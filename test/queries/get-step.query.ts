export const getStepQuery = `query GetStep {
    getStep {
        status
        code
        data {
            step
            status
        }
    }
}
`;
