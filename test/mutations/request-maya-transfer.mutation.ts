export const requestMayaTransferMutation = (
  correlationId: string,
  code: string,
): string => `
mutation RequestMayaTransfer {
    requestMayaTransfer(input: { correlationId: "${correlationId}", code: "${code}" }) {
        requestUuid
        status
        code
        message
        data {
            code
            bankRefId
            completedAt
            solaireTranId
            bankMessage
        }
    }
}

`;
