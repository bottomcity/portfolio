This repository showcases examples of test automation using different frameworks. Below are details on how to access and run the tests for each framework:
	•	Cypress Tests: Branch: `cypress-e2e-example`
	•	Jest Tests: Branch: `jest-API-example`
	•	Playwright Tests: Branch: `playwright-e2e-example`
Each branch contains examples of how to write tests using the respective framework. You can clone and run these tests locally to review the code and execution.
How to Run Tests
	1.	Cypress Tests:
	•	Clone the repository and switch to the `cypress-e2e-example` branch.
	•	Install dependencies: `npm install`
 	•	Run tests in CI/CD: `QASE_MODE=testops QASE_RUN_NAME=$BITBUCKET_COMMIT npm run test:qa`
	•	Run tests: `npx cypress open`
	2.	Jest Tests:
	•	Clone the repository and switch to the `jest-API-example` branch.
	•	Install dependencies: `npm install`
  •	Run tests in CI/CD: `QASE_REPORT=1 QASE_RUN_NAME=$BITBUCKET_COMMIT QASE_RUN_DESCRIPTION=$(git log -1 --pretty=%B) USE_QASE_REPORTER=true npm run test:e2e`
	•	Run tests: `npm test`
	3.	Playwright Tests:
	•	Clone the repository and switch to the `playwright-e2e-example` branch.
	•	Install dependencies: `npm install`
	•	Run tests in CI/CD: `QASE_MODE=testops QASE_PLAN_ID=1 QASE_ENVIRONMENT=local QASE_TESTOPS_RUN_TITLE="$BITBUCKET_COMMIT-API" npx playwright test --config=playwright.API.config.ts`
