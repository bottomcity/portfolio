const updateAccountData = `
status
code
userData {
    username
    email
    mobilePrefix
    mobileNumber
    firstName
    middleName
    lastName
    dateOfBirth
}
`;

const updateAccountInput = `
firstName: "test"
lastName: "test"
`;

export const updateAccountMutation = `
mutation UpdateAccount {
    updateAccount(
        input: {
            ${updateAccountInput}
            password: "1234"
            passwordConfirmation: "1234"
        }
    ) {
        ${updateAccountData}
    }
}
`;

export const updateAccountMutationWitInvalidEmail = `
mutation UpdateAccount {
    updateAccount(
        input: {
            ${updateAccountInput}
            email: "test@m"
            password: "1234"
            passwordConfirmation: "1234"
        }
    ) {
        ${updateAccountData}
    }
}
`;

export const updateAccountMutationWitInvalidPassword = `
mutation UpdateAccount {
    updateAccount(
        input: {
            ${updateAccountInput}
            email: "test@m"
            password: "12344"
            passwordConfirmation: "12344"
        }
    ) {
        ${updateAccountData}
    }
}
`;

export const updateAccountMutationWitInvalidPasswordConfirmation = `
mutation UpdateAccount {
    updateAccount(
        input: {
            ${updateAccountInput}
            email: "test@m"
            password: "1234"
            passwordConfirmation: "123444"
        }
    ) {
        ${updateAccountData}
    }
}
`;

export const updateAccountMutationWitInvalidWithMismatchedPasswords = `
mutation UpdateAccount {
    updateAccount(
        input: {
            ${updateAccountInput}
            password: "1233"
            passwordConfirmation: "1234"
        }
    ) {
        ${updateAccountData}
    }
}
`;

export const updateAccountMutationWitInvalidMobileNumber = `
mutation UpdateAccount {
    updateAccount(
        input: {
            ${updateAccountInput}
            password: "1234"
            passwordConfirmation: "1234"
            mobileNumber: "1234"
        }
    ) {
        ${updateAccountData}
    }
}
`;
