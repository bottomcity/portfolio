export const resumeUserSessionMutation = `
mutation ResumeUserSession {
    resumeUserSession(input: { nonce: "test=", t: "test==" }) {
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
        }
    }
}
`;
export const resumeUserSessionWithoutNonceMutation = `
mutation ResumeUserSession {
    resumeUserSession(input: { t: "test==" }) {
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
        }
    }
}

`;

export const resumeUserSessionWithoutTMutation = `
mutation ResumeUserSession {
    resumeUserSession(input: { nonce: "test==" }) {
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
        }
    }
}
`;

export const resumeUserSessionMutationPartialResponse = `
mutation ResumeUserSession {
    resumeUserSession(input: { nonce: "test=", t: "test==" }) {
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
        }
    }
}
`;

export const resumeUserSessionMutationExtraFields = `
mutation ResumeUserSession {
    resumeUserSession(input: { nonce: "test=", t: "test==" }) {
        unexpectedField
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
        }
    }
}
`;
