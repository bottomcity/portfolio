const updateProfileData = `
      status
      code
      userData {
        userId
        username
        tier
        email
        firstName
        lastName
        mobilePrefix
        mobileNumber
        middleName
        dateOfBirth
        trackData
      }
      userProfile {
        ekycStatus
        gender
        placeOfBirth
        sourceOfFunds
        nationality
        natureOfWork
        address {
          residential {
            streetNo
            street
            barangay
            country
            city
            state
            zip
          }
          permanent {
            streetNo
            street
            barangay
            state
            country
            city
            zip
          }
        }
      }
      ekycRemainingAttempt
      fieldRemainingCount {
        firstName
        lastName
        dateOfBirth
        email
        placeOfBirth
        nationality
      }
`;

const updateProfileInput = `
        gender: "M"
        placeOfBirth: "PLACE"
        nationality: "NATION"
        natureOfWork: "WORK"
        sourceOfFunds: "FUND"
        address: {
          residential: {
            streetNo: "ENTERTAINMENT CITY"
            street: "1 ASEANA AVENUE"
            barangay: "TAMBO"
            city: "PARANAQUE"
            state: "CA"
            zip: "1701"
            country: "PHILIPPINES"
          }
          permanent: {
            streetNo: "ENTERTAINMENT CITY"
            street: "1 ASEANA AVENUE"
            barangay: "TAMBO"
            city: "PARANAQUE"
            state: "CA"
            zip: "1701"
            country: "PHILIPPINES"
          }
        }
`;

export const updateProfileMutation = `mutation {
    updateUserProfile(
      input: {
        firstName: "FIRST"
        lastName: "lastName"
        email: "test@email.com"
        dateOfBirth: "1990-09-12"
        pin: "1567"
        ${updateProfileInput}
      }
    ) {
      ${updateProfileData}
    }
  }
  `;

export const updateProfileInvalidEmailMutation = `mutation {
    updateUserProfile(
      input: {
        firstName: "FIRST"
        lastName: "lastName"
        email: "test@email"
        dateOfBirth: "1990-09-12"
        pin: "1567"
        ${updateProfileInput}
      }
    ) {
      ${updateProfileData}
    }
  }
  `;

export const updateProfileInvalidNamesMutation = (
  firstName: string,
  lastName: string,
) => `
  mutation {
    updateUserProfile(
      input: {
        firstName: "${firstName}"
        lastName: "${lastName}"
        email: "test@email.com"
        dateOfBirth: "1990-09-12"
        pin: "1567"
        ${updateProfileInput}
      }
    ) {
      ${updateProfileData}
    }
  }
  `;

export const updateProfileInvalidDateMutation = `mutation {
    updateUserProfile(
      input: {
        firstName: "FIRST"
        lastName: "lastName"
        email: "test@email.com"
        dateOfBirth: "1990-09-12123"
        pin: "1567"
        ${updateProfileInput}
      }
    ) {
      ${updateProfileData}
    }
  }
  `;

export const updateProfileInvalidPinMutation = `mutation {
    updateUserProfile(
      input: {
        firstName: "FIRST"
        lastName: "lastName"
        email: "test@email.com"
        dateOfBirth: "1990-09-12"
        pin: "15677"
        ${updateProfileInput}
      }
    ) {
      ${updateProfileData}
    }
  }
  `;

export const updateProfileMutationExtraFields = `mutation {
    updateUserProfile(
      input: {
        firstName: "FIRST"
        lastName: "lastName"
        email: "test@email.com"
        dateOfBirth: "1990-09-12"
        pin: "1567"
        ${updateProfileInput}
      }
    ) {
      unexpectedField
      status
      code
      userData {
        userId
        username
        tier
        email
        firstName
        lastName
        mobilePrefix
        mobileNumber
        middleName
        dateOfBirth
        trackData
      }
      userProfile {
        ekycStatus
        gender
        placeOfBirth
        sourceOfFunds
        nationality
        natureOfWork
        address {
          residential {
            streetNo
            street
            barangay
            country
            city
            state
            zip
          }
          permanent {
            streetNo
            street
            barangay
            state
            country
            city
            zip
          }
        }
      }
      ekycRemainingAttempt
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

export const updateProfileMutationPartialResponse = `mutation {
    updateUserProfile(
      input: {
        firstName: "FIRST"
        lastName: "lastName"
        email: "test@email.com"
        dateOfBirth: "1990-09-12"
        pin: "1567"
        ${updateProfileInput}
      }
    ) {
      status
      userData {
        userId
        username
        tier
        email
        firstName
        lastName
        mobilePrefix
        mobileNumber
        middleName
        dateOfBirth
        trackData
      }
      userProfile {
        ekycStatus
        gender
        placeOfBirth
        sourceOfFunds
        nationality
        natureOfWork
        address {
          residential {
            streetNo
            street
            barangay
            country
            city
            state
            zip
          }
          permanent {
            streetNo
            street
            barangay
            state
            country
            city
            zip
          }
        }
      }
      ekycRemainingAttempt
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
