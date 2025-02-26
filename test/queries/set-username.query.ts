export const setUsername = `query SetUsername {
    setUsername {
        status
    }
}`;

export const setUsernameExtraField = `query SetUsername {
    unexpectedField
    setUsername {
        status
    }
}`;
