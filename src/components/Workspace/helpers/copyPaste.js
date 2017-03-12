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


/**
 * Creates a set of new elements matching the ids in the clipboard
 * @param {Object} source The whole map object containing the shapes or text, depends of the element
 * @param {Array} clipboard The ids of the element that are being copy-pasted
 * @param {Number} offset The offset where the element will be offsetted compared the the original
 * @returns {Object} The cloned elements
 */
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


/**
 * Handling of the pasting of the clipboard
 */
export function pasteClipboard() {
  const { shapes, texts } = this.state;
  const offset = constants.COPY_PASTE_OFFSET;

  // the pasted shapes
  const clipboardShapes = createPastedClipboard(shapes, this.clipboard, offset);

  // the pasted controls
  const clipboardTexts = createPastedClipboard(texts, this.clipboard, offset);

  // the newly pasted element ids
  const newSelectedItems = [...Object.keys(clipboardShapes), ...Object.keys(clipboardTexts)];

  // save path of the pasted elements in case they were to be dragged afterwards
  const items = this.updateSelectionOriginalPosition(newSelectedItems);
  this.setState({
    shapes: {
      ...shapes,
      ...items.shapes,
    },
    texts: {
      ...texts,
      ...items.shapes,
    },
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
  const newSelectedItems = [];
  selectedItems.forEach(o => newSelectedItems.push(this.copySvgItem(o)));

  this.selectedItemsCopied = true;
  this.setState({ selectedItems: newSelectedItems });
}
