export const completeRegistrationMutation = (
  deviceId: string,
  firstName: string,
  middleName: string,
  lastName: string,
  dateOfBirth: string,
) => `
mutation CompleteRegistration {
    completeRegistration(
        input: {
            deviceId: "${deviceId}"
            firstName: "${firstName}"
            middleName: "${middleName}"
            lastName: "${lastName}"
            dateOfBirth: "${dateOfBirth}"
        }
    ) {
        status
        code
        userSession
        sessionState
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
        }
    }
}
`;
