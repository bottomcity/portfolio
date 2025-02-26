export const requestDepositMutation = (
  amount: number,
  bankCode: string,
  selectedBankCodeId: string,
  bankMode: string,
  redirectUrl: string,
) => `
        mutation RequestDeposit {
    requestDeposit(
        input: {
            amount: ${amount}
            bankCode: "${bankCode}"
            bankMode: "${bankMode}"
            selectedBankCodeId: "${selectedBankCodeId}"
            redirectUrl: "${redirectUrl}"

        }
    ) {
        status
        code
        message
        data {
          correlationId
          transactionDate
          partnerBankUrl
        }
    }
}`;

export const requestDepositMutationPartialResponse = `
mutation RequestDeposit {
    requestDeposit(
        input: {
            amount: 1000
            bankCode: "UB"
            selectedBankCodeId: "bank_ub"
            bankMode: "ub online"
            redirectUrl: "https://qa-v2.solaireaccess.net/"
        }
    ) {
        requestUuid
        data {
          correlationId
          transactionDate
          partnerBankUrl
        }
    }
}
`;

export const requestDepositMutationExtraFields = `
mutation RequestDeposit {
    requestDeposit(
        input: {
            amount: 1000
            bankCode: "UB"
            selectedBankCodeId: "bank_ub"
            bankMode: "ub online"
            redirectUrl: "https://qa-v2.solaireaccess.net/"
        }
    ) {
        requestUuid
        unexpectedField
        data {
          correlationId
          transactionDate
          partnerBankUrl
        }
    }
}
`;
