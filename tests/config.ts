import * as dotenv from 'dotenv';
dotenv.config();

export const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const appConfig = {
  STRAPI_URL: process.env.USE_QA === 'true' ? process.env.STRAPI_QA_URL : process.env.STRAPI_LOCAL_URL,
  STRAPI_QA_URL: process.env.STRAPI_QA_URL,
  STRAPI_LOCAL_URL: process.env.STRAPI_LOCAL_URL,
  SITE_URL: process.env.SITE_URL,
  STRAPI_LOGIN_EMAIL: process.env.STRAPI_EMAIL,
  STRAPI_LOGIN_PASSWORD: process.env.STRAPI_PASSWORD,
  STRAPI_REG_EMAIL: "<STRAPI_REG_EMAIL>",
  STRAPI_REG_PASSWORD: "<STRAPI_REG_PASSWORD>",
  STRAPI_REG_FIRST_NAME: "<STRAPI_REG_FIRST_NAME>",
  STRAPI_REG_LAST_NAME: "<STRAPI_REG_LAST_NAME>",
  REQUEST_HEADERS,
};
