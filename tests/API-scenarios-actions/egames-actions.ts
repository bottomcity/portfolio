import { APIRequestContext } from '@playwright/test';
import { SingleTypeActions } from './single-type-actions';
import { singleSlugs } from '../enums/slugs';

export class EgamesActions extends SingleTypeActions {

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
  }

  async getEgamesEntry(status: number) {
    return this.getSingleEntry(singleSlugs.eGamesPage, status);
  }

  async updateEgamesEntry(updateData: { title: string; description: string }) {
    return this.updateSingleEntry(singleSlugs.eGamesPage, updateData);
  }

  async publishEgamesEntry(requestBody: any, locale: string = 'en') {
    return this.publishSingleEntry(requestBody, singleSlugs.eGamesPage, locale);
  }

  async deleteEgamesEntry() {
    return this.deleteSingleEntry(singleSlugs.eGamesPage);
  }
}