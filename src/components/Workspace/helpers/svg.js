/* Node modules */
import { has, clone } from 'lodash';

/* Constants */
import * as constants from '../../constants';


/**
 * Delete the svg element
 * @param {string} uuid the id of the element to delete
 */
export function deleteSvgItem(uuid) {
  const { shapes, texts, currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;

  const id = this.getRealId(uuid);
  let element = null;

  if (has(shapes, uuid)) {
    element = { type: 'shape', object: clone(shapes[uuid]) };
    delete shapes[uuid];
    delete this.svgShapes[id];
    this.props.actions.deleteShape(selectedPrototype, currentPageId, id, user.token);
  } else if (has(texts, uuid)) {
    element = { type: 'text', object: clone(texts[uuid]) };
    delete texts[uuid];
    delete this.svgTexts[id];
    this.props.actions.deleteText(selectedPrototype, currentPageId, id, user.token);
  }

  if (this.isUndoing !== uuid) {
    this.lastActions.push({
      action: 'delete',
      element,
    });
  } else {
    this.isUndoing = null;
  }

  this.setState({
    shapes,
    texts,
  });
}


/**
 * Builds an SVG path string
 * @param {Object} point the position of the path
 * @param {String} prefix the SVG prefix
 */
export function computeSvgPath(point, prefix) {
  const path = this.state.currentPath;
  path.pathString += `${prefix}${point.x - path.position.x} ${point.y - path.position.y} `;
  this.setState({
    currentPath: path,
  });
}


/**
 * Translate the whole SVG path
 * @param {Object} translation The translation to be applied to the SVG path
 */
export function dragItems(translation) {
  const { shapes, texts, selectedItems } = this.state;

  selectedItems.forEach((uuid) => {
    if (has(shapes, uuid)) {
      shapes[uuid].x = shapes[uuid].originalPositionBeforeDrag.x + translation.x;
      shapes[uuid].y = shapes[uuid].originalPositionBeforeDrag.y + translation.y;
    } else if (has(texts, uuid)) {
      texts[uuid].x = texts[uuid].originalPositionBeforeDrag.x + translation.x;
      texts[uuid].y = texts[uuid].originalPositionBeforeDrag.y + translation.y;
    }
  });

  this.setState({
    shapes,
    texts,
  });
}


/**
 * If of not the points are long enough to be fed and appended to the SVG path
 * @param {Object} currentPoint the current position where the segment would continue to
 * @returns {Boolean} Is true if the points are long enough to be fed and appended
 */
export function arePointsFeedable(currentPoint) {
  const a = this.state.previousPoint.x - currentPoint.x;
  const b = this.state.previousPoint.y - currentPoint.y;
  const c = Math.sqrt(a * a + b * b);

  return c > constants.paths.SEGMENT_LENGTH;
}
