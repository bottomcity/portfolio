import { defineConfig } from 'cypress';

module.exports = defineConfig({
  env: {
    apiURL: '<apiURL>',
    locales: {
      en: 'en',
      kr: 'kr',
      cn: 'cn'
    },
    apiURL: '<apiV2URL>',
    NEXTAUTH_JWT_SECRET: '<NEXTAUTH_JWT_SECRET>'
  },
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      require('cypress-qase-reporter/plugin')(on, config);
      require('cypress-qase-reporter/metadata')(on);
    },
    baseUrl: '<baseUrl>',
    specPattern: 'cypress/e2e/stage-env/**/*.spec.cy.ts',
    screenshotOnRunFailure: true,
    viewportHeight: 1024,
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 100000,
    viewportWidth: 1366,
    waitForAnimations: true,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    video: true,
    retries: {
      runMode: 2
    }
  },

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-qase-reporter',
    cypressMochawesomeReporterReporterOptions: {
      charts: true
    },
    cypressQaseReporterReporterOptions: {
      debug: true,
      mode: 'testops',
      testops: {
        api: {
          token:
            '<apiToken>',
        },
        defect: false,
        project: '<projectCode>',
        uploadAttachments: true,

        run: {
          complete: true,
          description: ''
        }
      },

      framework: {
        cypress: {
          screenshotsFolder: 'cypress/screenshots'
        }
      }
    },
    logging: true,
    screenshots: true,
    video: true
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    },
    specPattern: 'cypress/components/**/**/*.cy.{js,jsx,ts,tsx}',
    animationDistanceThreshold: 0,
    includeShadowDom: false,
    video: false
  }
});
