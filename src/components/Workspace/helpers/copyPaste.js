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
export function cloneElement(
  element,
  offset = {
    x: 0,
    y: 0,
  }
) {
  return {
    ...omit(clone(element), [
      'parentId',
      'id',
      'controls',
    ]),
    uuid: uuidV1(),
    x: element.x + offset.x,
    y: element.y + offset.y,
    originalPositionBeforeDrag: {
      x: element.x + offset.x,
      y: element.y + offset.y,
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
export function createClonedElements(
  source,
  ids = false,
  offset = {
    x: 0,
    y: 0,
  }
) {
  let clonedElements;
  if (ids) {
    return ids.filter(o => has(source, o))
      .reduce((acc, current) => {
        clonedElements = acc;
        const newElem = cloneElement(source[current], offset);
        clonedElements[newElem.uuid] = newElem;
        return clonedElements;
      }, {});
  }
  clonedElements = {};
  Object.values(source).forEach(o => {
    const newElem = cloneElement(o, offset);
    clonedElements[newElem.uuid] = newElem;
  });
  return clonedElements;
}

export function computeCopyPasteOffset() {
  let baseOffset = 0;
  let pastePosition;
  if (this.state.selectedItems.length) {
    pastePosition = this.centralSelectionPoint;
    baseOffset = constants.COPY_PASTE_OFFSET;
  } else {
    const workspaceBox = this.workspace.getBoundingClientRect();
    pastePosition = {
      x: Math.round((workspaceBox.right - workspaceBox.left) / 2),
      y: Math.round((workspaceBox.bottom - workspaceBox.top) / 2),
    };
  }

  return {
    x: pastePosition.x - this.centralItemsClipboardPoint.x + baseOffset,
    y: pastePosition.y - this.centralItemsClipboardPoint.y + baseOffset,
  };
}


/**
 * Handling of the pasting of the clipboard
 */
export function pasteClipboard() {
  const { shapes, texts } = this.state;
  const offset = this.computeCopyPasteOffset();

  // the pasted shapes
  const newShapes = createClonedElements(this.shapesClipboard, undefined, offset);

  // the pasted texts
  const newTexts = createClonedElements(this.textsClipboard, undefined, offset);

  // the newly pasted element ids
  const newSelectedItems = [...Object.keys(newShapes), ...Object.keys(newTexts)];

  this.setState({
    shapes: Object.assign(shapes, newShapes),
    texts: Object.assign(texts, newTexts),
  }, () => {
    const { selectedPrototype, user } = this.props.application;

    // save elements
    newSelectedItems.forEach(o => {
      if (has(newShapes, o)) {
        this.props.actions.createShape(
          selectedPrototype,
          this.state.currentPageId,
          this.state.shapes[o],
          user.token
        );
      } else if (has(newTexts, o)) {
        this.props.actions.createText(
          selectedPrototype,
          this.state.currentPageId,
          this.state.texts[o],
          user.token
        );
      }
    });

    this.centralSelectionPoint = this.getCentralPointOfSelection(newSelectedItems);

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
