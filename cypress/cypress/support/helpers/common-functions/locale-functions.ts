import * as dictCn from '../../../../src/dictionaries/cn.json';
import * as dictKr from '../../../../src/dictionaries/kr.json';
import * as dictEn from '../../../../src/dictionaries/en.json';

export function getDictionary(locale: string) {
  let dict;

  if (locale === 'en') {
    dict = dictEn;
  } else if (locale === 'kr') {
    dict = dictKr;
  } else if (locale === 'cn') {
    dict = dictCn;
  } else {
    throw new Error('Invalid locale');
  }

  return dict;
}

export function getLocales() {
  const locales = Cypress.env('locales');
  let locale = [];
  for (const key in locales) {
    locale.push(locales[key]);
  }
  return locale;
}

export function getQaseID(locale: string, startId = 150, interval = 100) {
  let qaseID;
  if (locale === 'en') {
    qaseID = startId;
  } else if (locale === 'kr') {
    qaseID = startId + interval;
  } else if (locale === 'cn') {
    qaseID = startId + interval * 2;
  } else {
    throw new Error('Invalid locale');
  }

  return qaseID;
}
