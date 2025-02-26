export const getExclusionQuery = `query GetExclusion {
    getExclusion {
        status
        code
        exclusionData {
            exclusionCode
            allow
            restrict
        }
    }
}
  `;

export const getExclusionQueryExtraFields = `query GetExclusion {
    getExclusion {
        status
        code
        unexpectedField
        exclusionData {
            exclusionCode
            allow
            restrict
        }
    }
}
  `;

export const getExclusionQueryPartialResponse = `query GetExclusion {
    getExclusion {
        status
        exclusionData {
            exclusionCode
            allow
            restrict
        }
    }
}
  `;
