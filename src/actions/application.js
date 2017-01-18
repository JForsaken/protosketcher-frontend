import * as constants from './constants';

export function switchLocale(locale) {
  return { type: constants.LOCALE_SWITCHED, payload: locale };
}

export function hideError() {
  return { type: constants.HIDE_ERROR };
}
