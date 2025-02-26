// const fs = require('fs');
// import { PluginConfig, FilePreprocessorCallbackArgs } from 'cypress';
//
// module.exports = (on: Cypress.PluginEvents, config: PluginConfig) => {
//   on('file:preprocessor', (file: FilePreprocessorCallbackArgs) => {
//     if (file.path.includes('cypress/support/config')) {
//       // Determine which configuration file to load based on environment variable
//       const env = config.env.environment || 'local'; // Default to 'local' if not specified
//       const configFile = `cypress/support/config.${env}.json`;
//
//       // Read the contents of the configuration file
//       const contents = fs.readFileSync(configFile, 'utf8');
//
//       // Parse the JSON contents
//       const parsedConfig = JSON.parse(contents);
//
//       // Merge the parsed configuration with the existing configuration
//       return {
//         ...config,
//         ...parsedConfig
//       };
//     }
//   });
// };
