import { testIPs } from '@test/enums/data-for-inputs-enums';

const registerEkycUserData = `
status
        code
        userData {
            userId
            username
            tier
            email
            mobilePrefix
            mobileNumber
            firstName
            middleName
            lastName
            dateOfBirth
            trackData
            smsOptIn
            emailOptIn
        }`;

const registerEkycUserDataUnexpectedField = `
status
code
userData {
    userId
    username
    tier
    email
    mobilePrefix
    mobileNumber
    firstName
    middleName
    lastName
    dateOfBirth
    trackData
    smsOptIn
    emailOptIn
    unexpectedField
}
`;

const registerEkycUserConstInputData = `
clientIp:"188.130.156.249"
userAgent: "Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1"
deviceId: "5022d5d1"
`;

export const registerUserEkycMutation = (
  password: string,
  passwordConfirmation: string,
  lastName: string,
  firstName: string,
  mobileCountryCode: string,
  mobileNumber: string,
  deviceId: string,
  dateOfBirth: string,
) => `
        mutation RegisterUserEkyc {
    registerUserEkyc(
        input: {
                    lastName: "${lastName}"
                    firstName: "${firstName}"
                    password: "${password}"
                    passwordConfirmation: "${passwordConfirmation}"
                    mobileCountryCode: "${mobileCountryCode}"
                    mobileNumber: "${mobileNumber}"
                    dateOfBirth: "${dateOfBirth}"
                    clientIp: "${testIPs.validIP}"
                    deviceId: "${deviceId}"
                    optIn: true
                },
            ){
       ${registerEkycUserData}
    }
  }
`;

export const registerEkycMutationWithInvalidEmail = `
mutation RegisterUserEkyc {
    registerUserEkyc(
        input: {
            email: "test20@mail"
            dateOfBirth: "2020-02-02"
            password: "1567"
            passwordConfirmation: "1567"
            mobileNumber: "123456789"
            firstName: "ALFA"
            lastName: "TEST"
            mobileCountryCode: "63"  
            optIn: true
            ${registerEkycUserDataUnexpectedField}
        },
    ) {
        ${registerEkycUserData}
    }
}
`;

export const registerEkycMutationWithEmptyEmail = `
mutation RegisterUserEkyc {
    registerUserEkyc(
        input: {
            email: ""
            dateOfBirth: "2020-02-02"
            password: "1567"
            passwordConfirmation: "1567"
            mobileNumber: "123456789"
            firstName: "ALFA"
            lastName: "TEST"
            mobileCountryCode: "63"
            optIn: true
            ${registerEkycUserDataUnexpectedField}
        },
    ) {
        ${registerEkycUserData}
    }
}
`;

export const registerEkycMutationWithUnexpectedField = `
mutation RegisterUserEkyc {
    registerUserEkyc(
        input: {
            dateOfBirth: "2020-02-02"
            password: "1567"
            passwordConfirmation: "1567"
            mobileNumber: "123456789"
            firstName: "ALFA"
            lastName: "TEST"
            mobileCountryCode: "63"
            optIn: true
            ${registerEkycUserConstInputData}
        },
    ) {
        ${registerEkycUserDataUnexpectedField}
    }
}
`;

export const registerUserEkycMutationInvalidIP = (
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  mobileCountryCode: string,
  mobileNumber: string,
  deviceId: string,
  password: string,
  passwordConfirmation: string,
) => `
            mutation RegisterUserEkyc {
    registerUserEkyc(
        input: {
                        lastName: "${lastName}"
                        firstName: "${firstName}"
                        password: "${password}"
                        passwordConfirmation: "${passwordConfirmation}"
                        mobileCountryCode: "${mobileCountryCode}"
                        mobileNumber: "${mobileNumber}"
                        dateOfBirth: "${dateOfBirth}"
                        clientIp: "${testIPs.invalidIP}"
                        deviceId: "${deviceId}"
                        optIn: true
                    },
                ){
           ${registerEkycUserData}
        }
      }
    `;
