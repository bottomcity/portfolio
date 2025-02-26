import { APIRequestContext } from '@playwright/test';
import { appConfig } from '../config';
import { BaseCMSActions } from './base-CMS-actions';

export class PromoActions extends BaseCMSActions {
  private endpoint = `${appConfig.STRAPI_URL}/content-manager/collection-types/api::promotion.promotion`;
  private promoEndpoint = `${this.endpoint}/banners`

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
  }

  async preparePromoRequestBody(
    slug: string,
    title: string,
    promoDescription: string,
    mechanicsContent: string,
    termsAndConditionsContent: string,
    startDate?: string,
    expirationDate?: string,
    bannerId?: number,
    documentId?: string,
  ) {
    return this.prepareRequestBody(
      {
        startDate: startDate,
        expirationDate: expirationDate,
      },
      {
        title: title,
        description: promoDescription,
        slug: slug,
        mechanics: mechanicsContent,
        termsAndConditions: termsAndConditionsContent,
        bannerButtonLabel: 'Join Now',
        bannerButtonLink: '/join',
        bannerSubtitle: 'Exclusive Promo',
        banners: {
          connect: [bannerId, documentId],
          disconnect: [],
        }
      }
    );
  }

  async getPromoEntryById(documentId: string) {
    return this.getEntryById(this.promoEndpoint, documentId);
  }

  async getPromoIdByTitle(title: string): Promise<string | null> {
    return this.getEntryIdByField(this.promoEndpoint, 'title', title);
  }

  async createPromoEntry(requestBody: any, statusCode: number) {
    const entry = await this.createEntry(this.endpoint, requestBody, statusCode);
    return entry;
  }

  async updatePromoEntry(documentId: string, updatedData: any, statusCode: number) {
    const entry = this.updateEntry(`${this.endpoint}`, documentId, updatedData, statusCode);
    return entry;
  }

  async deletePromoEntry(documentId: string) {
    await this.deleteEntry(this.endpoint, documentId);
  }

  async publishPromoEntry(
    documentId: string,
    requestBody: any,
    statusCode: number,
    locale: string = 'en') {
    return this.publishEntry(requestBody, this.endpoint, documentId, statusCode, locale);
  }

  async unpublishPromoEntry(documentId: string, locale: string = 'en') {
    return this.unpublishEntry(this.endpoint, documentId, locale);
  }
}