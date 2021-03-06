import * as constants from './constants';
import { put, remove } from '../persistence/storage';

export function switchLocale(locale) {
  put('locale', locale);
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

export function showElements(list) {
  return { type: constants.SHOW_ELEMENTS, elements: list };
}

export function hideElements(list) {
  return { type: constants.HIDE_ELEMENTS, elements: list };
}

export function logout() {
  remove('token');
  remove('locale');
  remove('selectedPrototype');
  remove('selectedPage');
  return { type: constants.LOGOUT };
}

export function redirectToDashboard() {
  remove('selectedPrototype');
  remove('selectedPage');
  return { type: constants.REDIRECT_DASHBOARD };
}

export function toggleSimulation() {
  return { type: constants.TOGGLE_SIMULATION };
}

export function backToLanding() {
  remove('selectedPrototype');
  remove('selectedPage');
  return { type: constants.REDIRECT_LANDING };
}
