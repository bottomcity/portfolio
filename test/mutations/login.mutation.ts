import { testNames, testPINs } from '@test/enums/data-for-inputs-enums';

export const loginMutation = (login: string, PIN: string, deviceId: string) => `
        mutation login{
            login(
                input: {
                    login: "${login}"
                    password: "${PIN}"
                    deviceId: "${deviceId}"
                }
            ){
      user {
        username
        email
    }
  }
}`;

export const loginMutationPartialResponse = `
        mutation login{
            login(
                input: {
                    login: "${testNames.testName}"
                    password: "${testPINs.defaultPIN}"
                    deviceId: "${testNames.firefox}"
                }
            ){
      user {
        username
    }
  }
}`;

export const loginMutationExtraFields = `
        mutation login{
            login(
                input: {
                    login: "${testNames.testName}"
                    password: "${testPINs.defaultPIN}"
                    deviceId: "${testNames.firefox}"
                }
            ){
      user {
        unexpectedField
        username
        email
    }
  }
}`;
