/* Node modules */
import { has, clone } from 'lodash';

/* Constants */
import * as constants from '../../constants';


/**
 * Delete the svg element
 * @param {string} uuid the id of the element to delete
 */
export function deleteSvgItem(uuid, mementoId) {
  const { shapes, texts, currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;

  const id = this.getRealId(uuid);
  let element = null;

  if (has(shapes, uuid)) {
    element = { type: 'shape', object: clone(shapes[uuid]) };
    delete shapes[uuid];
    delete this.itemsList[id];
    this.props.actions.deleteShape(selectedPrototype, currentPageId, id, user.token);
  } else if (has(texts, uuid)) {
    element = { type: 'text', object: clone(texts[uuid]) };
    delete texts[uuid];
    delete this.itemsList[id];
    this.props.actions.deleteText(selectedPrototype, currentPageId, id, user.token);
  }

  // for undo
  this.extractDeletedElementMoment(uuid, element, mementoId);

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
  const relativePoint = {
    x: point.x - path.position.x,
    y: point.y - path.position.y,
  };
  path.pathString += `${prefix}${relativePoint.x} ${relativePoint.y} `;
  path.pathArray.push(relativePoint);
  this.setState({
    currentPath: path,
  });
}


/**
 * Creates an entire SVG path string from an array of points
 * @param {Array} the array of points
 */
export function createSvgPathFromArray(points) {
  const path = this.state.currentPath;
  let newPathString = '';
  let prefix;
  for (let i = 0; i < points.length; i++) {
    prefix = i === 0 ? 'M' : 'L';
    newPathString += `${prefix}${points[i].x} ${points[i].y} `;
  }
  path.pathString = newPathString;
  this.setState({
    currentPath: path,
  });
}


/**
 * Find the shortest distance between a point and a line
 * http://stackoverflow.com/questions/7538519/how-to-get-subarray-from-array
 * @param {Object} the target point
 * @param {Object} the first point defining the line
 * @param {Object} the second point defining the line
 */
function perpendicularDistance(point, linePoint1, linePoint2) {
  const A = point.x - linePoint1.x;
  const B = point.y - linePoint1.y;
  const C = linePoint2.x - linePoint1.x;
  const D = linePoint2.y - linePoint1.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  // in case of 0 length line
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx;
  let yy;

  if (param < 0) {
    xx = linePoint1.x;
    yy = linePoint1.y;
  }
  else if (param > 1) {
    xx = linePoint2.x;
    yy = linePoint2.y;
  }
  else {
    xx = linePoint1.x + param * C;
    yy = linePoint1.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}


/**
 * Reduces a number of points inside an array using Douglas-Peucker Algorithm
 * @param {Array} the array of points
 * @param {Number} the epsilon
 */
export function douglasPeuckerPointsReducer(points, epsilon) {
  // Find the point with the maximum distance
  let dmax = 0;
  let index = 0;
  const end = points.length;
  for (let i = 1; i < end - 1; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end - 1]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }
  // If max distance is greater than epsilon, recursively simplify
  let resultPoints;
  if (dmax > epsilon) {
    // Recursive call
    const recResults1 = douglasPeuckerPointsReducer(points.slice(0, index + 1), epsilon);
    const recResults2 = douglasPeuckerPointsReducer(points.slice(index, end), epsilon);

    // Build the result list
    resultPoints = recResults1.slice(0, recResults1.length - 1)
        .concat(recResults2.slice(0, recResults1.length));
  } else {
    resultPoints = [points[0], points[end]];
  }
  // Return the result
  return resultPoints;
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
