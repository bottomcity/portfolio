import { test, expect, APIRequestContext } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { registerAdmin, bodyContentHTML, getFutureDates, generateRandomNumber } from '../utils/utils';
import { describe } from 'node:test';
import {
  invalidNames,
  notificationInfoTypes,
  notificationMessages,
  pageDescriptions,
  pageTitles,
  promoBodyData,
  promoDescriptions, promoBannerTitles, articlesCategory
} from '../enums/data-for-bodies';
import { pluralSlugs, singleSlugs } from '../enums/slugs';
import { ArticlePageActions } from '../API-scenarios-actions/article-page-actions';
import { PromoActions } from '../API-scenarios-actions/promo-actions';
import { EgamesActions } from '../API-scenarios-actions/egames-actions';
import { LiveSlotsActions } from '../API-scenarios-actions/live-slots-actions';
import { LiveCasinoActions } from '../API-scenarios-actions/live-casino-actions';
import { NotificationActions } from '../API-scenarios-actions/notification-actions';
import { errorTexts } from '../enums/error-texts';
import { BannerActions } from '../API-scenarios-actions/banner-actions';
import { FileActions } from '../API-scenarios-actions/file-actions';

let adminRegToken: string;
let apiContext: APIRequestContext;
let fileActions: FileActions;
let slug: string;
let requestBody: any;
let documentId: string;

test.describe.configure({ mode: 'serial' });

describe('Strapi CMS API suit', () => {
  test.beforeAll(async () => {
    const authResult = await registerAdmin();
    adminRegToken = authResult.adminRegToken;
    apiContext = authResult.apiContext;

  });

  describe('Egames CRUD', () => {
    let egamesActions: EgamesActions;
    let logs: string[] = [];
    let apiContext: APIRequestContext;

    const attachLogsToQase = async (
      testTitle: string,
      testCaseId: number,
      apiContext: APIRequestContext
    ) => {
      if (!logs.length) return;

      const apiToken = process.env.QASE_TESTOPS_API_TOKEN;
      const projectCode = process.env.QASE_TESTOPS_PROJECT;
      const logContent = logs.join('\n');
      const logFileName = `logs-${testTitle.replace(/ /g, '_')}.txt`;

      const testRunsResponse = await apiContext.get(
        `https://api.qase.io/v1/run/${projectCode}`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
        }
      );

      const testRuns = await testRunsResponse.json();
      const latestRun = testRuns?.result?.entities?.[0];
      const testRunId = latestRun?.id;

      if (!testRunId) {
        console.error(`Failed to retrieve Test Run ID for ${testTitle}`);
        return;
      }

      const testResultsResponse = await apiContext.get(
        `https://api.qase.io/v1/result/${projectCode}/${testRunId}`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
        }
      );

      const testResults = await testResultsResponse.json();
      const testResult = testResults?.result?.entities?.find(
        (result: any) => result.case_id === testCaseId
      );
      const testResultId = testResult?.id;

      if (!testResultId) {
        console.error(`Failed to retrieve Test Result ID for Test Case ${testCaseId}`);
        return;
      }

      const response = await apiContext.post(
        `https://api.qase.io/v1/attachment/${projectCode}/${testRunId}/${testResultId}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
          multipart: {
            file: {
              name: logFileName,
              mimeType: 'text/plain',
              buffer: Buffer.from(logContent),
            },
          },
        }
      );

      if (response.ok()) {
        console.log(`Logs uploaded to Qase for ${testTitle}`);
      } else {
        console.error(`Failed to upload logs to Qase for ${testTitle}`);
      }
    };

    test.beforeAll(async ({ playwright }) => {
      apiContext = await playwright.request.newContext({
        baseURL: 'https://api.qase.io/v1',
        extraHTTPHeaders: {
          Authorization: `Bearer ${process.env.QASE_TESTOPS_API_TOKEN}`,
        },
      });

      egamesActions = new EgamesActions(apiContext, adminRegToken);

      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
    });

    test.afterEach(async ({}, testInfo) => {
      const testCaseId = testInfo.annotations.find((a) => a.type === 'qase')?.description;
      if (testCaseId) {
        await attachLogsToQase(testInfo.title, parseInt(testCaseId), apiContext);
      }
      logs = [];
    });

    test(
      qase(67, 'Get default Egames'),
      async () => {
        await egamesActions.getEgamesEntry(404);
      }
    );

    test(
      qase(34, 'Update Egames'),
      async () => {
        await egamesActions.updateEgamesEntry({
          title: pluralSlugs.eGamesPage,
          description: pageDescriptions.updatedMetaDescription,
        });
      }
    );

    test(
      qase(52, 'Get Egames after updating'),
      async () => {
        await egamesActions.getEgamesEntry(200);
      }
    );

    test(
      qase(35, 'Delete Egames'),
      async () => {
        await egamesActions.deleteEgamesEntry();
      }
    );
  });

  describe('Live Slots CRUD', () => {
    let liveSlotsActions: LiveSlotsActions;
    test.beforeAll(async () => {
      liveSlotsActions = new LiveSlotsActions(apiContext, adminRegToken);
    });

    test(
      qase(53, 'Get default Live Slots'),
      async () => {
        await liveSlotsActions.getLiveSlotsEntry(404);
      }
    );

    test(
      qase(54, 'Update Live Slots'),
      async () => {
        await liveSlotsActions.updateLiveSlotsEntry(
          {
            title: pluralSlugs.liveSlotPage,
            description: pageDescriptions.updatedMetaDescription
          }
        );
      }
    );

    test(
      qase(55, 'Get Live Slots after updating'),
      async () => {
        await liveSlotsActions.getLiveSlotsEntry(200);
      }
    );

    test(
      qase(56, 'Delete Live Slots'),
      async () => {
        await liveSlotsActions.deleteLiveSlotsEntry();
      }
    );
  });

  describe('Live Casino CRUD', () => {
    let liveCasinoActions: LiveCasinoActions;
    test.beforeAll(async () => {
      liveCasinoActions = new LiveCasinoActions(apiContext, adminRegToken);
    });

    test(
      qase(57, 'Get default Live Casino'),
      async () => {
        await liveCasinoActions.getLiveCasinoEntry(404);
      }
    );

    test(
      qase(58, 'Update Live Casino'),
      async () => {
        await liveCasinoActions.updateLiveCasinoEntry(
          {
            title: pluralSlugs.eGamesPage,
            description: pageDescriptions.updatedMetaDescription
          }
        );
      }
    );

    test(
      qase(59, 'Get Live Casino after updating'),
      async () => {
        await liveCasinoActions.getLiveCasinoEntry(200);
      }
    );

    test(
      qase(60, 'Delete Live Casino'),
      async () => {
        await liveCasinoActions.deleteLiveCasinoEntry();
      }
    );
  });

  describe('Page CRUD', () => {
    let pageActions: ArticlePageActions;
    let existingPageData: any;
    let updatedPageData: any;
    let pageDocumentId: string;
    let pageTitle: string;
    let stablePageTitle: string
    let stablePage: string;

    test.beforeAll(async () => {
      pageActions = new ArticlePageActions(apiContext, adminRegToken, singleSlugs.pagePage);
      stablePage = `stable-page-for-test-${generateRandomNumber(1, 100000)}`;
      stablePageTitle =  `${pageTitles.draftPageTitle} ${generateRandomNumber(1, 100000)}`
      const requestBody = await pageActions.preparePageRequestBody(
        stablePage,
        stablePageTitle,
        bodyContentHTML(pageTitles.defaultEngTitle),
        pageDescriptions.defaultDescription
      );

      existingPageData = await pageActions.createPageEntry(requestBody, 201);
      pageDocumentId = existingPageData.data.documentId
      const response = await pageActions.publishPageEntry(pageDocumentId, requestBody, 200)
      expect(response.data).toHaveProperty('publishedAt');
      expect(response.data.publishedAt).not.toBeNull();
      expect(response.data).toHaveProperty('status');
      expect(response.data.status).toBe('published');
    });

    test(
      qase(61, 'Create a new page post'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;
        pageTitle = `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await pageActions.preparePageRequestBody(
          slug,
          pageTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.createPageEntry(requestBody, 201);
        expect(response).toBeDefined();
      }
    );

    test(
      qase(84, 'Create a new page post with invalid title'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await pageActions.preparePageRequestBody(
          slug,
          invalidNames.invalid256Name,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        qase.attach({name: 'response BODY', content: response.data})
      }
    );

    test(
      qase(86, 'Create a new page post with invalid slug'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await pageActions.preparePageRequestBody(
          invalidNames.invalid256Name,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test.skip(
      qase(68, 'Create a new page post with not unique title'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await pageActions.preparePageRequestBody(
          pageTitles.integrationTests,
          pageTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test.skip(
      qase(69, 'Create a new page post with not unique slug'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await pageActions.preparePageRequestBody(
          stablePage,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test(
      qase(117, 'Create a new page with invalid Banner relation'),
      async () => {
        requestBody = await pageActions.preparePageRequestBody(
          pageTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await pageActions.createPageEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(70, 'Publish a new page post with invalid title'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await pageActions.preparePageRequestBody(
          slug,
          invalidNames.invalid256Name,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.publishPageEntry(pageDocumentId, requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(71, 'Publish a new page post with invalid slug'),
      async () => {
        slug = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await pageActions.preparePageRequestBody(
          invalidNames.invalid256Name,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.publishPageEntry(pageDocumentId, requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(123, 'Publish a page with invalid Banner relation'),
      async () => {
        requestBody = await pageActions.preparePageRequestBody(
          pageTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await pageActions.publishPageEntry(pageDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(62, 'Update a page post'),
      async () => {
        updatedPageData = await pageActions.updateArticleOrPage(
          existingPageData,
          stablePage,
          pageTitle,
          200,
          stablePage,
          `${pageTitles.updatedTitle} ${generateRandomNumber(1, 100000)}`
        );
        expect(updatedPageData).toBeDefined();
        slug = updatedPageData.slug
        expect(slug).toBeDefined();
      }
    );

    test(
      qase(72, 'Update a page post with invalid slug'),
      async () => {
        const errorData = await pageActions.updateArticleOrPage(
          existingPageData,
          slug,
          pageTitle,
          500,
          invalidNames.invalid256Name,
          pageTitle
        );
        expect(errorData).toBeDefined();
      }
    );

    test(
      qase(73, 'Update a page post with invalid title'),
      async () => {
        const errorData = await pageActions.updateArticleOrPage(
          existingPageData,
          slug,
          pageTitle,
          500,
          pageTitle,
          invalidNames.invalid256Name,
        );
        expect(errorData).toBeDefined();
      }
    );

    test.skip(
      qase(74, 'Update a page post with not unique title'),
      async () => {
        const errorData = await pageActions.updateArticleOrPage(
          existingPageData,
          slug,
          pageTitle,
          500,
          slug,
          pageTitle,
        );
        expect(errorData).toBeDefined();
        expect(errorData.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test.skip(
      qase(75, 'Update a page post with not unique slug'),
      async () => {
        const errorData = await pageActions.updateArticleOrPage(
          existingPageData,
          slug,
          pageTitle,
          500,
          slug,
          pageTitle,
        );
        expect(errorData).toBeDefined();
        expect(errorData.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test(
      qase(128, 'Update a page invalid Banner relation'),
      async () => {
        requestBody = await pageActions.preparePageRequestBody(
          pageTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await pageActions.updatePageEntry(pageDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(63, 'Delete a page post'),
      async () => {
        await pageActions.deletePageEntry(pageDocumentId);
      }
    );
  });

  describe('Promo CRUD', () => {
    let promoActions: PromoActions;
    let stablePromoTitle: string;
    let promoDocumentId: string;
    let existingPromoData: any;
    let updatedDocumentId: string;
    let updatedPromoData: any;
    let promoTitle: string;
    let stablePageSlug: string;
    const { startDate, endDate } = getFutureDates(7, 17);

    test.beforeAll(async () => {
      promoActions = new PromoActions(apiContext, adminRegToken);
      stablePageSlug = `stable-promo-for-test-${generateRandomNumber(1, 100000)}`;

      stablePromoTitle = `stable ${Date.now().toString(36).replace(/\d/g, '')}`;
      requestBody = await promoActions.preparePromoRequestBody(
        stablePageSlug,
        stablePromoTitle,
        promoBodyData.descriptionForMechanics,
        promoBodyData.descriptionForTerms,
        promoDescriptions.defaultDescription,
        startDate,
        endDate
      );

      existingPromoData = await promoActions.createPromoEntry(requestBody, 201);
      const stablePromoResponse =  await promoActions.publishPromoEntry(
        existingPromoData.data.documentId,
        requestBody,
        200
      );
      expect(stablePromoResponse.data).toHaveProperty('publishedAt');
      expect(stablePromoResponse.data.publishedAt).not.toBeNull();
      expect(stablePromoResponse.data).toHaveProperty('status');
      expect(stablePromoResponse.data.status).toBe('published');
      promoDocumentId = stablePromoResponse.data.documentId
    });

    test(
      qase(46, 'Create a new Promo'),
      async () => {
        promoTitle = `${promoBannerTitles.defaultPromoTitle}-${generateRandomNumber(1, 100000)}`;
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          promoTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );

        const promoData = await promoActions.createPromoEntry(requestBody, 201);
        expect(promoData).toBeDefined();
        documentId = promoData.data.documentId
      }
    );

    test(
      qase(76, 'Create a new Promo with invalid long title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalid57Name,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.createPromoEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.details.errors[0].message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test.skip(
      qase(77, 'Create a new Promo with invalid short title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalidShortName,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.createPromoEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.details.errors[0].message).toContain(errorTexts.mustBeAtLeast3Characters);
      }
    );

    test.skip(
      qase(87, 'Create a new Promo with invalid title special symbols'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalidWithSpecialSymbolsName,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.createPromoEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.details.errors[0].message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test.skip(
      qase(88, 'Create a new Promo with invalid title only digits'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalidOnlyDigitsName,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.createPromoEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.details.errors[0].message).toContain(errorTexts.mustBeAtLeast3Characters);
      }
    );

    test(
      qase(78, 'Possible to Create a new Promo with not unique title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          stablePromoTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.createPromoEntry(requestBody, 201);
        expect(response.data).toBeDefined();
        expect(response.error).toBeUndefined();
      }
    );

    test(
      qase(130, 'Possible to Create a new promo invalid Banner relation'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          promoTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await promoActions.createPromoEntry(requestBody, 201);
        expect(response.data).toBeDefined();
        expect(response.error).toBeUndefined();
      }
    );

    test(
      qase(79, 'Publish a new Promo with invalid long title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalid57Name,
          invalidNames.invalid256Name,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.publishPromoEntry(promoDocumentId, requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.details.errors[0].message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test(
      qase(80, 'Publish a new Promo with invalid short title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalidShortName,
          promoDescriptions.defaultDescription,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.publishPromoEntry(promoDocumentId, requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.details.errors[0].message).toContain(errorTexts.mustBeAtLeast3Characters);
      }
    );

    test(
      qase(89, 'Publish a new Promo with title only digits'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalidOnlyDigitsName,
          promoDescriptions.defaultDescription,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.publishPromoEntry(promoDocumentId, requestBody, 200);
        expect(response.data).toBeDefined();
        expect(response.error).toBeUndefined();
      }
    );

    test(
      qase(90, 'Publish a new Promo with title special symbols'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          invalidNames.invalidWithSpecialSymbolsName,
          promoDescriptions.defaultDescription,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.publishPromoEntry(promoDocumentId, requestBody, 200);
        expect(response.data).toBeDefined();
        expect(response.error).toBeUndefined();
      }
    );

    test.skip(
      qase(81, 'Publish a new Promo with not unique title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          stablePromoTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await promoActions.publishPromoEntry(promoDocumentId, requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(124, 'Possible to Publish a promo with invalid Banner relation'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          promoBannerTitles.defaultPromoTitle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await promoActions.publishPromoEntry(promoDocumentId, requestBody, 200)
        expect(response.data).toBeDefined();
        expect(response.error).toBeUndefined();
      }
    );

    test(
      qase(91, 'Update a Promo with invalid long title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: invalidNames.invalid256Name,
          body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        updatedPromoData = await promoActions.updatePromoEntry(documentId, updatedPromoData, 400);
        expect(updatedPromoData.data).toBeNull();
        expect(updatedPromoData.error).toBeDefined();
        expect(updatedPromoData.error.details.errors[0].message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test.skip(
      qase(92, 'Update a Promo with invalid short title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: invalidNames.invalidShortName,
          Body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        updatedPromoData = await promoActions.updatePromoEntry(documentId, updatedPromoData, 400);
        expect(updatedPromoData.data).toBeNull();
        expect(updatedPromoData.error).toBeDefined();
        expect(updatedPromoData.error.details.errors[0].message).toContain(errorTexts.mustBeAtLeast3Characters);
      }
    );

    test.skip(
      qase(93, 'Update a Promo with invalid title only digits'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: invalidNames.invalidWithSpecialSymbolsName,
          Body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        updatedPromoData = await promoActions.updatePromoEntry(documentId, updatedPromoData, 400);
        expect(updatedPromoData.data).toBeNull();
        expect(updatedPromoData.error).toBeDefined();
        expect(updatedPromoData.error.details.errors[0].message).toContain(errorTexts.mustMatchTheFollowing);
      }
    );

    test.skip(
      qase(94, 'Update a Promo with invalid title special symbols'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: invalidNames.invalidWithSpecialSymbolsName,
          Body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        updatedPromoData = await promoActions.updatePromoEntry(documentId, updatedPromoData, 400);
        expect(updatedPromoData.data).toBeNull();
        expect(updatedPromoData.error).toBeDefined();
        expect(updatedPromoData.error.details.errors[0].message).toContain(errorTexts.mustMatchTheFollowing);
      }
    );

    test(
      qase(47, 'Update a Promo'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;
        promoTitle = `${promoBannerTitles.defaultPromoTitle} ${pageTitles.updatedTitle} ${generateRandomNumber(1, 100000)}`
        requestBody = await promoActions.preparePromoRequestBody(
          slug,
          `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`,
          pageTitles.defaultEngTitle,
          bodyContentHTML(pageTitles.defaultEngTitle),
          pageDescriptions.defaultDescription
        );

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: promoTitle,
          body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        updatedPromoData = await promoActions.updatePromoEntry(documentId, updatedPromoData, 200);

        updatedDocumentId = updatedPromoData.data.documentId
        expect(updatedDocumentId).toBeDefined();
      }
    );

    test(
      qase(85, 'Possible to Update a Promo with not unique title'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: promoTitle,
          body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        updatedPromoData = await promoActions.updatePromoEntry(promoDocumentId, updatedPromoData, 200);
        expect(updatedPromoData.data).toBeDefined();
        expect(updatedPromoData.error).toBeUndefined();
      }
    );

    test(
      qase(129, 'Possible to Update a new promo invalid Banner relation'),
      async () => {
        slug = `${pluralSlugs.promoPage}-${generateRandomNumber(1, 100000)}`;

        updatedPromoData = {
          ...existingPromoData,
          slug: slug,
          title: `${promoBannerTitles.defaultPromoTitle} ${pageTitles.updatedTitle} ${generateRandomNumber(1, 100000)}`,
          body: bodyContentHTML(pageTitles.updatedTitle),
        };

        // Remove fields that should not be sent in the update payload
        delete updatedPromoData.id;
        delete updatedPromoData.createdAt;
        delete updatedPromoData.updatedAt;
        delete updatedPromoData.publishedAt;

        const response = await promoActions.updatePromoEntry(promoDocumentId, updatedPromoData, 200)
        expect(response.data).toBeDefined();
        expect(response.error).toBeUndefined();
      }
    );

    test(
      qase(48, 'Delete a Promo'),
      async () => {
        await promoActions.deletePromoEntry(updatedDocumentId);
      }
    );
  });

  describe('Notifications CRUD', () => {
    let notificationActions: NotificationActions;
    let stableNotification: string;
    let existingNotificationData: any;
    let updatedNotificationData: any;
    let notificationMessage: string;
    let notificationDocumentId: string;
    const { startDate, endDate } = getFutureDates(7, 17);

    test.beforeAll(async () => {
      notificationActions = new NotificationActions(apiContext, adminRegToken);

      stableNotification = `stable notification for test ${generateRandomNumber(1, 100000)}`;
      requestBody = await notificationActions.prepareNotificationRequestBody(
        notificationInfoTypes.warning,
        stableNotification,
        startDate,
        endDate,
        true,
        true,
        false,
        false,
        false,
      );

      existingNotificationData = await notificationActions.createNotification(requestBody, 201);
      const notificationResponse =  await notificationActions.publishNotificationEntry(
        existingNotificationData.data.documentId,
        requestBody,
        200
      );
      expect(notificationResponse.data).toHaveProperty('publishedAt');
      expect(notificationResponse.data.publishedAt).not.toBeNull();
      expect(notificationResponse.data).toHaveProperty('status');
      expect(notificationResponse.data.status).toBe('published');
    });

    test(
      qase(64, 'Create a new Notification'),
      async () => {
        notificationMessage = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await notificationActions.prepareNotificationRequestBody(
          notificationInfoTypes.warning,
          notificationMessages.defaultMessage,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );
        const response = await notificationActions.createNotification(requestBody, 201);
        expect(response).toBeDefined();
        notificationDocumentId = response.data.documentId
      }
    );

    test(
      qase(221, 'Create a new Notification with all possible info types'),
      async () => {
        for (const infoType of Object.values(notificationInfoTypes)) {
          notificationMessage = `${pluralSlugs.pagePage}-${generateRandomNumber(1, 100000)}`;

          const requestBody = await notificationActions.prepareNotificationRequestBody(
            infoType,
            notificationMessages.defaultMessage,
            startDate,
            endDate,
            true,
            true,
            true,
            false,
            false,
          );

          const response = await notificationActions.createNotification(requestBody, 201);
          expect(response).toBeDefined();
        }
      }
    );

    test(
      qase(97, 'Create a new Notification with long text message'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          notificationInfoTypes.warning,
          `${invalidNames.invalid256Name}${invalidNames.invalid256Name}`,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );
        const response = await notificationActions.createNotification(requestBody, 201);
        expect(response.data).toBeDefined();
      }
    );

    test(
      qase(98, 'Create a new Notification with empty Notification Info Type'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          null,
          invalidNames.invalid256Name,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );
        const response = await notificationActions.createNotification(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeProvided);
      }
    );

    test(
      qase(224, 'Create a new Notification with incorrect Notification Info Type'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          articlesCategory.sports, // articles category is using here as an incorrect info type
          invalidNames.invalid256Name,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );
        const response = await notificationActions.createNotification(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeOneOfValues);
      }
    );

    test(
      qase(95, 'Publish a Notification with long text message'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          notificationInfoTypes.warning,
          `${invalidNames.invalid256Name}${invalidNames.invalid256Name}`,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );
        const notificationResponse =  await notificationActions.publishNotificationEntry(
          notificationDocumentId,
          requestBody,
          400
        );
        expect(notificationResponse.data).toBeNull();
        expect(notificationResponse.error).toBeDefined();
        expect(notificationResponse.error.message).toContain(errorTexts.mustMatchTheFollowing);
      }
    );

    test(
      qase(96, 'Publish a new Notification with empty Notification Info Type'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          null,
          invalidNames.invalid256Name,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );
        const notificationResponse =  await notificationActions.publishNotificationEntry(
          notificationDocumentId,
          requestBody,
          400
        );
        expect(notificationResponse.data).toBeNull();
        expect(notificationResponse.error).toBeDefined();
        expect(notificationResponse.error.message).toContain(errorTexts.mustBeProvided);
      }
    );

    test(
      qase(65, 'Update a Notification'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          notificationInfoTypes.warning,
          notificationMessages.defaultMessage,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );

        updatedNotificationData = {
          ...existingNotificationData,
          message: notificationMessages.updatedMessage,
          InfoTypes: notificationInfoTypes.warning,
        };

        // Remove fields that should not be sent in the update payload
        delete updatedNotificationData.id;
        delete updatedNotificationData.createdAt;
        delete updatedNotificationData.updatedAt;
        delete updatedNotificationData.publishedAt;

        updatedNotificationData = await notificationActions.updateNotification(notificationDocumentId, updatedNotificationData, 200);

        notificationDocumentId = updatedNotificationData.data.documentId
        expect(notificationDocumentId).toBeDefined();
      }
    );

    test(
      qase(99, 'Update a Notification with invalid message'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          notificationInfoTypes.warning,
          invalidNames.invalid256Name,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );

        updatedNotificationData = {
          ...existingNotificationData,
          message: invalidNames.invalid256Name,
        };

        // Remove fields that should not be sent in the update payload
        delete updatedNotificationData.id;
        delete updatedNotificationData.createdAt;
        delete updatedNotificationData.updatedAt;
        delete updatedNotificationData.publishedAt;
        updatedNotificationData = await notificationActions.updateNotification(notificationDocumentId, updatedNotificationData, 400);
        expect(updatedNotificationData.data).toBeNull();
        expect(updatedNotificationData.error).toBeDefined();
      }
    );

    test(
      qase(100, 'Update a Notification with empty Notification Info Type'),
      async () => {
        requestBody = await notificationActions.prepareNotificationRequestBody(
          null,
          invalidNames.invalid256Name,
          startDate,
          endDate,
          true,
          true,
          true,
          false,
          false,
        );

        updatedNotificationData = {
          ...existingNotificationData,
          message: invalidNames.invalid256Name,
        };

        // Remove fields that should not be sent in the update payload
        delete updatedNotificationData.id;
        delete updatedNotificationData.createdAt;
        delete updatedNotificationData.updatedAt;
        delete updatedNotificationData.publishedAt;

        updatedNotificationData = await notificationActions.updateNotification(notificationDocumentId, updatedNotificationData, 400);
        expect(updatedNotificationData.data).toBeNull();
        expect(updatedNotificationData.error).toBeDefined();
        expect(updatedNotificationData.error.message).toContain(errorTexts.mustBeProvided);
      }
    );

    test(
      qase(66, 'Delete a Notification'),
      async () => {
        await notificationActions.deleteNotification(notificationDocumentId);
      }
    );
  });

  describe('Article CRUD', () => {
    let articleActions: ArticlePageActions;
    let articleDocumentId: string;
    let articleTitle: string;
    let existingArticleData: any;
    let updatedArticleData: any;
    let stableArticleTitle: string
    let stableArticle: string;

    test.beforeAll(async () => {
      articleActions = new ArticlePageActions(apiContext, adminRegToken, singleSlugs.articlePage);
      stableArticle = `stable-page-for-test-${generateRandomNumber(1, 100000)}`;
      stableArticleTitle =  `${pageTitles.draftPageTitle} ${generateRandomNumber(1, 100000)}`
      const requestBody = await articleActions.preparePageRequestBody(
        stableArticle,
        stableArticleTitle,
        bodyContentHTML(pageTitles.defaultEngTitle),
        pageDescriptions.defaultDescription
      );

      existingArticleData = await articleActions.createPageEntry(requestBody, 201);
      articleDocumentId = existingArticleData.data.documentId
      const response = await articleActions.publishPageEntry(articleDocumentId, requestBody, 200)
      expect(response.data).toHaveProperty('publishedAt');
      expect(response.data.publishedAt).not.toBeNull();
      expect(response.data).toHaveProperty('status');
      expect(response.data.status).toBe('published');
    });

    test(
      qase(101, 'Create a new Article post'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;
        articleTitle =  `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await articleActions.preparePageRequestBody(
          slug,
          articleTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.createPageEntry(requestBody, 201);
        expect(response).toBeDefined();
      }
    );

    test(
      qase(222, 'Create a new Article post with all possible categories'),
      async () => {
        for (const category of Object.values(articlesCategory)) {
          const slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;
          const articleTitle = `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`;

          const requestBody = await articleActions.preparePageRequestBody(
            slug,
            articleTitle,
            bodyContentHTML(pageTitles.integrationTests),
            pageDescriptions.defaultDescription,
            null,
            null,
            null,
            null,
            null,
            null,
            category,
          );

          const response = await articleActions.createPageEntry(requestBody, 201);
          expect(response).toBeDefined();
        }
      }
    );

    test(
      qase(102, 'Create a new page Article with invalid title'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await articleActions.preparePageRequestBody(
          slug,
          invalidNames.invalid256Name,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(103, 'Create a new Article post with invalid slug'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await articleActions.preparePageRequestBody(
          invalidNames.invalid256Name,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(167, 'Create a new Article post with empty category'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;
        articleTitle = `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await articleActions.preparePageRequestBody(
          slug,
          articleTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        );
        const response = await articleActions.createPageEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeProvided);
      }
    );

    test(
      qase(223, 'Create a new Article post with incorrect category'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;
        articleTitle = `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await articleActions.preparePageRequestBody(
          slug,
          articleTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          null,
          null,
          null,
          null,
          null,
          notificationInfoTypes.success, // info types is using here as an incorrect category
        );
        const response = await articleActions.createPageEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeOneOfValues);
      }
    );

    test.skip(
      qase(104, 'Create a new Article post with not unique title'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await articleActions.preparePageRequestBody(
          pageTitles.integrationTests,
          articleTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test.skip(
      qase(105, 'Create a new Article post with not unique slug'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await articleActions.preparePageRequestBody(
          stableArticle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.createPageEntry(requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test(
      qase(116, 'Create a new Banner invalid article relation'),
      async () => {
        requestBody = await articleActions.preparePageRequestBody(
          stableArticle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );

        const response = await articleActions.createPageEntry(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(106, 'Publish a new Article post with invalid title'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await articleActions.preparePageRequestBody(
          slug,
          invalidNames.invalid256Name,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.publishPageEntry(articleDocumentId, requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(107, 'Publish a new Article post with invalid slug'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;

        requestBody = await articleActions.preparePageRequestBody(
          invalidNames.invalid256Name,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.publishPageEntry(articleDocumentId, requestBody, 500);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(122, 'Publish a article invalid Banner relation'),
      async () => {
        requestBody = await articleActions.preparePageRequestBody(
          stableArticle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await articleActions.publishPageEntry(articleDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(168, 'Publish a new Article post with empty category'),
      async () => {
        slug = `${pluralSlugs.articlePage}-${generateRandomNumber(1, 100000)}`;
        articleTitle =  `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await articleActions.preparePageRequestBody(
          slug,
          articleTitle,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        );
        const response = await articleActions.publishPageEntry(articleDocumentId, requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(108, 'Update a Article post'),
      async () => {
        updatedArticleData = await articleActions.updateArticleOrPage(
          existingArticleData,
          stableArticle,
          articleTitle,
          200,
          stableArticle,
          `${pageTitles.updatedTitle} ${generateRandomNumber(1, 100000)}`
        );
        expect(updatedArticleData).toBeDefined();
        slug = updatedArticleData.slug
        expect(slug).toBeDefined();
      }
    );

    test(
      qase(109, 'Update a Article post with invalid slug'),
      async () => {
        const errorData = await articleActions.updateArticleOrPage(
          existingArticleData,
          slug,
          articleTitle,
          500,
          invalidNames.invalid256Name,
          articleTitle
        );
        expect(errorData).toBeDefined();
      }
    );

    test(
      qase(110, 'Update a Article post with invalid title'),
      async () => {
        const errorData = await articleActions.updateArticleOrPage(
          existingArticleData,
          slug,
          articleTitle,
          500,
          slug,
          invalidNames.invalid256Name,
        );
        expect(errorData).toBeDefined();
      }
    );

    test.skip(
      qase(111, 'Update a Article post with not unique title'),
      async () => {
        const errorData = await articleActions.updateArticleOrPage(
          existingArticleData,
          slug,
          articleTitle,
          500,
          slug,
          articleTitle,
        );
        expect(errorData).toBeDefined();
        expect(errorData.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test.skip(
      qase(112, 'Update a Article post with not unique slug'),
      async () => {
        const errorData = await articleActions.updateArticleOrPage(
          existingArticleData,
          slug,
          articleTitle,
          500,
          slug,
          articleTitle,
        );
        expect(errorData).toBeDefined();
        expect(errorData.message).toContain(errorTexts.mustBeUnique);
      }
    );

    test(
      qase(127, 'Update a article with invalid Banner relation'),
      async () => {
        requestBody = await articleActions.preparePageRequestBody(
          stableArticle,
          pageTitles.integrationTests,
          bodyContentHTML(pageTitles.integrationTests),
          pageDescriptions.defaultDescription,
          null,
          0,
          slug // slug is used here as invalid documentId for banner
        );
        const response = await articleActions.updatePageEntry(articleDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(169, 'Update a Article post with empty category'),
      async () => {
        updatedArticleData = await articleActions.updateArticleOrPage(
          existingArticleData,
          stableArticle,
          articleTitle,
          400,
          stableArticle,
          `${pageTitles.updatedTitle} ${generateRandomNumber(1, 100000)}`,
          null
        );
        expect(updatedArticleData.message).toContain(errorTexts.mustBeProvided);
      }
    );

    test(
      qase(113, 'Delete a Article post'),
      async () => {
        await articleActions.deletePageEntry(articleDocumentId);
      }
    );
  });

  describe('Banner CRUD', () => {
    let bannerActions: BannerActions;
    let bannerDocumentId: string;
    let bannerTitle: string;
    let stableBannerTitle: string
    let bannerBtnLink: string = `/register`;
    let imageData: any;
    let existingBannerData: any;

    test.beforeAll(async () => {
      fileActions = new FileActions(apiContext, adminRegToken);
      imageData = await fileActions.uploadImage('test-image.jpg');

      bannerActions = new BannerActions(apiContext, adminRegToken);
      stableBannerTitle =  `${pageTitles.draftBannerTitle}`
      const requestBody = await bannerActions.prepareBannerRequestBody(
        stableBannerTitle,
        imageData,
        null,
        bannerBtnLink
      );

      existingBannerData = await bannerActions.createBanner(requestBody, 201);
      bannerDocumentId = existingBannerData.data.documentId
      const response = await bannerActions.publishBanner(bannerDocumentId, requestBody, 200)
      expect(response.data).toHaveProperty('publishedAt');
      expect(response.data.publishedAt).not.toBeNull();
      expect(response.data).toHaveProperty('status');
      expect(response.data.status).toBe('published');
    });

    test(
      qase(114, 'Create a new Banner'),
      async () => {
        bannerTitle =  `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        const response = await bannerActions.createBanner(requestBody, 201);
        expect(response).toBeDefined();
      }
    );

    test(
      qase(115, 'Create a new Banner invalid long title'),
      async () => {
        bannerTitle = invalidNames.invalid57Name

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        const response = await bannerActions.createBanner(requestBody, 400);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test(
      qase(118, 'Publish a Banner'),
      async () => {
        bannerTitle =  pageTitles.draftBannerTitle

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        existingBannerData = await bannerActions.createBanner(requestBody, 201);
        bannerDocumentId = existingBannerData.data.documentId
        const response = await bannerActions.publishBanner(bannerDocumentId, requestBody, 200)
        expect(response.data).toHaveProperty('publishedAt');
        expect(response.data.publishedAt).not.toBeNull();
        expect(response.data).toHaveProperty('status');
        expect(response.data.status).toBe('published');
      }
    );

    test(
      qase(119, 'Publish a Banner invalid regexp title'),
      async () => {
        bannerTitle =  `${pageTitles.defaultEngTitle} ${generateRandomNumber(1, 100000)}`

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        existingBannerData = await bannerActions.createBanner(requestBody, 201);
        bannerDocumentId = existingBannerData.data.documentId
        const response = await bannerActions.publishBanner(bannerDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustMatchTheFollowing);
      }
    );

    test(
      qase(120, 'Publish a Banner invalid long title'),
      async () => {
        bannerTitle = invalidNames.invalid57Name

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        const response = await bannerActions.publishBanner(bannerDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test(
      qase(121, 'Publish a Banner invalid short title'),
      async () => {
        bannerTitle = invalidNames.invalidShortName

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        const response = await bannerActions.publishBanner(bannerDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      }
    );

    test(
      qase(125, 'Update a Banner'),
      async () => {
        bannerTitle =  pageTitles.updatedTitle

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );

        const response = await bannerActions.updateBanner(bannerDocumentId, requestBody, 200)
        expect(response.data).toHaveProperty('status');
        expect(response.data.status).toBe('draft');
      }
    );

    test(
      qase(126, 'Update a Banner invalid long title'),
      async () => {
        bannerTitle = invalidNames.invalid57Name

        requestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink
        );
        const response = await bannerActions.updateBanner(bannerDocumentId, requestBody, 400)
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
        expect(response.error.message).toContain(errorTexts.mustBeAtMost);
      }
    );

    test(
      qase(131, 'Delete a Banner'),
      async () => {
        await bannerActions.deleteBanner(bannerDocumentId);
      }
    );
  });
});