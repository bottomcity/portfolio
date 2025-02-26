import { APIRequestContext } from '@playwright/test';
import { SingleTypeActions } from './single-type-actions';
import { singleSlugs } from '../enums/slugs';

export class LiveCasinoActions extends SingleTypeActions {

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
  }

  async getLiveCasinoEntry(status: number) {
    return this.getSingleEntry(singleSlugs.liveCasinoPage, status);
  }

  async updateLiveCasinoEntry(updateData: { title: string; description: string }) {
    return this.updateSingleEntry(singleSlugs.liveCasinoPage, updateData);
  }

  async publishLiveCasinoEntry(requestBody: any, locale: string = 'en') {
    return this.publishSingleEntry(requestBody, singleSlugs.liveCasinoPage, locale);
  }

  async deleteLiveCasinoEntry() {
    return this.deleteSingleEntry(singleSlugs.liveCasinoPage);
  }
}