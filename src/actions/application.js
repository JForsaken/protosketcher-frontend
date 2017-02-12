import * as constants from './constants';
import { put } from '../persistence/storage';

export function switchLocale(locale) {
  return { type: constants.LOCALE_SWITCHED, payload: locale };
}

export function hideError() {
  return { type: constants.HIDE_ERROR };
}

export function selectPrototype(id) {
  put('selectedPrototype', id);
  return { type: constants.SELECT_PROTOTYPE, id };
}

export function selectPage(id) {
  return { type: constants.SELECT_PAGE, id };
}

export function updateWorkspace(data) {
  return { type: constants.UPDATE_WORKSPACE, data };
}
