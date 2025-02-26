export const requestWithdrawalMutation = (
  amount: number,
  bankCode: string,
  selectedBankCodeId: string,
  bankMode: string,
  bankAccountNumber: string,
  redirectUrl: string,
) => `
        mutation RequestWithdrawal{
            requestWithdrawal(
                input: {
                    amount: ${amount}
                    bankCode: "${bankCode}"
                    selectedBankCodeId: "${selectedBankCodeId}"
                    bankMode: "${bankMode}"
                    bankAccountNumber: "${bankAccountNumber}"
                    redirectUrl: "${redirectUrl}"
                }
            ){
        requestUuid
        status
        code
        message
        data {
            code
            bankRefId
            completedAt
            solaireTranId
            url
        }
  }
}`;

export const requestWithdrawalMutationPartialResponse = `
mutation RequestWithdrawal {
    requestWithdrawal(
        input: {
            amount: 1000
            bankCode: "UB"
            selectedBankCodeId: "bank_ub"
            bankMode: "ub online"
            bankAccountNumber: "1234"
            redirectUrl: "https://qa-v2.solaireaccess.net/"

        }
    ) {
        requestUuid
        data {
            code
            bankRefId
            completedAt
            solaireTranId
        }
    }
}
`;

export const requestWithdrawalMutationExtraFields = `
mutation RequestWithdrawal {
    requestWithdrawal(
        input: {
            amount: 1000
            bankCode: "UB"
            selectedBankCodeId: "bank_ub"
            bankMode: "ub online"
            bankAccountNumber: "1234"
            redirectUrl: "https://qa-v2.solaireaccess.net/"

        }
    ) {
        requestUuid
        unexpectedField
        data {
            code
            bankRefId
            completedAt
            solaireTranId
        }
    }
}
`;

export const requestWithdrawalMutationForAggregatedEmail = `
mutation RequestWithdrawal {
    requestWithdrawal(
        input: {
            amount: 400000
            bankCode: "UB"
            selectedBankCodeId: "bank_ub"
            bankMode: "ub online"
            bankAccountNumber: "1234"
            redirectUrl: "https://qa-v2.solaireaccess.net/"

        }
    ) {
        status
        code
        message    
        }
}
`;

export const requestWithdrawalMutationForMoreThan500kEmail = `
mutation RequestWithdrawal {
    requestWithdrawal(
        input: {
            amount: 500001
            bankCode: "UB"
            selectedBankCodeId: "bank_ub"
            bankMode: "ub online"
            bankAccountNumber: "1234"
            redirectUrl: "https://qa-v2.solaireaccess.net/"

        }
    ) {
        status
        code
        message    
        }
}
`;

const requestDragonPayWithdrawalData = `{
          requestUuid
          status
          code
          message
          data {
              code
              bankRefId
              completedAt
              solaireTranId
              url
          }
      }`;

export const requestDragonPayWithdrawalMutation = (
  amount: number,
  bankCode: string,
  selectedBankCodeId: string,
  bankMode: string,
  bankAccountNumber: string,
  redirectUrl: string,
  testName: string,
) => `
mutation RequestWithdrawal {
    requestWithdrawal(
        input: {
            barangay: "${testName}"
            nationality: "${testName}"
            lastName: "${testName}"
            middleName: "${testName}"
            firstName: "${testName}"
            country: "${testName}"
            zipCode: "${testName}"
            province: "${testName}"
            city: "${testName}"
            streetAddressTwo: "${testName}"
            bankAccountNumber: "${bankAccountNumber}"
            streetAddressOne: "${testName}"
            email: "test@gmail.com"
            redirectUrl: "${redirectUrl}"
            selectedBankCodeId: "${selectedBankCodeId}"
            bankCode: "${bankCode}"
            bankMode: "${bankMode}"
            amount: ${amount}
        }
    ) ${requestDragonPayWithdrawalData}
}
`;

export const requestDragonPayWithdrawalMutationWithInvalidEmail = (
  amount: number,
  bankCode: string,
  selectedBankCodeId: string,
  bankMode: string,
  bankAccountNumber: string,
  redirectUrl: string,
  testName: string,
) => `
  mutation RequestWithdrawal {
      requestWithdrawal(
          input: {
              barangay: "test"
              nationality: "test"
              lastName: "test"
              middleName: "test"
              firstName: "test"
              country: "test"
              zipCode: "test"
              province: "test"
              city: "test"
              streetAddressTwo: "test"
              bankAccountNumber: "${bankAccountNumber}"
              streetAddressOne: "test"
              email: "${testName}"
              redirectUrl: "${redirectUrl}"
              selectedBankCodeId: "${selectedBankCodeId}"
              bankCode: "${bankCode}"
              bankMode: "${bankMode}"
              amount: ${amount}
          }
      ) ${requestDragonPayWithdrawalData}
  }
  `;

export const requestDragonPayWithdrawalMutationWithInvalidNames = (
  amount: number,
  bankCode: string,
  selectedBankCodeId: string,
  bankMode: string,
  bankAccountNumber: string,
  redirectUrl: string,
  invalidName: string,
) => `
    mutation RequestWithdrawal {
        requestWithdrawal(
            input: {
                barangay: "test"
                nationality: "test"
                lastName: "${invalidName}"
                middleName: "${invalidName}"
                firstName: "${invalidName}"
                country: "test"
                zipCode: "test"
                province: "test"
                city: "test"
                streetAddressTwo: "test"
                bankAccountNumber: "${bankAccountNumber}"
                streetAddressOne: "test"
                email: "test@gmail.com"
                redirectUrl: "${redirectUrl}"
                selectedBankCodeId: "${selectedBankCodeId}"
                bankCode: "${bankCode}"
                bankMode: "${bankMode}"
                amount: ${amount}
            }
        ) ${requestDragonPayWithdrawalData}
    }
    `;

export const requestDragonPayWithdrawalMutationWithMissingFields = (
  lastName: string,
  firstName: string,
  country: string,
  zipCode: string,
  province: string,
  city: string,
  streetAddressOne: string,
) => `
      mutation RequestWithdrawal {
          requestWithdrawal(
              input: {
                  barangay: ""
                  nationality: ""
                  lastName: "${lastName}"
                  middleName: ""
                  firstName: "${firstName}"
                  country: "${country}"
                  zipCode: "${zipCode}"
                  province: "${province}"
                  city: "${city}"
                  streetAddressOne: "${streetAddressOne}"
                  streetAddressTwo: ""
                  bankAccountNumber: "48569"
                  email: "test@gmail.com"
                  redirectUrl: "https://qa-v2.solaireaccess.net/"
                  selectedBankCodeId: "bank_dragonpay"
                  bankCode: "DP"
                  bankMode: "DP"
                  amount: 10000
              }
          ) ${requestDragonPayWithdrawalData}
      }
      `;
