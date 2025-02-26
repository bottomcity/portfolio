import { expect, Page } from '@playwright/test';
import { PageElements } from './page-elements';

export class CustomPage {
  private elements: PageElements;

  constructor(private page: Page) {
    this.elements = new PageElements(page);
  }

  async navigateTo(pageUrl: string) {
    await this.page.route('**/*.{png,jpg,webp}*', (route) => route.abort());
    return await this.page.goto(pageUrl);
  }

  async verifyPageDoesNotExist() {
    const response = await this.navigateTo(this.page.url());
    expect(response.status()).toBe(404);
  }

  async verifyPageExists(expectedTitle: string, expectedDescription: string) {
    const response = await this.navigateTo(this.page.url());
    expect(response.status()).toBe(200);

    const actualTitle = await this.elements.getTitleText();
    const actualDescription = await this.elements.getMetaDescriptionContent();

    expect(actualTitle).toBe(expectedTitle);
    expect(actualDescription).toBe(expectedDescription);
  }

  async verifyPageTitle(expectedTitle: string) {
    const actualTitle = await this.elements.getTitleText();
    expect(actualTitle).toBe(expectedTitle);
  }

  async verifyMetaDescription(expectedDescription: string) {
    const actualDescription = await this.elements.getMetaDescriptionContent();
    expect(actualDescription).toBe(expectedDescription);
  }

  async verifyPageVisible(expectedTitle: string) {
    const pageLocator = this.elements.getTitleText();
    expect(pageLocator).toBe(expectedTitle);
  }

  async verifyPageNotVisible(expectedTitle: string) {
    const pageLocator = this.page.locator(`text=${expectedTitle}`);
    await expect(pageLocator).not.toBeVisible({
      timeout: 30000, // Allow time for potential network delays
    });
  }

  async performSearch(searchTerm: string) {
    const searchInput = this.page.locator('input[aria-label="Search"]');
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
  }

  async verifyMetaOgTitle(expectedOgTitle: string) {
    const actualOgTitle = await this.elements.getMetaOgTitleContent();
    expect(actualOgTitle).toBe(expectedOgTitle);
  }

  async verifyMetaOgDescription(expectedOgDescription: string) {
    const actualOgDescription = await this.elements.getMetaOgDescriptionContent();
    expect(actualOgDescription).toBe(expectedOgDescription);
  }

  async verifyMetaKeywords(expectedKeywords: string) {
    const actualKeywords = await this.elements.getMetaKeywordsContent();
    expect(actualKeywords).toBe(expectedKeywords);
  }

  async verifyImageIsVisible(expectedImageSrc: string) {
    const isVisible = await this.elements.isImageVisible(expectedImageSrc);
    expect(isVisible).toBe(true);
  }
}