import { BaseCMSActions } from './base-CMS-actions';
import { APIRequestContext, expect } from '@playwright/test';
import { appConfig } from '../config';
import { bodyContentHTML } from '../utils/utils';
import { articlesCategory } from '../enums/data-for-bodies';

export class ArticlePageActions extends BaseCMSActions {
  private endpoint: string;

  constructor(apiContext: APIRequestContext, adminToken: string, contentType: string) {
    super(apiContext, adminToken);
    this.endpoint = `${appConfig.STRAPI_URL}/content-manager/collection-types/api::${contentType}.${contentType}`;
  }

  async preparePageRequestBody(
    slug: string,
    title: string,
    bodyContent: string,
    pageDescription: string,
    releaseDate?: string,
    bannerId?: number,
    bannerDocumentId?: string,
    inNavBarVisible: boolean = true,
    inFooterVisible: boolean = false,
    authRequired: boolean = false,
    category: string = articlesCategory.sports
  ) {
    return this.prepareRequestBody(
      {
        startDate: releaseDate,
        metaSection: {
          description: pageDescription,
          keywords: pageDescription,
          title: title
        }
      },
      {
        title: title,
        description: pageDescription,
        slug: slug,
        body: bodyContent,
        inNavBarVisible: inNavBarVisible,
        inFooterVisible: inFooterVisible,
        authRequired: authRequired,
        category: category,
        banners: {
          connect: [bannerId, bannerDocumentId],
          disconnect: [],
        }
      }
    );
  }

  async getPageEntryById(documentId: string) {
    return this.getEntryById(this.endpoint, documentId);
  }

  async getPageIdBySlug(slug: string): Promise<string | null> {
    return this.getEntryIdByField(this.endpoint, 'slug', slug);
  }

  async createPageEntry(requestBody: any, statusCode: number, locale: string = 'en') {
    const entry = await this.createEntry(`${this.endpoint}?locale=${locale}`, requestBody, statusCode);
    return entry;
  }

  async updatePageEntry(documentId: string, updatedData: any, statusCode: number) {
    const entry = this.updateEntry(this.endpoint, documentId, updatedData, statusCode);
    return entry;
  }

  async updateArticleOrPage(
    existingPageData: any,
    slug: string,
    title: string,
    expectedStatusCode: number,
    newSlug: string,
    newTitle: string,
    category: string = articlesCategory.sports
  ) {

    const documentId = await this.getPageIdBySlug(slug);
    expect(documentId).toBeDefined();

    let updatedPageData = {
      ...existingPageData,
      slug: newSlug,
      title: newTitle,
      body: bodyContentHTML(title),
      category: category
    };

    delete updatedPageData.id;
    delete updatedPageData.createdAt;
    delete updatedPageData.updatedAt;
    delete updatedPageData.publishedAt;

    const response = await this.updatePageEntry(documentId, updatedPageData, expectedStatusCode);

    if (expectedStatusCode === 200) {
      expect(response.data).toBeDefined();
      return response.data;
    } else {
      expect(response.data).toBeNull();
      return response.error;
    }
  }

  async deletePageEntry(documentId: string) {
    await this.deleteEntry(this.endpoint, documentId);
  }

  async publishPageEntry(
    documentId: string,
    requestBody: any,
    statusCode: number,
    locale: string = 'en'
  ) {
    const entry = this.publishEntry(requestBody, this.endpoint, documentId, statusCode, locale);
    return entry;
  }

  async unpublishPageEntry(documentId: string, locale: string = 'en') {
    return this.unpublishEntry(this.endpoint, documentId, locale);
  }
}