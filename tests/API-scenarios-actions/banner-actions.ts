import { APIRequestContext } from '@playwright/test';
import { appConfig } from '../config';
import { BaseCMSActions } from './base-CMS-actions';
import { singleSlugs } from '../enums/slugs';

export class BannerActions extends BaseCMSActions {
  private endpoint = `${appConfig.STRAPI_URL}/content-manager/collection-types/api::${singleSlugs.bannerPage}.${singleSlugs.bannerPage}`;

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
  }

  async prepareBannerRequestBody(
    bannerTitle: string,
    bannerImage: {
      id: number;
      name: string;
      url: string;
      mime: string;
      width: number;
      height: number;
      alternativeText?: string | null;
      caption?: string | null;
      ext?: string | null;
      hash?: string | null;
      size?: number | null;
      formats?: any;
      documentId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      publishedAt?: string | null;
      folderPath?: string | null;
      folder?: any | null;
      isSelectable?: boolean;
      isUrlSigned?: boolean;
      type?: string;
      locale?: string | null;
      provider?: string | null;
      provider_metadata?: any | null;
      previewUrl?: string | null;
    },
    bannerSubtitle: string | null = null,
    bannerButtonLink: string = '/default-link',
    bannerButtonLabel: string = 'Click Here'
  ) {
    return {
      bannerTitle,
      bannerImage: bannerImage,
      bannerSubtitle,
      bannerButtonLink,
      bannerButtonLabel
    };
  }

  async createBanner(requestBody: any, statusCode: number) {
    return await this.createEntry(this.endpoint, requestBody, statusCode);
  }

  async updateBanner(documentId: string, updatedData: any, statusCode: number) {
    return this.updateEntry(`${this.endpoint}`, documentId, updatedData, statusCode);
  }

  async getBannerById(documentId: string) {
    return this.getEntryById(this.endpoint, documentId);
  }

  async deleteBanner(documentId: string) {
    return this.deleteEntry(this.endpoint, documentId);
  }

  async publishBanner(documentId: string, updatedData: any, statusCode: number) {
    return this.publishEntry(updatedData, this.endpoint, documentId, statusCode);
  }

  async unpublishBanner(documentId: string, locale: string = 'en') {
    return this.unpublishEntry(this.endpoint, documentId, locale);
  }
}