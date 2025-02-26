import { appConfig } from '../config';
import { qase } from 'playwright-qase-reporter';
import { test, expect, APIRequestContext } from '@playwright/test';
import { authenticateAdmin, bodyContentHTML, waitForPageWithAssertions } from '../utils/utils';
import { describe } from 'node:test';
import { ArticlePageActions } from '../API-scenarios-actions/article-page-actions';
import {
  articlesCategory,
  pageDescriptions,
  pageTitles
} from '../enums/data-for-bodies';
import { pluralSlugs, singleSlugs } from '../enums/slugs';
import { FileActions } from '../API-scenarios-actions/file-actions';
import { CustomPage } from '../pages-scenarios-actions/page-helper';

let adminToken: string;
let apiContext: APIRequestContext;
let stableArticle: string
let pageSlug: string;
let requestBody: any;
let articleActions: ArticlePageActions;
let fileActions: FileActions;
let existingPageData: any;
let imageData: any;
let documentId: string;
let articleDocumentId: string;
let timestamp: number;

describe('CMS and FE scenarios for custom articles', () => {

  test.beforeAll(async () => {
    const authResult = await authenticateAdmin();
    adminToken = authResult.adminLoginToken;
    apiContext = authResult.apiContext;

    articleActions = new ArticlePageActions(apiContext, adminToken, singleSlugs.articlePage);

    stableArticle = `stable-page-for-test-${Date.now()}`;
    const requestBody = await articleActions.preparePageRequestBody(
      stableArticle,
      pageTitles.stableEngTitle,
      bodyContentHTML(pageTitles.stableEngTitle),
      pageDescriptions.defaultDescription
    );

    existingPageData = await articleActions.createPageEntry(requestBody, 201);
    documentId = existingPageData.data.documentId;
    await articleActions.publishPageEntry(existingPageData.data.documentId, requestBody, 200);
  });

  test.beforeEach(async () => {
    timestamp = Date.now();
    pageSlug = `test-page-${Date.now()}`;
  });

  test.afterEach(async () => {
    if (articleDocumentId) {
      await articleActions.deletePageEntry(articleDocumentId);
    }
  });
  test.afterAll(async () => {
    if (documentId) {
      await articleActions.deletePageEntry(documentId);
    }  });

  test('@smoke Check article does not exist, then create and publish a new article via admin API', async ({ page }) => {
    qase.id(3);
    qase.title('Check article does not exist, then create and publish a new article via admin API');
    qase.suite('smoke suite');

    const customPage = new CustomPage(page);
    const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${pageSlug}`;
    const pageTitle = `${pageTitles.defaultEngTitle}${timestamp}`
    const pageDescription = `${pageDescriptions.defaultDescription}${timestamp}`

    await test.step('Verify the page does not exist initially', async () => {
      await waitForPageWithAssertions(page, pageUrl, 404, async () => {
        await customPage.verifyPageDoesNotExist();
      });
    });

    await test.step('Create and Publish the new article via API', async () => {
        requestBody = await articleActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle),
          pageDescription,
        );
        expect(requestBody).toBeDefined();
        existingPageData = await articleActions.createPageEntry(requestBody, 201);
        articleDocumentId = existingPageData.data.documentId
        expect(articleDocumentId).toBeDefined();

        await articleActions.publishPageEntry(articleDocumentId, requestBody, 200);
      });

    await test.step('Verify the published page exists', async () => {
      await waitForPageWithAssertions(page, pageUrl, 200, async () => {
        await customPage.verifyPageExists(pageTitle, pageDescription);
        });
      });
    }
  );

  test('@regression Check article already exists, then update a article via admin API', async ({ page }) => {
    qase.id(4);
    qase.title('Check article already exists, then update a article via admin API');
    qase.suite('regression suite');
      const customPage = new CustomPage(page);
      const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${stableArticle}`;

      await test.step('Verify the page exists', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageExists(pageTitles.stableEngTitle, pageDescriptions.defaultDescription);
        });
      });

      await test.step('Update the page via API', async () => {
        const updatedData = {
          slug: stableArticle,
          title: pageTitles.updatedTitle,
          body: bodyContentHTML(pageTitles.updatedTitle),
          category: articlesCategory.sports
        };

        const response = await articleActions.updatePageEntry(documentId, updatedData, 200);
        documentId = response.data.documentId;

        await articleActions.publishPageEntry(documentId, updatedData, 200);
      });

      await test.step('Verify the updated page reflects on the frontend', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
         await customPage.verifyPageTitle(pageTitles.updatedTitle);
        });
      });
    }
  );

  test('@regression should unpublish a article and verify it becomes inaccessible', async ({ page }) => {
    qase.id(1);
    qase.title('should unpublish a article and verify it becomes inaccessible');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);
    pageSlug = `unpublish-page-${Date.now()}`;
    const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${pageSlug}`;

      await test.step('Create and publish the page', async () => {
        const requestBody = await articleActions.preparePageRequestBody(
          pageSlug,
          pageTitles.unpublishPageTitle,
          bodyContentHTML(pageTitles.unpublishPageTitle),
          pageDescriptions.defaultDescription,
        );

        const pageData = await articleActions.createPageEntry(requestBody, 201);
        articleDocumentId = pageData.data.documentId;

        await articleActions.publishPageEntry(articleDocumentId, requestBody, 200);
      });

      await test.step('Verify the page is published', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageTitle(pageTitles.unpublishPageTitle);
        });
      });

      await test.step('Unpublish the page via API', async () => {
        await articleActions.unpublishPageEntry(articleDocumentId);
      });

      await test.step('Verify the unpublished page is inaccessible', async () => {
        await waitForPageWithAssertions(
          page,
          pageUrl,
          404,
          async () => {
            await customPage.verifyPageDoesNotExist();
          });
      });
    },
  );

  test('@regression should not access a draft article and verify it becomes accessible after publishing', async ({ page }) => {
    qase.id(1);
    qase.title('should not access a draft article and verify it becomes accessible after publishing');
    qase.suite('regression suite');
      const customPage = new CustomPage(page);
      pageSlug = `test-draft-article-${Date.now()}`;
      const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${pageSlug}`;

      await test.step('Prepare and create a draft Page via API', async () => {
        requestBody = await articleActions.preparePageRequestBody(
          pageSlug,
          pageTitles.draftPageTitle,
          bodyContentHTML(pageTitles.draftPageTitle),
          pageDescriptions.defaultDescription
        );
        const response = await articleActions.createPageEntry(requestBody, 201);
        articleDocumentId = response.data.documentId;
      });

      await test.step('Verify the draft page is inaccessible', async () => {
        await waitForPageWithAssertions(
          page,
          pageUrl,
          404,
          async () => {
            await customPage.verifyPageDoesNotExist();
          });
      });

      await test.step('Publish the Page via API', async () => {
        await articleActions.publishPageEntry(articleDocumentId, requestBody, 200);
      });

      await test.step('Verify the published page is accessible', async () => {
        await waitForPageWithAssertions(
          page,
          pageUrl,
          200,
          async () => {
            await customPage.verifyPageTitle(pageTitles.draftPageTitle);
          }
        );
      });
    }
  );

  test('@regression Verify Deleting a article Removes It from the Frontend', async ({ page }) => {
    qase.id(7);
    qase.title('Verify Verify Deleting a article Removes It from the Frontend\'');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);
    const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${stableArticle}`;

      await test.step('Verify the page exists', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageExists(pageTitles.stableEngTitle, pageDescriptions.defaultDescription);
        });
      });

      await test.step('Delete the article via API', async () => {
        await articleActions.deletePageEntry(documentId);
      });

      await test.step('Verify the article no longer exists on the frontend', async () => {
        await waitForPageWithAssertions(
          page,
          pageUrl,
          200,
          async () => {
            await customPage.verifyPageTitle(pageTitles.stableEngTitle);
          }
        );
        documentId = null // to pass afterEach webhook
      });
    }
  );

  test.skip(
    qase(1, '@regression Verify Scheduled Publishing of an article'),
    async ({ page }) => {
      pageSlug = `scheduled-blog-${Date.now()}`;
      const scheduledDate = new Date(Date.now()).toISOString();
      const pageToCheck = `${appConfig.SITE_URL}/${pageSlug}`;

      await test.step('Verify the article does not exist initially', async () => {
        const response = await page.goto(pageToCheck, { waitUntil: 'networkidle' });
        expect(response.status()).toBe(404);
      });

      await test.step('Create a article with a scheduled publish date via API', async () => {
        const requestBody = await articleActions.preparePageRequestBody(
          pageSlug,
          pageTitles.scheduledPageTitle,
          bodyContentHTML(pageTitles.scheduledPageTitle),
          pageDescriptions.defaultDescription,
          scheduledDate
        );
        const blogData = await articleActions.createPageEntry(requestBody, 201);
        documentId = blogData.documentId;
      });

      await test.step('Wait until the scheduled publish time', async () => {
        const waitTime = new Date(scheduledDate).getTime() - Date.now() + 50000;
        await page.waitForTimeout(waitTime);
      });

      await test.step('Verify the article is now accessible on the frontend', async () => {
        const responseAfterPublish = await page.goto(pageToCheck, { waitUntil: 'networkidle' });
        expect(responseAfterPublish.status()).toBe(200);
        await expect(page.locator('h1', { hasText: pageTitles.scheduledPageTitle})).toBeVisible();
      });
    }
  );

  test('@smoke Verify Deleting a article Removes It from the Frontend', async ({ page }) => {
    qase.id(7);
    qase.title('Verify Deleting a article Removes It from the Frontend\'');
    qase.suite('smoke suite');
      let uploadedImageUrl: string;
      const linkedImageUrl = 'https://r.bing.com/rp/WolXT0CQYS0wYqf6yEezati6rBo.png'
      const customPage = new CustomPage(page);
      const pageTitle = `${pageTitles.pageWithImage}${timestamp}`
      const pageDescription = `${pageDescriptions.defaultDescription}${timestamp}`
      const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${pageSlug}`;

      await test.step('Upload an image via API', async () => {
        imageData = await fileActions.uploadImage('test-image.jpg');
        uploadedImageUrl = imageData.url
      });

      await test.step('Create and Publish the article with images via API', async () => {
        const requestBody = await articleActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle, uploadedImageUrl, linkedImageUrl),
          pageDescriptions.defaultDescription
        );

        expect(requestBody).toBeDefined();
        existingPageData = await articleActions.createPageEntry(requestBody, 201);
        articleDocumentId = existingPageData.data.documentId
        expect(articleDocumentId).toBeDefined();

        await articleActions.publishPageEntry(articleDocumentId, requestBody, 200);
      });

      await test.step('Publish the article via API', async () => {
        await articleActions.publishPageEntry(documentId, requestBody, 200);
      });

      await test.step('Verify the published page exists', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageExists(pageTitle, pageDescription);
        });
      });

      await test.step('Verify the uploaded image is displayed on the frontend', async () => {
        await waitForPageWithAssertions(
          page,
          pageUrl,
          200,
          async () => {
            await customPage.verifyImageIsVisible(uploadedImageUrl);
            await customPage.verifyImageIsVisible(linkedImageUrl);
          }
        );
      });
    }
  );

  test(
    qase(2, '@regression Verify Updating SEO Metadata Reflects on Frontend for custom article'),
    async ({ page }) => {
      const customPage = new CustomPage(page);
      pageSlug = `seo-article-${timestamp}`;
      const pageTitle = `${pageTitles.seoPage}${timestamp}`
      const updatedPageTitle = `${pageTitles.updatedTitle}${timestamp}`
      const pageDescription = `${pageDescriptions.initialMetaDescription}${timestamp}`
      const updatedPageDescription = `${pageDescriptions.updatedMetaDescription}${timestamp}`
      const pageUrl = `${appConfig.SITE_URL}/${pluralSlugs.articlePage}/${articlesCategory.sports}/${pageSlug}`;

      await test.step('Create English page entry via API', async () => {
        const requestBody = await articleActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle),
          pageDescription
        );
        const pageData = await articleActions.createPageEntry(requestBody, 201);
        articleDocumentId = pageData.data.documentId;

        await articleActions.publishPageEntry(articleDocumentId, requestBody, 200);
      });

      await test.step('Verify SEO Metadata on frontend', async () => {
        await customPage.navigateTo(pageUrl);
        await waitForPageWithAssertions(
          page,
          pageUrl,
          200,
          async () => {
            await customPage.verifyPageTitle(pageTitle);
            await customPage.verifyMetaDescription(pageDescription);
            await customPage.verifyMetaOgTitle(pageTitle);
            await customPage.verifyMetaOgDescription(pageDescription);
            await customPage.verifyMetaKeywords(pageDescription)
        }
      );
    });

      await test.step('Update SEO metadata of the page via API', async () => {
        const updatedData = {
          slug: pageSlug,
          title: updatedPageTitle,
          body: bodyContentHTML(updatedPageDescription),
          category: articlesCategory.sports
        };

        const response = await articleActions.updatePageEntry(articleDocumentId, updatedData, 200);
        articleDocumentId = response.data.documentId;

        await articleActions.publishPageEntry(articleDocumentId, updatedData, 200);
      });

      await test.step('Verify SEO Metadata on frontend', async () => {
        await customPage.navigateTo(pageUrl);
        await waitForPageWithAssertions(
          page,
          pageUrl,
          200,
          async () => {
            await customPage.verifyPageTitle(updatedPageTitle);
            await customPage.verifyMetaDescription(updatedPageDescription);
            await customPage.verifyMetaOgTitle(updatedPageTitle);
            await customPage.verifyMetaOgDescription(updatedPageDescription);
            await customPage.verifyMetaKeywords(updatedPageDescription)
          }
        );
      });
  });
});