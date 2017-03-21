/* Node modules */
import { omit, has, clone } from 'lodash';
import uuidV1 from 'uuid/v1';

/* Constants */
import * as constants from '../../constants';


/**
 * Clones the element (shapes/text)
 * @param {String} elementId The id of the element
 * @param {Object} element The element itself (shape/text)
 * @param {Object} source The whole map object containing the shapes or text, depends of the element
 * @param {Number} offset The offset where the element will be offsetted compared the the original
 * @returns {Object} The cloned element
 */
export function cloneElement(element, offset = 0) {
  return {
    ...omit(clone(element), [
      'parentId',
      'id',
      'controls',
    ]),
    uuid: uuidV1(),
    x: element.x + offset,
    y: element.y + offset,
    originalPositionBeforeDrag: {
      x: element.originalPositionBeforeDrag.x + offset,
      y: element.originalPositionBeforeDrag.y + offset,
    },
    controls: {},
  };
}


/**
 * Creates a set of new elements matching an array of Ids
 * @param {Object} source The whole map object containing the shapes or text, depends of the element
 * @param {Array} ids The array of ids of the elements that needs to be cloned
 * @param {Number} offset The offset where the element will be offsetted compared the the original
 * @returns {Object} The cloned elements
 */
export function createClonedElements(source, ids, offset = 0) {
  return ids.filter(o => has(source, o))
    .reduce((acc, current) => {
      const accCopy = acc;
      const newElem = cloneElement(source[current], offset);
      accCopy[newElem.uuid] = newElem;
      return accCopy;
    }, {});
}


/**
 * Handling of the pasting of the clipboard
 */
export function pasteClipboard() {
  const { shapes, texts } = this.state;
  const offset = constants.COPY_PASTE_OFFSET;

  // the pasted shapes
  const clipboardShapes = createClonedElements(shapes, this.clipboard, offset);

  // the pasted texts
  const clipboardTexts = createClonedElements(texts, this.clipboard, offset);

  // the newly pasted element ids
  const newSelectedItems = [...Object.keys(clipboardShapes), ...Object.keys(clipboardTexts)];

  this.setState({
    shapes: Object.assign(shapes, clipboardShapes),
    texts: Object.assign(texts, clipboardTexts),
  }, () => {
    const { selectedPrototype, user } = this.props.application;

    // save elements
    newSelectedItems.forEach(o => {
      if (has(clipboardShapes, o)) {
        this.props.actions.createShape(
          selectedPrototype,
          this.state.currentPageId,
          this.state.shapes[o],
          user.token
        );
      } else if (has(clipboardTexts, o)) {
        this.props.actions.createText(
          selectedPrototype,
          this.state.currentPageId,
          this.state.texts[o],
          user.token
        );
      }
    });

    this.centralSelectionPoint = this.getCentralPointOfSelection();

    this.setState({
      selectedItems: newSelectedItems,
    });
  });
}


/**
 * Copy the elements to the clipboard
 * @param {Array} selectedItems The ids of the elements that will be copied
 */
export function copySelectedItems(selectedItems = this.state.selectedItems) {
  const { shapes, texts } = this.state;

  const newShapes = createClonedElements(shapes, selectedItems);
  const newTexts = createClonedElements(texts, selectedItems);

  const newSelectedItems = [...Object.keys(newShapes), ...Object.keys(newTexts)];

  this.selectedItemsCopied = true;
  this.setState({
    shapes: Object.assign(shapes, newShapes),
    texts: Object.assign(texts, newTexts),
    selectedItems: newSelectedItems,
  });
}
