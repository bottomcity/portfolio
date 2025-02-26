import { describe } from 'node:test';
import { pluralSlugs, singleSlugs } from '../enums/slugs';
import { authenticateAdmin, getFutureDates } from '../utils/utils';
import { appConfig } from '../config';
import { APIRequestContext, expect, test } from '@playwright/test';
import { PromoActions } from '../API-scenarios-actions/promo-actions';
import { promoBodyData, promoDescriptions } from '../enums/data-for-bodies';
import { qase } from 'playwright-qase-reporter';

let adminToken: string;
let apiContext: APIRequestContext;

describe('CMS and FE promo scenarios', () => {
  let pageType = singleSlugs.promoPage;
  let documentId: string;
  let pageSlug: string;
  let requestBody: any;
  let promoActions: PromoActions;
  let promoDocumentId: string;
  let stablePromo: string;
  let existingPromoData: any;
  const { startDate, endDate } = getFutureDates(7, 17);
  const promotionsURL = `${appConfig.SITE_URL}${pluralSlugs.promoPage}`;

  test.beforeAll(async () => {
    const authResult = await authenticateAdmin();
    adminToken = authResult.adminLoginToken;
    apiContext = authResult.apiContext;
    promoActions = new PromoActions(apiContext, adminToken);

    stablePromo = `stable promo for test ${Date.now().toString(36).replace(/\d/g, '')}`;
    const requestBody = await promoActions.preparePromoRequestBody(
      stablePromo,
      promoBodyData.descriptionForMechanics,
      promoBodyData.descriptionForTerms,
      promoDescriptions.defaultDescription,
      startDate,
      endDate
    );

    existingPromoData = await promoActions.createPromoEntry(requestBody, 201);
    documentId = existingPromoData.data.documentId
    await promoActions.publishPromoEntry(documentId, requestBody, 200);
  });

  test.afterEach(async () => {
    if (promoDocumentId) {
      await promoActions.deletePromoEntry(promoDocumentId);
    }
  })

  test.afterAll(async () => {
    if (documentId) {
      await promoActions.deletePromoEntry(documentId);
    }
  })


  test(
    qase(49, 'Check promotion does not exist, then create and publish a new promotion via admin API'),
    async ({ page }) => {
      const pageTitle = `${pageType} ${Date.now().toString(36).replace(/\d/g, '')}`
      pageSlug = pageTitle.replace(/ /g, '-');
      const promoPageSlug = `${pluralSlugs.promoPage}/${pageSlug}`
      const pageToCheck = `${appConfig.SITE_URL}${promoPageSlug}`;

      await test.step('Navigate to the promotion page and verify it does not exist', async () => {
        const response = await page.goto(pageToCheck, { waitUntil: 'networkidle' });
        const currentUrl = page.url();

        expect(response.status()).toBe(200);
        expect(currentUrl).not.toContain(`${pageSlug}`);
        expect(currentUrl).toBe(promotionsURL);
      });

      await test.step('Prepare the request body for the new promotion', async () => {
        requestBody = await promoActions.preparePromoRequestBody(
          pageTitle,
          promoBodyData.descriptionForMechanics,
          promoBodyData.descriptionForTerms,
          promoDescriptions.defaultDescription,
          startDate,
          endDate
        );
        expect(requestBody).toBeDefined();
      });

      await test.step('Create the new promotion via API', async () => {
        const promoData = await promoActions.createPromoEntry(requestBody, 201);
        promoDocumentId = promoData.data.documentId;
        expect(promoDocumentId).toBeDefined();
      });

      await test.step('Publish the promotion via API', async () => {
        await promoActions.publishPromoEntry(promoDocumentId, requestBody, 200);
      });

      await test.step('Navigate to the promotions page and verify it appears on promotions page', async () => {
        await page.waitForTimeout(30000);
        const responseAfterPublish = await page.goto(promotionsURL, { waitUntil: 'networkidle' });
        expect(responseAfterPublish.status()).toBe(200);
        await page.locator('[data-testid="close-modal-btn"]').click();
        await expect(page.locator('[data-testid="promo-card"]', { hasText: pageTitle})).toBeVisible();
        await expect(page.locator('[data-testid="promo-card"]', { hasText: pageTitle}))
          .toHaveAttribute('href', expect.stringContaining(promoPageSlug));
        await page.locator('a', { hasText: pageTitle }).click();
        await page.waitForURL(`**/${pageSlug}`, { timeout: 3000 });
        const createdPromoUrl = page.url();

        expect(createdPromoUrl).toContain(`${pageSlug}`);
      });

      await test.step('Open created promotion page and verify it opens', async () => {
        const responseAfterPublish = await page.goto(pageToCheck, { waitUntil: 'networkidle' });
        expect(responseAfterPublish.status()).toBe(200);
      });
    }
  );

  test(
    qase(52, 'Check promotion already exists, then update a promotion via admin API'),
    async ({ page }) => {
      pageSlug = `${pluralSlugs.promoPage}/${stablePromo.replace(/ /g, '-')}`;
      const pageToCheck = `${appConfig.SITE_URL}${pageSlug}`;
      const updatedTitle = `updated title ${stablePromo}`;
      const updatedPageSlug = `${pluralSlugs.promoPage}/${updatedTitle.replace(/ /g, '-')}`;
      const updatedPageToCheck = `${appConfig.SITE_URL}${updatedPageSlug}`;


      await test.step('Navigate to the promotions page and verify promotion for checking appears on promotions page', async () => {
        const responseAfterPublish = await page.goto(promotionsURL, { waitUntil: 'networkidle' });
        expect(responseAfterPublish.status()).toBe(200);
        await page.locator('[data-testid="close-modal-btn"]').click();
        await expect(page.locator('[data-testid="promo-card"]', { hasText: stablePromo}))
          .toBeVisible();
        await expect(page.locator('[data-testid="promo-card"]', { hasText: stablePromo}))
          .toHaveAttribute('href', expect.stringContaining(pageSlug));
        await page.locator('[data-testid="promo-card"]', { hasText: stablePromo }).click({ delay: 5000 });
        await page.waitForURL(`**/${pageSlug}`, { timeout: 3000 });
        expect(page.url()).toContain(`${pageSlug}`);
      });

      await test.step('Navigate to the promotion for checking page and verify it exists', async () => {
        await page.waitForTimeout(30000);
        const response = await page.goto(pageToCheck, { waitUntil: 'networkidle' });
        const currentUrl = page.url();

        expect(response.status()).toBe(200);
        expect(currentUrl).toContain(`${pageSlug}`);
        expect(currentUrl).toBe(pageToCheck);
      });

      await test.step('Prepare the updated request body for the promotion', async () => {
        requestBody = await promoActions.preparePromoRequestBody(
          updatedTitle,
          promoBodyData.descriptionForMechanics,
          promoBodyData.descriptionForTerms,
          promoDescriptions.defaultDescription,
          startDate,
          endDate
        );
        expect(requestBody).toBeDefined();
      });

      await test.step('Update the promotion via API', async () => {
        const updatedPromoData = await promoActions.updatePromoEntry(documentId, requestBody, 200);
        promoDocumentId = updatedPromoData.data.documentId
        expect(promoDocumentId).toBeDefined();
      });

      await test.step('Publish updated promotion via API', async () => {
        await promoActions.publishPromoEntry(promoDocumentId, requestBody, 200);
      });

      await test.step('Navigate to the promotions page and verify promotion for checking is updated on promotions page', async () => {
        await page.waitForTimeout(10000);
        await page.goto(promotionsURL, { waitUntil: 'networkidle' });
        await expect(page.locator('[data-testid="promo-card"]', { hasText: updatedTitle}))
          .toBeVisible();
        await expect(page.locator('[data-testid="promo-card"]', { hasText: updatedTitle}))
          .toHaveAttribute('href', expect.stringContaining(updatedPageSlug));
        await page.locator('[data-testid="promo-card"]', { hasText: updatedTitle})
          .click();
      });

      await test.step('Verify promotion page reflects the update', async () => {
        await page.waitForTimeout(2000);
        const createdPromoUrl = page.url();
        expect(createdPromoUrl).toContain(`${updatedPageSlug}`)
        await page.goto(updatedPageToCheck, { waitUntil: 'networkidle' });
        await expect(page.locator('h1', { hasText: updatedTitle})).toBeVisible();
      });
    }
  );

  test(
    qase(51, 'Create a new promotion as a draft via admin API'),
    async ({ page }) => {
      const pageTitle = `${pageType} ${Date.now().toString(36).replace(/\d/g, '')}`
      pageSlug = pageTitle.replace(/ /g, '-');
      const pageToCheck = `${appConfig.SITE_URL}${pluralSlugs.promoPage}/${pageSlug}`;

      await test.step('Prepare the request body for a draft promotion', async () => {
        requestBody = await promoActions.preparePromoRequestBody(
          pageSlug,
          promoBodyData.descriptionForMechanics,
          promoBodyData.descriptionForTerms,
          promoDescriptions.defaultDescription,
          startDate,
          endDate
        );
        expect(requestBody).toBeDefined();
      });

      await test.step('Create the draft promotion via API', async () => {
        const draftData = await promoActions.createPromoEntry(requestBody, 201);
        promoDocumentId = draftData.data.documentId;
        expect(promoDocumentId).toBeDefined();
      });

      await test.step('Navigate to the drafted promotion page and verify it does not exist', async () => {
        const response = await page.goto(pageToCheck, { waitUntil: 'networkidle' });
        const currentUrl = page.url();

        expect(response.status()).toBe(200);
        expect(currentUrl).not.toContain(`${pageSlug}`);
        expect(currentUrl).toBe(promotionsURL);
      });

      await test.step('Navigate to the promotions page and verify draft promotion does not appear on promotions page', async () => {
        await page.waitForTimeout(2000);
        await page.goto(promotionsURL, { waitUntil: 'networkidle' });
        const promoCards = page.locator('[data-testid="promo-card"]');
        const count = await promoCards.count();

        for (let i = 0; i < count; i++) {
          const href = await promoCards.nth(i).getAttribute('href');
          expect(href).not.toContain(pageSlug);
        }
        documentId = null // to pass afterEach webhook
      });
    }
  );
});