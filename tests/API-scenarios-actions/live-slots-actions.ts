import { APIRequestContext } from '@playwright/test';
import { SingleTypeActions } from './single-type-actions';
import { singleSlugs } from '../enums/slugs';

export class LiveSlotsActions extends SingleTypeActions {

  constructor(apiContext: APIRequestContext, adminToken: string) {
    super(apiContext, adminToken);
  }

  async getLiveSlotsEntry(status: number) {
    return this.getSingleEntry(singleSlugs.liveCasinoPage, status);
  }

  async updateLiveSlotsEntry(updateData: { title: string; description: string }) {
    return this.updateSingleEntry(singleSlugs.liveCasinoPage, updateData);
  }

  async publishLiveSlotsEntry(requestBody: any, locale: string = 'en') {
    return this.publishSingleEntry(requestBody, singleSlugs.liveSlotPage, locale);
  }

  async deleteLiveSlotsEntry() {
    return this.deleteSingleEntry(singleSlugs.liveCasinoPage);
  }
}