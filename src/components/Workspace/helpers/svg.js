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
  const shapes = this.state.shapes;
  const texts = this.state.texts;
  let newUuid;

  if (has(shapes, uuid)) {
    const shape = shapes[uuid];
    const newShape = cloneElement(uuid, shape, shapes);
    newUuid = newShape.uuid;

    this.setState({
      shapes: this.updateSelectionOriginalPosition([uuid], { ...shapes, newShape }),
    });
  } else if (has(texts, uuid)) {
    const text = shapes[uuid];
    const newText = cloneElement(uuid, text, texts);
    newUuid = newText.uuid;

    this.setState({
      texts: this.updateSelectionOriginalPosition([uuid], shapes, { ...texts, newText }),
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
