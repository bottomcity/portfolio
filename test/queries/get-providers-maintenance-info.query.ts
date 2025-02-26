export const getProvidersInMaintenanceInfoQuery: string = `
query GetProvidersMaintenanceInfo {
    getProvidersMaintenanceInfo {
        providersInMaintenance {
            provider
            startDate
            endDate
            enabled
            infoBar
            text
            disableRegistration
            disableLogin
        }
        status
        code
    }
}
`;

export const getProvidersInMaintenanceInfoQueryUnexpectedField: string = `
query GetProvidersMaintenanceInfo {
    getProvidersMaintenanceInfo {
        providersInMaintenance {
            provider
            startDate
            endDate
            enabled
            infoBar
            text
            disableRegistration
            disableLogin
            unexpectedField
        }
        status
        code
    }
}
`;
