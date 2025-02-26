export const verifyOtpMutation = `mutation {
    verifyOtp(
      input: {
        otpId: "OTP_CODE_ID"
        otpCode: "824682"
      }
    ) {
      user {
        username
        email
      }
    }
  }
  `;
