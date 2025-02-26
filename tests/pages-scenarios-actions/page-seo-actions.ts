import { SingleTypeActions } from '../API-scenarios-actions/single-type-actions';
import { expect, Page } from '@playwright/test';
import { extractSeoMeta } from '../utils/utils';

export class PageSeoActions {
  private singleTypeActions: SingleTypeActions;

  constructor(singleTypeActions: SingleTypeActions) {
    this.singleTypeActions = singleTypeActions;
  }

  async extractSeoMetadata(page: Page, pageUrl: string) {
    await page.route('**/*.{png,jpg,webp}', (route) => route.abort());
    await page.goto(pageUrl);
    const existingSeoData = await extractSeoMeta(page);

    for (const key in existingSeoData) {
      expect(existingSeoData[key as keyof typeof existingSeoData]).toBeDefined();
    }

    return existingSeoData;
  }

  async publishPage(contentType: string, requestBody: any, locale: string = 'en') {
    return this.singleTypeActions.publishSingleEntry(requestBody, contentType, locale);
  }

  async updatePage(contentType: string, title: string, description: string, locale: string = 'en') {
    return this.singleTypeActions.updateSingleEntry(contentType, { title, description }, locale);
  }

  async verifySeoMetadata(
    page: Page,
    pageUrl: string,
    expectedTitle: string,
    expectedDescription: string | number,
    shouldMatch: boolean
  ) {
    await expect(async () => {
      await page.route('**/*.{png,jpg,webp}', (route) => route.abort());
      await page.goto(pageUrl);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      const metaSectionTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const metaSectionDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      const metaSectionKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
      const pageTitle = await page.title();

      console.log('DEBUG: Frontend Title:', pageTitle);
      console.log('DEBUG: Frontend Meta Description:', metaDescription);

      if (shouldMatch) {
        expect(pageTitle).toContain(expectedTitle);
        expect(metaDescription).toContain(expectedDescription);
        expect(metaSectionTitle).toContain(expectedTitle);
        expect(metaSectionDescription).toContain(expectedDescription);
        expect(metaSectionKeywords).toContain(expectedDescription);
      } else {
        expect(pageTitle).not.toContain(expectedTitle);
        expect(metaDescription).not.toBe(expectedDescription);
      }
    }).toPass({
      timeout: 31000,
      intervals: [2000],
    });
  }
}