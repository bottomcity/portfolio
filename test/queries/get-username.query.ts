export const getUsername = `query GetUsername {
    getUsername {
        username
    }
}`;

export const getUsernameExtraField = `query GetUsername {    
    unexpectedField
    getUsername {
        username
    }
}`;
