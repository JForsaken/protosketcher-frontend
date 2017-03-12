/* Node modules */
import { has } from 'lodash';

/* Helpers */
import { cloneElement } from './copyPaste.js';


/**
 * Copy the svg element and update its original position of selection
 * @param {string} uuid The id of the element to copy
 * @returns {string} The id of the newly copied element
 */
export function copySvgItem(uuid) {
  const { shapes, texts } = this.state;
  let newUuid;

  if (has(shapes, uuid)) {
    const shape = shapes[uuid];
    const newShape = cloneElement(uuid, shape, shapes);
    newUuid = newShape.uuid;

    this.setState({
      shapes: this.updateSelectionOriginalPosition([uuid], {
        ...shapes,
        [newUuid]: newShape,
      }).shapes,
    });
  } else if (has(texts, uuid)) {
    const text = texts[uuid];
    const newText = cloneElement(uuid, text, texts);
    newUuid = newText.uuid;

    this.setState({
      texts: this.updateSelectionOriginalPosition([uuid], shapes, {
        ...texts,
        [newUuid]: newText,
      }).texts,
    });
  }

  return newUuid;
}


/**
 * Delete the svg element
 * @param {string} uuid the id of the element to delete
 */
export function deleteSvgItem(uuid) {
  const { shapes, texts, currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;

  if (has(shapes, uuid)) {
    delete shapes[uuid];
    this.props.actions.deleteShape(selectedPrototype, currentPageId, uuid, user.token);
  } else if (has(texts, uuid)) {
    delete texts[uuid];
    this.props.actions.deleteText(selectedPrototype, currentPageId, uuid, user.token);
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
