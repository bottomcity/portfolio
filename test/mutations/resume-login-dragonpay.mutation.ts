export const resumeLoginDragonpayMutation = `
mutation ResumeLoginDragonpay {
    resumeLoginDragonpay(input: { 
        txnid: "txnid",
        refno: "refno",
        status: "status",
        message: "message",
        digest: "digest",
        param1: "param1",
        param2: "param2" 
  }) {
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
export const resumeLoginDragonpayMutationPartialResponse = `
mutation ResumeLoginDragonpay {
    resumeLoginDragonpay(input: { 
        txnid: "txnid",
        refno: "refno",
        status: "status",
        message: "message",
        digest: "digest",
        param1: "param1",
        param2: "param2" 
  })  {
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

export const resumeLoginDragonpayMutationExtraFields = `
mutation ResumeLoginDragonpay {
    resumeLoginDragonpay(input: { 
        txnid: "txnid",
        refno: "refno",
        status: "status",
        message: "message",
        digest: "digest",
        param1: "param1",
        param2: "param2" 
  })  {
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
