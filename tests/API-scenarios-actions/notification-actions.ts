import { APIRequestContext } from '@playwright/test';
import { appConfig } from '../config';
import { BaseCMSActions } from './base-CMS-actions';

export class NotificationActions extends BaseCMSActions {
  private endpoint = `${appConfig.STRAPI_URL}/content-manager/collection-types/api::notification.notification`;

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
  }

  async prepareNotificationRequestBody(
    notificationInfoTypes: string,
    message: string,
    startDate: string,
    expirationDate: string,
    all: boolean,
    login: boolean,
    register: boolean,
    deposit: boolean,
    withdraw: boolean
  ) {
    return this.prepareRequestBody(
      {
        startDate: startDate,
        expirationDate: expirationDate,
      },
      {
        InfoTypes: notificationInfoTypes,
        message: message,
        notificationArea:{
          all: all,
          login: login,
          register: register,
          deposit: deposit,
          withdraw: withdraw,
        }
      }
    );
  }

  async getNotificationById(documentId: string) {
    return this.getEntryById(`${this.endpoint}`, documentId);
  }

  async getNotificationIdByMessage(message: string): Promise<string | null> {
    return this.getEntryIdByField(this.endpoint, 'message', message);
  }

  async createNotification(requestBody: any, statusCode: number) {
    const entry = await this.createEntry(this.endpoint, requestBody, statusCode);
    return entry;
  }

  async publishNotificationEntry(
    documentId: string,
    requestBody: any,
    statusCode: number,
    locale: string = 'en') {
    return this.publishEntry(requestBody, this.endpoint, documentId, statusCode, locale);
  }

  async updateNotification(documentId: string, updatedData: any, statusCode: number) {
    const entry = this.updateEntry(`${this.endpoint}`, documentId, updatedData, statusCode);
    return entry;
  }

  async deleteNotification(documentId: string) {
    await this.deleteEntry(this.endpoint, documentId);
  }
}