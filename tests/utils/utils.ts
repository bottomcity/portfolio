import { request, APIRequestContext, expect } from '@playwright/test';
import { appConfig } from '../config';
import { Page } from '@playwright/test';

export async function authenticateAdmin(): Promise<{
  adminLoginToken: string;
  apiContext: APIRequestContext;
}> {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    `${appConfig.STRAPI_QA_URL}/admin/login`,
    {
      headers: appConfig.REQUEST_HEADERS,
      data: JSON.stringify({
        email: appConfig.STRAPI_LOGIN_EMAIL,
        password: appConfig.STRAPI_LOGIN_PASSWORD,
      }),
    }

  );
  const loginData = await loginResponse.json();
  const adminLoginToken = loginData.data.token;

  return { adminLoginToken, apiContext };
}

export async function registerAdmin(): Promise<{
  adminRegToken: string,
  apiContext: APIRequestContext;
}> {
  const apiContext = await request.newContext();

  const response = await apiContext.post(
    `${appConfig.STRAPI_LOCAL_URL}/admin/register-admin`,
    {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      email: `${appConfig.STRAPI_REG_EMAIL}`,
      password: `${appConfig.STRAPI_REG_PASSWORD}`,
      firstname: `${appConfig.STRAPI_REG_FIRST_NAME}`,
      lastname: `${appConfig.STRAPI_REG_LAST_NAME}`,
    }
  });

  const regData = await response.json();
  const adminRegToken = regData.data.token;
  return { adminRegToken, apiContext };
}


export const bodyContentHTML = (
  content: string,
  uploadedImageUrl?: string,
  linkedImageUrl?: string
): string =>`
    <h1>${content}</h1>
    <h2>${content}</h2>
    <h3>${content}</h3>
    <p>image from device:
    <img src="${uploadedImageUrl}" alt="">
    </p>
    <p>image from URL: 
    <img src="${linkedImageUrl}" alt=""></p>
`

export async function extractSeoMeta(page: Page) {
  return {
    title: await page.title(),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    ogTitle: await page.locator('meta[property="og:title"]').getAttribute('content'),
    ogDescription: await page.locator('meta[property="og:description"]').getAttribute('content'),
  };
}

export function getFutureDates(startInDays: number = 7, endInDays: number = 14): { startDate: string, endDate: string } {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + startInDays);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + endInDays);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function waitForPageWithAssertions(
  page: Page,
  pageUrl: string,
  statusCode: number,
  assertionCallback: (page) => Promise<void>,
  timeout = 45000,
  intervals = [4000]
) {
  await expect(async () => {
    await page.route('**/*.{png,jpg,webp}', (route) => route.abort());
    const response = await page.goto(pageUrl);
    expect(response.status()).toBe(statusCode);

    // Execute additional assertions
    if (assertionCallback) {
      await assertionCallback(page);
    }
  }).toPass({
    timeout,
    intervals,
  });
}
