export const getEkycQuery = `query GetEkyc {
    getEkyc {
        status
        code
        getEkycData {
            user {
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
            ekyc {
                documentStatus
                remainingHour
                selfieStatus
                status
                jumioVerified
                remainingDay
                remainingAttempt
            }
        }
    }
}

`;
