import { expect, Page } from '@playwright/test';

export class BannerElements {
  constructor(private page: Page) {}

  // Locators
  get playNowButton() {
    return this.page.locator('[data-testid="play-now-btn"]');
  }

  get bannerTitleElement() {
    return this.page.locator('h2');
  }

  // Methods
  async gotoPage(pageUrl: string) {
    const response = await this.page.goto(pageUrl, { waitUntil: 'networkidle' });
    return response.status();
  }

  async isPlayNowButtonVisible() {
    return await this.playNowButton.isVisible();
  }

  async hasPlayNowButtonText(expectedText: string) {
    await expect(this.playNowButton).toHaveText(expectedText);
  }

  async hasPlayNowButtonHrefContaining(expectedHref: string) {
    await expect(this.playNowButton).toHaveAttribute('href', expect.stringContaining(expectedHref));
  }

  async getBannerTitle() {
    return await this.bannerTitleElement.innerText();
  }

  async hasBannerTitle(expectedTitle: string) {
    const actualTitle = await this.getBannerTitle();
    expect(actualTitle).toBe(expectedTitle);
  }

  async isPlayNowButtonNotVisible() {
    await expect(this.playNowButton).not.toBeVisible();
  }
}