import { Page } from '@playwright/test';

export class PageElements {
  constructor(private page: Page) {}

  get pageTitle() {
    return this.page.locator('h1');
  }

  get metaDescription() {
    return this.page.locator('meta[name="description"]');
  }

  get metaOgTitle() {
    return this.page.locator('meta[property="og:title"]');
  }

  get metaOgDescription() {
    return this.page.locator('meta[property="og:description"]');
  }

  get metaKeywords() {
    return this.page.locator('meta[name="keywords"]');
  }

  async getTitleText() {
    return await this.pageTitle.innerText();
  }

  async getMetaDescriptionContent() {
    return await this.metaDescription.getAttribute('content');
  }

  async getMetaOgTitleContent() {
    return await this.metaOgTitle.getAttribute('content');
  }

  async getMetaOgDescriptionContent() {
    return await this.metaOgDescription.getAttribute('content');
  }

  async getMetaKeywordsContent() {
    return await this.metaKeywords.getAttribute('content');
  }

  async getImageBySrc(src: string) {
    return this.page.locator(`img[src*="${src}"]`);
  }

  async isImageVisible(src: string) {
    const img = await this.getImageBySrc(src);
    return img.isVisible();
  }
}