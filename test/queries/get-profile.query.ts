export const getProfileQuery = `query GetUserProfile {
  getUserProfile {
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
      userProfile {
          gender
          placeOfBirth
          nationality
          natureOfWork
          sourceOfFunds
          address {
              residential {
                  streetNo
                  street
                  barangay
                  country
                  state
                  city
                  zip
              }
              permanent {
                  streetNo
                  street
                  barangay
                  country
                  state
                  city
                  zip
              }
          }
      }
      ekyc {
          remainingAttempt
          status
          document {
              status
              nextAction
              startedAt
              completedAt
              documentType
              front
              back
              data {
                  issuingCountry
                  nationality
                  expiryDate
                  currentAge
              }
              extraction {
                  status
                  label
              }
              dataCheck {
                  status
                  label
              }
              imageCheck {
                  status
                  label
              }
              usability {
                  status
                  label
              }
          }
          selfie {
              status
              nextAction
              startedAt
              completedAt
              liveliness {
                  status
                  label
              }
              usability {
                  selfie {
                      status
                      label
                  }
                  facemap {
                      status
                      label
                  }
              }
          }
      }
      fieldRemainingCount {
          firstName
          lastName
          dateOfBirth
          email
          placeOfBirth
          nationality
      }
  }
}
`;

export const getProfileQueryExtraFields = `query GetUserProfile {
  getUserProfile {
      unexpectedField
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
      userProfile {
          gender
          placeOfBirth
          nationality
          natureOfWork
          sourceOfFunds
          address {
              residential {
                  streetNo
                  street
                  barangay
                  country
                  state
                  city
                  zip
              }
              permanent {
                  streetNo
                  street
                  barangay
                  country
                  state
                  city
                  zip
              }
          }
      }
      ekyc {
          remainingAttempt
          status
          document {
              status
              nextAction
              startedAt
              completedAt
              documentType
              front
              back
              data {
                  issuingCountry
                  nationality
                  expiryDate
                  currentAge
              }
              extraction {
                  status
                  label
              }
              dataCheck {
                  status
                  label
              }
              imageCheck {
                  status
                  label
              }
              usability {
                  status
                  label
              }
          }
          selfie {
              status
              nextAction
              startedAt
              completedAt
              liveliness {
                  status
                  label
              }
              usability {
                  selfie {
                      status
                      label
                  }
                  facemap {
                      status
                      label
                  }
              }
          }
      }
      fieldRemainingCount {
          firstName
          lastName
          dateOfBirth
          email
          placeOfBirth
          nationality
      }
  }
}
`;

export const getProfileQueryPartialResponse = `query GetUserProfile {
  getUserProfile {
      status
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
      userProfile {
          gender
          placeOfBirth
          nationality
          natureOfWork
          sourceOfFunds
          address {
              residential {
                  streetNo
                  street
                  barangay
                  country
                  state
                  city
                  zip
              }
              permanent {
                  streetNo
                  street
                  barangay
                  country
                  state
                  city
                  zip
              }
          }
      }
      ekyc {
          remainingAttempt
          status
          document {
              status
              nextAction
              startedAt
              completedAt
              documentType
              front
              back
              data {
                  issuingCountry
                  nationality
                  expiryDate
                  currentAge
              }
              extraction {
                  status
                  label
              }
              dataCheck {
                  status
                  label
              }
              imageCheck {
                  status
                  label
              }
              usability {
                  status
                  label
              }
          }
          selfie {
              status
              nextAction
              startedAt
              completedAt
              liveliness {
                  status
                  label
              }
              usability {
                  selfie {
                      status
                      label
                  }
                  facemap {
                      status
                      label
                  }
              }
          }
      }
      fieldRemainingCount {
          firstName
          lastName
          dateOfBirth
          email
          placeOfBirth
          nationality
      }
  }
}
`;
