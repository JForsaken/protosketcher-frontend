import * as constants from './constants';
import { put, remove } from '../persistence/storage';

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

export function logout() {
  remove('token');
  remove('selectedPrototype');
  remove('selectedPage');
  return { type: constants.LOGOUT };
}

export function backToDashboard() {
  remove('selectedPrototype');
  remove('selectedPage');
  return { type: constants.REDIRECT_DASHBOARD };
}
