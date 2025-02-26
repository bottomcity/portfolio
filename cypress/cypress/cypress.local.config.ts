import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    apiURL: '<apiURL>'
  },
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: '<baseUrl>',
    specPattern: 'cypress/e2e/local/**/*.spec.cy.ts',
    screenshotOnRunFailure: true,
    viewportHeight: 1024,
    defaultCommandTimeout: 18000,
    viewportWidth: 1366,
    waitForAnimations: false,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    video: false,
    retries: {
      runMode: 2
    }
  },

  reporter: 'cypress-qase-reporter',
  reporterOptions: {
    apiToken:
      '<apiToken>',
    projectCode: '<projectCode>',
    logging: true,
    runComplete: true,
    sendScreenshot: true,
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
