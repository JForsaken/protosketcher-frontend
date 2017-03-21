import { merge, cloneDeep } from 'lodash';

export const cloneMerge = (sourceObj, newObj) => merge(cloneDeep(sourceObj), newObj);
