export const forgotLoginPinMutation = (
  username: string,
  lastName: string,
  firstName: string,
  mobileCountryCode: string,
  mobileNumber: string,
  deviceId: string,
  userAgent: string,
  dateOfBirth: string,
) => `
        mutation ForgotLoginPin{
            forgotLoginPin(
                input: {
                    username: "${username}"
                    lastName: "${lastName}"
                    firstName: "${firstName}"
                    mobileCountryCode: "${mobileCountryCode}"
                    mobileNumber: "${mobileNumber}"
                    deviceId: "${deviceId}"
                    userAgent: "${userAgent}"
                    dateOfBirth: "${dateOfBirth}"
                }
            )
        }
    `;

export const forgotLoginPin = `
        mutation ForgotLoginPin{
            forgotLoginPin(
                input: {
                    username: "321321312"
                    lastName: "TEST"
                    firstName: "TEST"
                    mobileCountryCode: "63"
                    mobileNumber: "0321312312"
                    deviceId: "Desktop"
                    userAgent: "Firefox"
                    dateOfBirth: "2002-02-02"
                }
            )
        }
    `;
