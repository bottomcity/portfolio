import { BaseCMSActions } from './base-CMS-actions';
import { APIRequestContext, expect } from '@playwright/test';
import { appConfig } from '../config';

export class SingleTypeActions extends BaseCMSActions {
  private baseEndpoint: string;

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
    this.baseEndpoint = `${appConfig.STRAPI_URL}/content-manager/single-types/api::`;
  }

  private constructEndpoint(contentType: string, locale: string = 'en'): string {
    return `${this.baseEndpoint}${contentType}.${contentType}?locale=${locale}`;
  }

  async getSingleEntry(contentType: string, status: number, locale: string = 'en') {
    const endpoint = this.constructEndpoint(contentType, locale);
    const response = await this.apiContext.get(endpoint, {
      headers: this.getHeaders(),
    });

    expect(response.status()).toBe(status);
    const data = await response.json();
    return data.data;
  }

  async updateSingleEntry(
    contentType: string,
    updateData: { title: string; description: string },
    locale: string = 'en'
  ) {
    const endpoint = this.constructEndpoint(contentType, locale);
    const response = await this.apiContext.put(endpoint, {
      headers: this.getHeaders(),
      data: updateData,
    });

    const data = await response.json();
    console.log('RESPONSE UPDATED BODY',data.data);
    expect(response.status()).toBe(200);
    expect(data.data).toHaveProperty('title', updateData.title);
    expect(data.data).toHaveProperty('description', updateData.description);

    return data.data;
  }

  async publishSingleEntry(
    requestBody: any,
    contentType: string,
    locale: string
  ) {

    const endpoint = `${this.baseEndpoint}${contentType}.${contentType}/actions/publish?locale=${locale}`;
    const response = await this.apiContext.post(endpoint, {
      headers: this.getHeaders(),
      data: requestBody,
    });

    const data = await response.json();
    console.log('RESPONSE PUBLISHED BODY',data.data);

    expect(response.status()).toBe(200);
    return data.data;
  }

  async deleteSingleEntry(contentType: string, locale: string = 'en') {
    const endpoint = this.constructEndpoint(contentType, locale);
    const response = await this.apiContext.delete(endpoint, {
      headers: this.getHeaders(),
    });

    expect(response.status()).toBe(200);
    return response;
  }
}