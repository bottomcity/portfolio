export const updateLoginPinMutation = (
  oldPIN: string,
  newPIN: string,
  newPINConfirmation: string,
) => `
        mutation{
            updateLoginPin(
                input: {
                    password: "${oldPIN}"
                    newPassword:"${newPIN}"
                    newPasswordConfirmation: "${newPINConfirmation}"
                }
            )
        }
    `;
