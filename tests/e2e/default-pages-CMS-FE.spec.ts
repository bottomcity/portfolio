import { APIRequestContext, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { appConfig } from '../config';
import { locales, pageDescriptions, pageTitles } from '../enums/data-for-bodies';
import { pluralSlugs, singleSlugs } from '../enums/slugs';
import { PageSeoActions } from '../pages-scenarios-actions/page-seo-actions';
import { authenticateAdmin } from '../utils/utils';
import { SingleTypeActions } from '../API-scenarios-actions/single-type-actions';

let adminToken: string;
let apiContext: APIRequestContext;
let seoActions: PageSeoActions;

test.describe('CMS and FE scenarios for default pages', () => {
  test.beforeAll(async () => {
    const authResult = await authenticateAdmin();
    adminToken = authResult.adminLoginToken;
    apiContext = authResult.apiContext;

    const singleTypeActions = new SingleTypeActions(apiContext, adminToken);
    seoActions = new PageSeoActions(singleTypeActions);
  });

  const mapLocaleToCMS = (feLocale: string): string => {
    switch (feLocale) {
      case locales.koreanFELocale:
        return locales.koreanCMSLocale;
      case locales.chineseFELocale:
        return locales.chineseCMSLocale;
      default:
        return locales.defaultLocale;
    }
  };

  const testCases = [
    { qaseId: 29, contentType: singleSlugs.eGamesPage, slug: pluralSlugs.eGamesPage, feLocale: locales.defaultLocale, pageTitle: pageTitles.defaultEngTitle, description: pageDescriptions.updatedMetaDescription, requiresPublish: true },
    { qaseId: 30, contentType: singleSlugs.liveCasinoPage, slug: singleSlugs.liveCasinoPage, feLocale: locales.defaultLocale, pageTitle: pageTitles.defaultEngTitle, description: pageDescriptions.updatedMetaDescription, requiresPublish: true },
    { qaseId: 31, contentType: singleSlugs.liveSlotPage, slug: pluralSlugs.liveSlotPage, feLocale: locales.defaultLocale, pageTitle: pageTitles.defaultEngTitle, description: pageDescriptions.updatedMetaDescription, requiresPublish: true },
    { qaseId: 148, contentType: singleSlugs.liveSlotPage, slug: pluralSlugs.liveSlotPage, feLocale: locales.koreanFELocale, pageTitle: pageTitles.koreanTitle, description: pageDescriptions.updatedKoreanMetaDescription, requiresPublish: true },
    { qaseId: 149, contentType: singleSlugs.eGamesPage, slug: pluralSlugs.eGamesPage, feLocale: locales.koreanFELocale, pageTitle: pageTitles.koreanTitle, description: pageDescriptions.updatedKoreanMetaDescription, requiresPublish: true },
    { qaseId: 150, contentType: singleSlugs.liveCasinoPage, slug: singleSlugs.liveCasinoPage, feLocale: locales.koreanFELocale, pageTitle: pageTitles.koreanTitle, description: pageDescriptions.updatedKoreanMetaDescription, requiresPublish: true },
    { qaseId: 151, contentType: singleSlugs.liveSlotPage, slug: pluralSlugs.liveSlotPage, feLocale: locales.chineseFELocale, pageTitle: pageTitles.chineseTitle, description: pageDescriptions.updatedChineseMetaDescription, requiresPublish: true },
    { qaseId: 152, contentType: singleSlugs.eGamesPage, slug: pluralSlugs.eGamesPage, feLocale: locales.chineseFELocale, pageTitle: pageTitles.chineseTitle, description: pageDescriptions.updatedChineseMetaDescription, requiresPublish: true },
    { qaseId: 153, contentType: singleSlugs.liveCasinoPage, slug: singleSlugs.liveCasinoPage, feLocale: locales.chineseFELocale, pageTitle: pageTitles.chineseTitle, description: pageDescriptions.updatedChineseMetaDescription, requiresPublish: true },
    { qaseId: 176, contentType: singleSlugs.eGamesPage, slug: pluralSlugs.eGamesPage, feLocale: locales.defaultLocale, pageTitle: pageTitles.defaultEngTitle, description: pageDescriptions.updatedMetaDescription, requiresPublish: false },
    { qaseId: 161, contentType: singleSlugs.liveCasinoPage, slug: singleSlugs.liveCasinoPage, feLocale: locales.defaultLocale, pageTitle: pageTitles.defaultEngTitle, description: pageDescriptions.updatedMetaDescription, requiresPublish: false },
    { qaseId: 162, contentType: singleSlugs.liveSlotPage, slug: pluralSlugs.liveSlotPage, feLocale: locales.defaultLocale, pageTitle: pageTitles.defaultEngTitle, description: pageDescriptions.updatedMetaDescription, requiresPublish: false },
    { qaseId: 177, contentType: singleSlugs.eGamesPage, slug: pluralSlugs.eGamesPage, feLocale: locales.koreanFELocale, pageTitle: pageTitles.koreanTitle, description: pageDescriptions.updatedKoreanMetaDescription, requiresPublish: false },
    { qaseId: 163, contentType: singleSlugs.liveCasinoPage, slug: singleSlugs.liveCasinoPage, feLocale: locales.koreanFELocale, pageTitle: pageTitles.koreanTitle, description: pageDescriptions.updatedKoreanMetaDescription, requiresPublish: false },
    { qaseId: 164, contentType: singleSlugs.liveSlotPage, slug: pluralSlugs.liveSlotPage, feLocale: locales.koreanFELocale, pageTitle: pageTitles.koreanTitle, description: pageDescriptions.updatedKoreanMetaDescription, requiresPublish: false },
    { qaseId: 178, contentType: singleSlugs.eGamesPage, slug: pluralSlugs.eGamesPage, feLocale: locales.chineseFELocale, pageTitle: pageTitles.chineseTitle, description: pageDescriptions.updatedChineseMetaDescription, requiresPublish: false },
    { qaseId: 165, contentType: singleSlugs.liveCasinoPage, slug: singleSlugs.liveCasinoPage, feLocale: locales.chineseFELocale, pageTitle: pageTitles.chineseTitle, description: pageDescriptions.updatedChineseMetaDescription, requiresPublish: false },
    { qaseId: 166, contentType: singleSlugs.liveSlotPage, slug: pluralSlugs.liveSlotPage, feLocale: locales.chineseFELocale, pageTitle: pageTitles.chineseTitle, description: pageDescriptions.updatedChineseMetaDescription, requiresPublish: false },
  ];

  testCases.forEach(({ qaseId, contentType, slug, feLocale, pageTitle, description, requiresPublish }) => {
    test(`@regression Verify SEO Metadata ${requiresPublish ? 'Reflects' : 'Does Not Reflect'} on Frontend for ${contentType} page in ${feLocale}`,
      async ({ page }) => {
        qase.id(qaseId);
        qase.title(`@regression Verify SEO Metadata ${requiresPublish ? 'Reflects' : 'Does Not Reflect'} on Frontend for ${contentType} page in ${feLocale}`);
        qase.suite('regression suite');
        const timestamp = Date.now();
          const pageUrl = `${appConfig.SITE_URL}${feLocale === locales.defaultLocale ? '' : `/${feLocale}`}/${slug}`;
          const cmsLocale = mapLocaleToCMS(feLocale);
          const updatedTitle = `${pageTitle} ${slug} ${timestamp}`;
          const updatedDescription = `${description}${timestamp}`;

          if (requiresPublish) {
            await test.step('Extract SEO metadata', async () => {
              await seoActions.extractSeoMetadata(page, pageUrl);
            });

            await test.step(`Publish updated ${contentType} entry via API`, async () => {
              await seoActions.publishPage(
                contentType,
                {
                  title: updatedTitle,
                  description: updatedDescription,
                  metaSection: {
                    description: updatedDescription,
                    keywords: updatedDescription,
                    title: updatedTitle
                  }
                },
                cmsLocale
              );
            });

            await test.step(`Verify updated SEO metadata on frontend for ${contentType}`, async () => {
              await seoActions.verifySeoMetadata(page, pageUrl, updatedTitle, timestamp.toString(), true);
            });
          } else {
            await test.step(`Update SEO metadata for ${contentType} in CMS`, async () => {
              await seoActions.updatePage(contentType, updatedTitle, updatedDescription, cmsLocale);
            });

            await test.step(`Verify updated SEO metadata is not reflected on frontend for ${contentType}`, async () => {
              await seoActions.verifySeoMetadata(page, pageUrl, updatedTitle, timestamp.toString(), false);
            });
        }
      }
    );
  });
});