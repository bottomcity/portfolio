export const getPatronBalanceQuery = `
query GetPatronBalance {
    getPatronBalance {
        status
        code
        message
        data {
            username
            sigWallet {
                CASH
                BP
                SP
                NCCU
            }
            acscWallet {
                CASH
                BP
                SP
                NCCU
            }
        }
    }
}`;
