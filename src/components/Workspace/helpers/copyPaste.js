/* Node modules */
import { omit, has, clone } from 'lodash';
import uuidV1 from 'uuid/v1';

export function cloneElement(elementId, element, source, offset = 0) {
  return {
    ...omit(clone(source[elementId], [
      'originalPositionBeforeDrag',
      'parentId',
      'controls',
    ])),
    uuid: uuidV1(),
    x: source[elementId].x + offset,
    y: source[elementId].y + offset,
  };
}

export function createPastedClipboard(source, clipboard, offset = 0) {
  return clipboard.filter(o => has(source, o))
    .reduce((acc, current) => {
      const accCopy = acc;
      const newElem = cloneElement(current,
                                   source[current],
                                   source,
                                   offset);
      accCopy[newElem.uuid] = newElem;
      return accCopy;
    }, {});
}
