import { appConfig } from '../config';
import { qase } from 'playwright-qase-reporter';
import { test, expect, APIRequestContext } from '@playwright/test';
import { authenticateAdmin, bodyContentHTML, waitForPageWithAssertions } from '../utils/utils';
import { describe } from 'node:test';
import { ArticlePageActions } from '../API-scenarios-actions/article-page-actions';
import {
  pageDescriptions,
  locales,
  pageTitles,
  promoBannerTitles, articlesCategory
} from '../enums/data-for-bodies';
import { pluralSlugs, singleSlugs } from '../enums/slugs';
import { FileActions } from '../API-scenarios-actions/file-actions';
import { BannerActions } from '../API-scenarios-actions/banner-actions';
import { BannerHelper } from '../pages-scenarios-actions/banner-helper';
import { CustomPage } from '../pages-scenarios-actions/page-helper';

let adminToken: string;
let apiContext: APIRequestContext;
let stablePage: string;
let pageSlug: string;
let requestBody: any = null;
let pageActions: ArticlePageActions;
let fileActions: FileActions;
let existingPageData: any = null;
let updatedPageData: any = null;
let timestamp: number;
let imageData: any;
let documentId: string | null = null;
let pageDocumentId: string | null = null;
let documentIds: string[] = [];

test.describe.configure({ mode: 'serial' });

describe('CMS and FE scenarios for custom pages', () => {
  test.beforeAll(async () => {
    const authResult = await authenticateAdmin();
    adminToken = authResult.adminLoginToken;
    apiContext = authResult.apiContext;
    pageActions = new ArticlePageActions(apiContext, adminToken, singleSlugs.pagePage);
    fileActions = new FileActions(apiContext, adminToken);

    stablePage = `stable-page-for-test-${Date.now()}`;
    const requestBody = await pageActions.preparePageRequestBody(
      stablePage,
      pageTitles.stableEngTitle,
      bodyContentHTML(pageTitles.stableEngTitle),
      pageDescriptions.defaultDescription,
    );

    existingPageData = await pageActions.createPageEntry(requestBody, 201);
    documentId = existingPageData.data.documentId;
    await pageActions.publishPageEntry(documentId, requestBody, 200);
  });

  test.beforeEach(async () => {
    timestamp = Date.now();
  });

  test.afterEach(async () => {
    if (pageDocumentId) {
      await pageActions.deletePageEntry(pageDocumentId);
      pageDocumentId = null;
    }
  });

  test.afterAll(async () => {
    if (documentId) {
      await pageActions.deletePageEntry(documentId);
    }
  });

  test('@smoke Check page does not exist, then create and publish a new Page via admin API', async ({ page }) => {
    qase.id(13);
    qase.title('Check page does not exist, then create and publish a new Page via admin API');
    qase.suite('smoke suite');
    const customPage = new CustomPage(page);
      const pageSlug = `test-page-${Date.now()}`;
      const pageUrl = `${appConfig.SITE_URL}/${pageSlug}`;

      await test.step('Verify the page does not exist initially', async () => {
        await waitForPageWithAssertions(page, pageUrl, 404, async () => {
          await customPage.verifyPageDoesNotExist();
        });
      });

      await test.step('Create and publish the page via API', async () => {
        const requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitles.defaultEngTitle,
          bodyContentHTML(pageTitles.defaultEngTitle),
          pageDescriptions.defaultDescription,
        );

        const pageData = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = pageData.data.documentId;

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
      });

      await test.step('Verify the published page exists', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageExists(pageTitles.defaultEngTitle, pageDescriptions.defaultDescription);
        });
      });
    },
  );

  test('@regression Check page already exists, then update a Page via admin API', async ({ page }) => {
    qase.id(14);
    qase.title('Check page already exists, then update a Page via admin API');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);
      const pageUrl = `${appConfig.SITE_URL}/${stablePage}`;

      await test.step('Verify the page exists', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageExists(pageTitles.stableEngTitle, pageDescriptions.defaultDescription);
        });
      });

      await test.step('Update the page via API', async () => {
        const updatedData = {
          slug: stablePage,
          title: pageTitles.updatedTitle,
          body: bodyContentHTML(pageTitles.updatedTitle),
        };

        const response = await pageActions.updatePageEntry(documentId, updatedData, 200);
        documentId = response.data.documentId;

        await pageActions.publishPageEntry(documentId, updatedData, 200);
      });

      await test.step('Verify the updated page reflects on the frontend', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageTitle(pageTitles.updatedTitle);
        });
      });
    },
  );

  test('@regression should unpublish a page and verify it becomes inaccessible', async ({ page }) => {
    qase.id(15);
    qase.title('should unpublish a page and verify it becomes inaccessible');
    qase.suite('regression suite');
      const customPage = new CustomPage(page);
      const pageSlug = `unpublish-page-${Date.now()}`;
      const pageUrl = `${appConfig.SITE_URL}/${pageSlug}`;

      await test.step('Create and publish the page', async () => {
        const requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitles.unpublishPageTitle,
          bodyContentHTML(pageTitles.unpublishPageTitle),
          pageDescriptions.defaultDescription,
        );

        const pageData = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = pageData.data.documentId;

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
      });

      await test.step('Verify the page is published', async () => {
        await waitForPageWithAssertions(page, pageUrl, 200, async () => {
          await customPage.verifyPageTitle(pageTitles.unpublishPageTitle);
        });
      });

      await test.step('Unpublish the page via API', async () => {
        await pageActions.unpublishPageEntry(pageDocumentId);
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

  test('@regression Draft page should be inaccessible, and accessible after publishing', async ({ page }) => {
    qase.id(16);
    qase.title('Draft page should be inaccessible, and accessible after publishing');
    qase.suite('regression suite');

      const customPage = new CustomPage(page);
      pageSlug = `test-draft-page-${Date.now()}`;
      const pageToCheck = `${appConfig.SITE_URL}/${pageSlug}`;

      await test.step('Prepare and create a draft Page via API', async () => {
        requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitles.draftPageTitle,
          bodyContentHTML(pageTitles.draftPageTitle),
          pageDescriptions.defaultDescription
        );
        const response = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = response.data.documentId;
      });

      await test.step('Verify the draft page is inaccessible', async () => {
        await waitForPageWithAssertions(
          page,
          pageToCheck,
          404,
          async () => {
            await customPage.verifyPageDoesNotExist();
          });
      });

      await test.step('Publish the Page via API', async () => {
        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
      });

      await test.step('Verify the published page is accessible', async () => {
        await waitForPageWithAssertions(
          page,
          pageToCheck,
          200,
          async () => {
            await customPage.verifyPageTitle(pageTitles.draftPageTitle);
          }
        );
      });
    }
  );

  test('@regression Verify Deleting a Page Entry Removes It from the Frontend', async ({ page }) => {
    qase.id(17);
    qase.title('Verify Deleting a Page Entry Removes It from the Frontend');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);
    const pageUrl = `${appConfig.SITE_URL}/${stablePage}`;

    await test.step('Verify the page exists', async () => {
      await waitForPageWithAssertions(page, pageUrl, 200, async () => {
        await customPage.verifyPageExists(pageTitles.stableEngTitle, pageDescriptions.defaultDescription);
      });
    });

      await test.step('Delete the article via API', async () => {
        await pageActions.deletePageEntry(documentId);
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

  test(
    qase(19, '@smoke Verify Media Upload and Display in Page'),
    async ({ page }) => {
      let uploadedImageUrl: string;
      const linkedImageUrl = 'https://r.bing.com/rp/WolXT0CQYS0wYqf6yEezati6rBo.png'
      const customPage = new CustomPage(page);
      const pageTitle = `${pageTitles.pageWithImage}${Date.now()}`
      const pageDescription = `${pageDescriptions.defaultDescription}${Date.now()}`
      const pageUrl = `${appConfig.SITE_URL}/${pageSlug}`;

      await test.step('Upload an image via API', async () => {
        imageData = await fileActions.uploadImage('test-image.jpg');
        uploadedImageUrl = imageData.url
      });

      await test.step('Create and Publish the article with images via API', async () => {
        const requestBody = await pageActions.preparePageRequestBody(
          pageUrl,
          pageTitle,
          bodyContentHTML(pageTitle, uploadedImageUrl, linkedImageUrl),
          pageDescriptions.defaultDescription
        );

        expect(requestBody).toBeDefined();
        existingPageData = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = existingPageData.data.documentId
        expect(pageDocumentId).toBeDefined();

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
      });

      await test.step('Publish the article via API', async () => {
        await pageActions.publishPageEntry(documentId, requestBody, 200);
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
        const requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle),
          pageDescription
        );
        const pageData = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = pageData.data.documentId;

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
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

        const response = await pageActions.updatePageEntry(pageDocumentId, updatedData, 200);
        pageDocumentId = response.data.documentId;

        await pageActions.publishPageEntry(pageDocumentId, updatedData, 200);
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

  test.skip('@regression Verify Scheduled Publishing of a Page', async ({ page }) => {
    qase.id(18);
    qase.title('Verify Scheduled Publishing of a Page');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);

      pageSlug = `scheduled-page-${Date.now()}`;
      const scheduledDate = new Date(Date.now() + 60000).toISOString();
      const pageToCheck = `${appConfig.SITE_URL}/${pageSlug}`;

      await test.step('Create a Page with a scheduled publish date via API', async () => {
        requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitles.scheduledPageTitle,
          bodyContentHTML(pageTitles.scheduledPageTitle),
          pageDescriptions.defaultDescription,
          scheduledDate
        );
        const response = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = response.data.documentId;
      });

      await test.step('Wait until the scheduled publish time', async () => {
        const waitTime = new Date(scheduledDate).getTime() - Date.now() + 65000;
        await page.waitForTimeout(waitTime);
      });

      await test.step('Verify the scheduled page is now accessible', async () => {
        await waitForPageWithAssertions(
          page,
          pageToCheck,
          200,
          async () => {
            await customPage.verifyPageTitle(pageTitles.scheduledPageTitle);
          }
        );
      });
    }
  );

  test.skip('@regression Verify Pagination of Page Listings on Frontend', async ({ page }) => {
    qase.id(21);
    qase.title('Verify Pagination of Page Listings on Frontend');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);
      const totalPages = 15; // Total pages to create
      const pagesPerPage = 5; // Number of pages displayed per pagination page
      const basePageUrl = `${appConfig.SITE_URL}/pages`;

      // Step 1: Create multiple pages via API
      await test.step('Create multiple pages via API', async () => {
        for (let i = 1; i <= totalPages; i++) {
          const pageSlug = `paginated-page-${i}`;
          const requestBody = await pageActions.preparePageRequestBody(
            pageSlug,
            `${pageTitles.defaultEngTitle} ${i}`,
            bodyContentHTML(`${pageTitles.defaultEngTitle} ${i}`), // Generate body content dynamically
            pageDescriptions.defaultDescription
          );
          const pageData = await pageActions.createPageEntry(requestBody, 201);
          documentIds.push(pageData.data.documentId);
          await pageActions.publishPageEntry(pageData.data.documentId, requestBody, 200);
        }
      });

      // Step 2: Verify first page displays the correct set of pages
      await test.step('Verify the first page displays the correct set of pages', async () => {
        await waitForPageWithAssertions(page, `${basePageUrl}?page=1`, 200, async () => {
          for (let i = 1; i <= pagesPerPage; i++) {
            await customPage.verifyPageVisible(`Paginated Page ${i}`);
          }
        });
      });

      // Step 3: Verify the second page displays the next set of pages
      await test.step('Verify the second page displays the next set of pages', async () => {
        await waitForPageWithAssertions(page, `${basePageUrl}?page=2`, 200, async () => {
          for (let i = 6; i <= 10; i++) {
            await customPage.verifyPageVisible(`Paginated Page ${i}`);
          }
        });
      });

      // Step 4: Verify the last page displays the remaining pages
      await test.step('Verify the last page displays the remaining pages', async () => {
        await waitForPageWithAssertions(page, `${basePageUrl}?page=3`, 200, async () => {
          for (let i = 11; i <= totalPages; i++) {
            await customPage.verifyPageVisible(`Paginated Page ${i}`);
          }
        });
      });

      // Step 5: Clean up by deleting all created pages
      await test.step('Clean up by deleting all created pages', async () => {
        for (const documentId of documentIds) {
          await pageActions.deletePageEntry(documentId);
        }
      });
    }
  );

  test.skip('@regression Verify Search Functionality for Page Entries', async ({ page }) => {
    qase.id(27);
    qase.title('Verify Search Functionality for Page Entries');
    qase.suite('regression suite');
    const customPage = new CustomPage(page);
      const uniqueTitle = 'UniqueSearchPage';
      const nonExistentTitle = 'NonExistentPage123';

      // Step 1: Create a page with a unique keyword via API
      await test.step('Create a Page with a unique keyword via API', async () => {

        const requestBody = await pageActions.preparePageRequestBody(
          `test-search-page-${Date.now()}`,
          uniqueTitle,
          bodyContentHTML(uniqueTitle),
          pageDescriptions.defaultDescription
        );
        const pageData = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = pageData.data.documentId;
        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
      });

      // Step 2: Search for the unique page and verify it appears in results
      await test.step('Search for the unique Page and verify it appears in results', async () => {
        await customPage.navigateTo(`${appConfig.SITE_URL}/pages`);
        await customPage.performSearch(uniqueTitle);
        await customPage.verifyPageVisible(uniqueTitle);
      });

      // Step 3: Search for a non-existent page and verify no results are shown
      await test.step('Search for a non-existent Page and verify no results are shown', async () => {
        await customPage.navigateTo(`${appConfig.SITE_URL}/pages`);
        await customPage.performSearch(nonExistentTitle);
        await customPage.verifyPageNotVisible(nonExistentTitle);
      });

      // Step 4: Clean up by deleting the created page entry
      await test.step('Clean up by deleting the created Page', async () => {
        await pageActions.deletePageEntry(pageDocumentId);
      });
    }
  );
});

describe('CMS and FE Localization scenarios', () => {
  const timestamp = Date.now();
  test.afterEach(async () => {
    if (pageDocumentId) {
      await pageActions.deletePageEntry(pageDocumentId);
      pageDocumentId = null;
      documentId = null;
    }
  });

  test.afterAll(async () => {
    for (const documentId of documentIds) {
      await pageActions.deletePageEntry(documentId);
    }
  });

  test('@smoke Verify English Localization Support', async ({ page }) => {
    qase.id(26);
    qase.title('Verify English Localization Support');
    qase.suite('smoke suite');
    const customPage = new CustomPage(page);
    const pageSlug = `localized-page`;
    const pageToCheck = `${appConfig.SITE_URL}/${locales.defaultLocale}/${pageSlug}`;
    const pageTitle = `${pageTitles.defaultEngTitle}${timestamp}`
    const pageDescription = `${pageDescriptions.defaultDescription}${timestamp}`

    await test.step('Create English page entry via API', async () => {
        const requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle),
          pageDescription
        );
        const pageData = await pageActions.createPageEntry(requestBody, 201);
        pageDocumentId = pageData.data.documentId;

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200);
      });

      await test.step('Verify English localization on frontend', async () => {
        await customPage.navigateTo(pageToCheck);
        await waitForPageWithAssertions(
          page,
          pageToCheck,
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
    }
  );

  test('@smoke Verify Korean Localization Support', async ({ page }) => {
    qase.id(24);
    qase.title('Verify Korean Localization Support');
    qase.suite('smoke suite');
    const customPage = new CustomPage(page);
    const pageSlug = `localized-ko-page`;
    const pageToCheck = `${appConfig.SITE_URL}/${locales.koreanFELocale}/${pageSlug}`;
    const pageTitle = `${pageTitles.koreanTitle}${timestamp}`
    const pageDescription = `${pageDescriptions.defaultKoreanDescription}${timestamp}`

      await test.step('Create Korean page entry via API', async () => {
        const requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle),
          pageDescription
        );
        const blogData = await pageActions.createPageEntry(requestBody, 201, locales.koreanCMSLocale);
        pageDocumentId = blogData.data.documentId;
        documentIds.push(pageDocumentId);

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200, locales.koreanCMSLocale);
      });

      await test.step('Verify English localization on frontend', async () => {
        await customPage.navigateTo(pageToCheck);
        await waitForPageWithAssertions(
          page,
          pageToCheck,
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
    }
  );

  test('@smoke Verify Chinese Localization Support', async ({ page }) => {
    qase.id(25);
    qase.title('Verify Chinese Localization Support');
    qase.suite('smoke suite');
    const customPage = new CustomPage(page);
    const pageSlug = 'localized-cn-blog';
    const pageToCheck = `${appConfig.SITE_URL}/${locales.chineseFELocale}/${pageSlug}`;
    const pageTitle = `${pageTitles.chineseTitle}${timestamp}`
    const pageDescription = `${pageDescriptions.defaultChineseDescription}${timestamp}`

      await test.step('Create Chinese page entry via API', async () => {
        const requestBody = await pageActions.preparePageRequestBody(
          pageSlug,
          pageTitle,
          bodyContentHTML(pageTitle),
          pageDescription
        );
        const blogData = await pageActions.createPageEntry(requestBody, 201, locales.chineseCMSLocale);
        pageDocumentId = blogData.data.documentId;
        documentIds.push(pageDocumentId);

        await pageActions.publishPageEntry(pageDocumentId, requestBody, 200, locales.chineseCMSLocale);
      });

      await test.step('Verify English localization on frontend', async () => {
        await customPage.navigateTo(pageToCheck);
        await waitForPageWithAssertions(
          page,
          pageToCheck,
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
    }
  );
});

describe('CMS and FE banner scenarios', () => {
  let bannerActions: BannerActions;
  let bannerDocumentId: string;
  let stableBannerDocumentId: string;
  let stableBannerId: number;
  let stableBannerPageDocumentId: string;
  let bannerId: number;
  let bannerBtnLink: string = '/login';
  let bannerButtonLabel: string = 'Click Here';
  let pageRequestBody: any;
  let bannerRequestBody: any;
  const stableBannerPage = `stable-test-page-for-banners-${Date.now()}`;
  const bannerTitle = `${promoBannerTitles.defaultBannerTitle} ${Date.now().toString(36).replace(/\d/g, '')}`;
  const stableBannerTitle = promoBannerTitles.testBannerTitle;

  test.beforeAll(async () => {
    bannerActions = new BannerActions(apiContext, adminToken);
    imageData = await fileActions.uploadImage('test-image.jpg');

    bannerRequestBody = await bannerActions.prepareBannerRequestBody(
      stableBannerTitle,
      imageData,
      null,
      bannerBtnLink = '/register',
    );

    const bannerData = await bannerActions.createBanner(bannerRequestBody, 201);
    stableBannerDocumentId = bannerData.data.documentId;
    stableBannerId = bannerData.data.id
    await bannerActions.publishBanner(stableBannerDocumentId, bannerRequestBody, 200);

    // Prepare and publish the initial page
    pageRequestBody = await pageActions.preparePageRequestBody(
      stableBannerPage,
      pageTitles.draftBannerTitle,
      bodyContentHTML(pageTitles.draftBannerTitle),
      pageDescriptions.defaultDescription,
      null,
      stableBannerId,
      stableBannerDocumentId,
    );
    const existingPageData = await pageActions.createPageEntry(pageRequestBody, 201);
    stableBannerPageDocumentId = existingPageData.data.documentId;
    await pageActions.publishPageEntry(stableBannerPageDocumentId, pageRequestBody, 200);
  });

  test.afterEach(async () => {
    if (bannerDocumentId) {
      await bannerActions.deleteBanner(bannerDocumentId);
    }
  });

  test.afterAll(async () => {
    if (stableBannerDocumentId) {
      await bannerActions.deleteBanner(stableBannerDocumentId);
    }
  });

  test('@smoke Verify Creating and Publishing a Banner', async ({ page }) => {
    qase.id(184);
    qase.title('Verify Creating and Publishing a Banner');
    qase.suite('smoke suite');
    let bannerPageDocumentId: string;
      const bannerPageObject = new BannerHelper(page);
      const bannerPage = `test-page-for-banners-${Date.now()}`;

      await test.step('Create new page without banner', async () => {
        pageRequestBody = await pageActions.preparePageRequestBody(
          bannerPage,
          pageTitles.defaultEngTitle,
          bodyContentHTML(pageDescriptions.defaultDescription),
          pageDescriptions.defaultDescription,
        );
        const existingPageData = await pageActions.createPageEntry(pageRequestBody, 201);
        bannerPageDocumentId = existingPageData.data.documentId;
        await pageActions.publishPageEntry(bannerPageDocumentId, pageRequestBody, 200);
      });

      await test.step('Verify the banner is not visible initially', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${bannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyBannerNotVisible();
          },
        );
      });

      await test.step('Prepare the request body for the new banner', async () => {
        bannerRequestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink,
        );
        expect(bannerRequestBody).toBeDefined();
      });

      await test.step('Create the new banner via API', async () => {
        const bannerData = await bannerActions.createBanner(bannerRequestBody, 201);
        bannerDocumentId = bannerData.data.documentId;
        bannerId = bannerData.data.id;
        expect(bannerDocumentId).toBeDefined();
      });

      await test.step('Publish the banner via API', async () => {
        const publishedBannerData = await bannerActions.publishBanner(bannerDocumentId, bannerRequestBody, 200);
        expect(publishedBannerData.data).toHaveProperty('publishedAt');
        expect(publishedBannerData.data.publishedAt).not.toBeNull();
      });

      await test.step('Connect the banner to the page and publish the page via API', async () => {
        updatedPageData = {
          ...existingPageData,
          title: pageTitles.updatedTitle,
          slug: bannerPage,
          body: bodyContentHTML(pageTitles.updatedTitle),
          banners: {
            connect: [bannerId, bannerDocumentId],
            disconnect: [],
          },
        };

        // Remove unnecessary fields
        delete updatedPageData.createdAt;
        delete updatedPageData.updatedAt;
        delete updatedPageData.publishedAt;

        const updatedPageDataResponse = await pageActions.updatePageEntry(bannerPageDocumentId, updatedPageData, 200);
        bannerPageDocumentId = updatedPageDataResponse.data.documentId;
        await pageActions.publishPageEntry(bannerPageDocumentId, updatedPageData, 200);
      });

      await test.step('Verify the banner appears on the frontend', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${bannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyBannerVisible(bannerButtonLabel, bannerBtnLink);
            await bannerPageObject.verifyBannerTitle(bannerTitle);
          },
        );
      });
    },
  );

  test('@regression Verify Updating a Banner', async ({ page }) => {
    qase.id(158);
    qase.title('Verify Updating a Banner');
    qase.suite('regression suite');
    const bannerPageObject = new BannerHelper(page);
      const updatedBannerTitle = `Updated Banner ${Date.now().toString(36).replace(/\d/g, '')}`;

      await test.step('Verify the stable banner is visible initially on the page', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${stableBannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyBannerTitle(stableBannerTitle);
            await bannerPageObject.verifyBannerButtonVisible(bannerButtonLabel, bannerBtnLink);
          },
        );
      });

      await test.step('Prepare the request body for the updated banner', async () => {
        const updatedBannerRequestBody = await bannerActions.prepareBannerRequestBody(
          updatedBannerTitle,
          imageData,
          null,
          bannerBtnLink,
        );
        expect(updatedBannerRequestBody).toBeDefined();
      });

      await test.step('Publish the updated banner via API', async () => {
        const updatedBannerRequestBody = await bannerActions.prepareBannerRequestBody(
          updatedBannerTitle,
          imageData,
          null,
          bannerBtnLink,
        );
        await bannerActions.publishBanner(stableBannerDocumentId, updatedBannerRequestBody, 200);
      });

      await test.step('Verify the updated banner appears correctly on the page', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${stableBannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyBannerTitle(updatedBannerTitle);
            await bannerPageObject.verifyBannerButtonVisible(bannerButtonLabel, bannerBtnLink);
          },
        );
      });
    },
  );

  test('@regression Verify Deleting a Banner', async ({ page }) => {
    qase.id(159);
    qase.title('Verify Deleting a Banner');
    qase.suite('regression suite');
    const bannerPageObject = new BannerHelper(page);

      await test.step('Verify the banner is visible initially on the page', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${stableBannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyBannerButtonVisible(bannerButtonLabel, bannerBtnLink);
          },
        );
      });

      await test.step('Delete the updated banner via API', async () => {
        await bannerActions.deleteBanner(stableBannerDocumentId);
      });

      await test.step('Verify the banner is no longer visible on the page', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${stableBannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyButtonNotVisible();
          },
          45000,
        );
      });
    },
  );

  test('@regression Verify Unpublishing a Banner', async ({ page }) => {
    qase.id(160);
    qase.title('Verify Unpublishing a Banner');
    qase.suite('regression suite');
    const bannerPageObject = new BannerHelper(page);

      let newBannerDocumentId: string;
      let newBannerId: string;

      await test.step('Create a new banner', async () => {
        bannerRequestBody = await bannerActions.prepareBannerRequestBody(
          bannerTitle,
          imageData,
          null,
          bannerBtnLink,
        );

        const bannerData = await bannerActions.createBanner(bannerRequestBody, 201);
        newBannerDocumentId = bannerData.data.documentId;
        newBannerId = bannerData.data.id;

        expect(newBannerDocumentId).toBeDefined();
      });

      await test.step('Publish the new banner via API', async () => {
        const publishedBannerData = await bannerActions.publishBanner(newBannerDocumentId, bannerRequestBody, 200);
        expect(publishedBannerData.data).toHaveProperty('publishedAt');
        expect(publishedBannerData.data.publishedAt).not.toBeNull();
      });

      await test.step('Connect the new banner to the stable banner page and publish the page', async () => {
        updatedPageData = {
          ...existingPageData,
          title: pageTitles.updatedTitle,
          slug: stableBannerPage,
          body: bodyContentHTML(pageTitles.updatedTitle),
          banners: {
            connect: [newBannerId, newBannerDocumentId],
            disconnect: [],
          },
        };

        // Remove unnecessary fields
        delete updatedPageData.createdAt;
        delete updatedPageData.updatedAt;
        delete updatedPageData.publishedAt;

        const updatedPageDataResponse = await pageActions.updatePageEntry(pageDocumentId, updatedPageData, 200);
        pageDocumentId = updatedPageDataResponse.data.documentId;
        await pageActions.publishPageEntry(pageDocumentId, updatedPageData, 200);
      });

      await test.step('Verify the new banner appears on the frontend', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${stableBannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyBannerVisible(bannerButtonLabel, bannerBtnLink);
            await bannerPageObject.verifyBannerTitle(bannerTitle);
          },
        );
      });

      await test.step('Unpublish the new banner via API', async () => {
        await bannerActions.unpublishBanner(newBannerDocumentId);
      });

      await test.step('Verify the banner is no longer visible on the frontend', async () => {
        await waitForPageWithAssertions(
          page,
          `${appConfig.SITE_URL}/${stableBannerPage}`,
          200,
          async () => {
            await bannerPageObject.verifyButtonNotVisible();
          },
          45000,
        );
      });
    },
  );
});
