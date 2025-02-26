import { APIRequestContext, expect } from '@playwright/test';
import { appConfig } from '../config';

export class BaseCMSActions {
  protected apiContext: APIRequestContext;
  protected adminToken: string;

  constructor(apiContext: APIRequestContext, adminToken: string) {
    this.apiContext = apiContext;
    this.adminToken = adminToken;
  }

  protected getHeaders() {
    return {
      ...appConfig.REQUEST_HEADERS,
      Authorization: `Bearer ${this.adminToken}`,
    };
  }

  protected prepareRequestBody(
    commonFields: {
      metaSection?: {}
      startDate?: string;
      expirationDate?: string;
    },
    additionalFields: Record<string, any> = {}
  ) {
    return {
      ...commonFields,
      metaSection: commonFields.metaSection || {},
      startDate: commonFields.startDate || null,
      expirationDate: commonFields.expirationDate || null,
      ...additionalFields, // Fields specific to blog, promo, etc.
    };
  }

  protected async getEntryById(
    endpoint: string,
    documentId: string,
    locale: string = 'en'
  ) {

    const response = await this.apiContext.get(`${endpoint}/${documentId}?locale=${locale}`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (data.error) {
      console.log('ERROR WHILE GETTING ENTRY',
        data.error.message);
    }
    expect(response.status()).toEqual(200);

    return data.data;
  }

  protected async getEntryIdByField(
    endpoint: string,
    fieldName: string,
    fieldValue: string,
    locale: string = 'en'
  ): Promise<string | null> {
    const url = `${endpoint}?filters[${fieldName}][$eq]=${fieldValue}&locale=${locale}`;
    const response = await this.apiContext.get(url, {
      headers: this.getHeaders(),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.error) {
      console.log('ERROR WHILE GETTING ENTRY',
        jsonResponse.error.message);
    }
    expect(response.status()).toEqual(200);
    if (jsonResponse.results && jsonResponse.results.length > 0) {
      return jsonResponse.results[0].documentId;
    }
  }

  protected async createEntry(endpoint: string, requestBody: any, statusCode: number) {
    const response = await this.apiContext.post(endpoint, {
      headers: this.getHeaders(),
      data: requestBody,
    });

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      expect(data).toHaveProperty('documentId');
    }
    console.log('RESPONSE BODY',data);

    if (data.error) {
      console.log('ERROR WHILE CREATING ENTRY',
        data.error.message);
      console.log(data.error.details)
    }
    expect(response.status()).toEqual(statusCode);

    return data;
  }

  protected async updateEntry(endpoint: string, documentId: string, updatedData: any, statusCode: number) {
    const response = await this.apiContext.put(`${endpoint}/${documentId}`, {
      headers: this.getHeaders(),
      data: updatedData,
    });

    const data = await response.json();

    if (data.error) {
      console.log(`ERROR WHILE UPDATING ENTRY ${documentId}`,
        data.error.message);
    }
    expect(response.status()).toEqual(statusCode);

    return data;
  }

  protected async deleteEntry(endpoint: string, documentId: string) {
    const response = await this.apiContext.delete(`${endpoint}/${documentId}`, {
      headers: this.getHeaders(),
    });
    expect(response.status()).toEqual(200);
  }

  protected async publishEntry(
    requestBody: any,
    endpoint: string,
    documentId: string,
    statusCode: number,
    locale: string = 'en') {
    const publishEndpoint = `${endpoint}/${documentId}/actions/publish?locale=${locale}`;

    const response = await this.apiContext.post(publishEndpoint, {
      headers: this.getHeaders(),
      data: requestBody,
    });

    const data = await response.json();
    if (data.error) {
      console.log('ERROR WHILE PUBLISHING ENTRY',
        data.error.message);
    }
    console.log('RESPONSE BODY OF PUBLISHED ENTRY',data.data);
    expect(response.status()).toEqual(statusCode);

    return data;
  }

  protected async unpublishEntry(endpoint: string, documentId: string, locale: string = 'en') {
    const unpublishEndpoint = `${endpoint}/${documentId}/actions/unpublish?locale=${locale}`;
    const response = await this.apiContext.post(unpublishEndpoint, {
      headers: this.getHeaders(),
    });

    const data = await response.json();
    if (data.error) {
      console.log('ERROR WHILE UNPUBLISHING ENTRY',
        data.error.message);
    }
    console.log('RESPONSE BODY OF UNPUBLISHING ENTRY',data.data);
    expect(response.status()).toEqual(200);

    return data;
  }
}