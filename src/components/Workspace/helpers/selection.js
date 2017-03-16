/* Node modules */
import { has } from 'lodash';

/* Constants */
import * as constants from '../../constants';


/**
 * Return the central point of the selected element's bounding boxes
 * @param {Object} selectedItems The ids of the selected items, contained in an array
 */
export function getCentralPointOfSelection(selectedItems = this.state.selectedItems) {
  let right = 0;
  let left = Number.MAX_SAFE_INTEGER;
  let top = 0;
  let bottom = Number.MAX_SAFE_INTEGER;

  const svgPool = { ...this.svgShapes, ...this.svgTexts };
  for (const uuid of selectedItems) {
    const box = svgPool[uuid].getBoundingClientRect();

    right = Math.max(right, box.right);
    left = Math.min(left, box.left);
    top = Math.max(top, box.top);
    bottom = Math.min(bottom, box.bottom);
  }

  // Translate the box to account for menus
  right -= constants.LEFT_MENU_WIDTH;
  left -= constants.LEFT_MENU_WIDTH;
  top -= constants.TOP_MENU_HEIGHT;
  bottom -= constants.TOP_MENU_HEIGHT;

  return {
    x: left + Math.round((right - left) / 2),
    y: top + Math.round((bottom - top) / 2),
  };
}


/**
 * Mutates the shapes and texts passed to update their original position before drag
 * @param {Array} uuids The ids of the selected shapes/texts
 * @param {Object} _shapes All the shapes of the current page
 * @param {Object} _texts All the texts of the current page
 * @returns {Object} An object containing the shapes and texts containing the updated information
 */
export function updateSelectionOriginalPosition(uuids = this.state.selectedItems,
                                                _shapes = this.state.shapes,
                                                _texts = this.state.texts) {
  const shapes = _shapes;
  const texts = _texts;

  uuids.forEach(uuid => {
    if (has(shapes, uuid)) {
      shapes[uuid].originalPositionBeforeDrag = {
        x: shapes[uuid].x,
        y: shapes[uuid].y,
      };
    } else if (has(texts, uuid)) {
      texts[uuid].originalPositionBeforeDrag = {
        x: texts[uuid].x,
        y: texts[uuid].y,
      };
    }
  });

  return { shapes, texts };
}


/**
 * Applies a selection of a single shape or a single text
 * @param {String} uuid The id of the selected shape/text
 */
export function monoSelect(uuid) {
  this.selectionDirty = true;
  const items = this.updateSelectionOriginalPosition([uuid]);
  this.centralSelectionPoint = this.getCentralPointOfSelection([uuid]);
  this.setState({
    selectedItems: [uuid],
    shapes: items.shapes,
    texts: items.texts,
  });
}


/**
 * Applies a multiple element selection on the ending event of the cursor
 * @param {Object} pointerPos The position of the cursor on ending event of the cursor
 */
export function multiSelect(pointerPos) {
  const { currentPos } = this.props.application.workspace;

  const selectRectRight = pointerPos.x < currentPos.x ? currentPos.x : pointerPos.x;
  const selectRectLeft = pointerPos.x > currentPos.x ? currentPos.x : pointerPos.x;
  const selectRectTop = pointerPos.y > currentPos.y ? currentPos.y : pointerPos.y;
  const selectRectBottom = pointerPos.y < currentPos.y ? currentPos.y : pointerPos.y;

  // const svgPool = { ...this.svgShapes, ...this.svgTexts };

  const selectedItems = Object.keys({
    ...this.state.shapes,
    ...this.state.texts,
  }).filter((key) => {
    // If the selected shape has not been created in the backend yet
    // if (!has(svgPool, key)) {
    //   return false;
    // }

    // FIXME use React refs instead of getElementById
    const box = document.getElementById(key).getBoundingClientRect();
    const pathRectRight = box.right - constants.LEFT_MENU_WIDTH;
    const pathRectLeft = box.left - constants.LEFT_MENU_WIDTH;
    const pathRectTop = box.top - constants.TOP_MENU_HEIGHT;
    const pathRectBottom = box.bottom - constants.TOP_MENU_HEIGHT;

    return pathRectRight <= selectRectRight && pathRectLeft >= selectRectLeft
      && pathRectTop >= selectRectTop && pathRectBottom <= selectRectBottom;
  });

  const items = this.updateSelectionOriginalPosition(selectedItems);
  this.centralSelectionPoint = this.getCentralPointOfSelection(selectedItems);

  this.setState({
    selectedItems,
    shapes: items.shapes,
    texts: items.texts,
  });
}
