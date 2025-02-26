import { expect, Page } from '@playwright/test';
import { BannerElements } from './banner-elements';

export class BannerHelper {
  private elements: BannerElements;

  constructor(private page: Page) {
    this.elements = new BannerElements(page);
  }

  // Navigate to a page and return the response status
  async navigateToPage(pageUrl: string): Promise<number> {
    return await this.elements.gotoPage(pageUrl);
  }

  // Verify the banner is visible with the expected title and link
  async verifyBannerVisible(expectedTitle: string, expectedLink: string): Promise<void> {
    await this.elements.isPlayNowButtonVisible();
    await this.elements.hasPlayNowButtonText(expectedTitle);
    await this.elements.hasPlayNowButtonHrefContaining(expectedLink);
  }

  // Verify the banner is not visible
  async verifyBannerNotVisible(): Promise<void> {
    await this.elements.isPlayNowButtonNotVisible();
  }

  // Verify the banner title matches the expected title
  async verifyBannerTitle(expectedTitle: string): Promise<void> {
    await this.elements.hasBannerTitle(expectedTitle);
  }

  // Specific assertion for verifying both button visibility and attributes
  async verifyBannerButtonVisible(expectedText: string, expectedHref: string): Promise<void> {
    await this.verifyBannerVisible(expectedText, expectedHref);
  }

  // Additional utility: check the page response status
  async verifyPageStatus(pageUrl: string, expectedStatus: number): Promise<void> {
    const status = await this.navigateToPage(pageUrl);
    expect(status).toBe(expectedStatus);
  }

  // Comprehensive banner verification combining title, button text, and link
  async verifyFullBannerDetails(expectedTitle: string, expectedText: string, expectedHref: string): Promise<void> {
    await this.verifyBannerTitle(expectedTitle);
    await this.verifyBannerVisible(expectedText, expectedHref);
  }

  // Advanced assertion: button should not be visible
  async verifyButtonNotVisible(): Promise<void> {
    await this.verifyBannerNotVisible();
  }
}