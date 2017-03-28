/* Node modules */
import { cloneDeep, isArray, omit, isEmpty } from 'lodash';
import uuidV1 from 'uuid/v1';


export function extractCreatedElementMoment(id, uuid, element, type) {
  // when we do a new organic action, we clear the keepsake
  this.keepsake = [];

  if (!this.isUndoing.includes(uuid)) {
    const lastAction = {
      action: 'create',
      element: {
        type,
        object: {
          ...element,
          uuid,
          id,
        },
      },
    };

    // if it was a multi create
    if (this.groupCopy.group && this.groupCopy.group.includes(uuid)) {
      /* create an array that will be filled with the create action
       * that will be considered as a single action
       */
      if (!this.memento[this.groupCopy.mementoId]) {
        this.memento[this.groupCopy.mementoId] = [];
      }
      // push the current create into the group action
      this.memento[this.groupCopy.mementoId].push(lastAction);
      // remove itselft from the group ids since it has been added
      this.groupCopy.group = this.groupCopy.group.filter(o => o !== uuid);
    } else {
      this.memento.push(lastAction);
    }
  } else {
    this.isUndoing = this.isUndoing.filter(o => o !== uuid);
  }
}

export function extractMovedElementMoment(uuid, element, type) {
  // when we do a new organic action, we clear the keepsake
  this.keepsake = [];

  return {
    action: 'move',
    element: {
      type,
      uuid,
      // clone since if the element moves, it would have been affected since its a reference
      object: cloneDeep(element),
    },
  };
}

export function extractDeletedElementMoment(uuid, element, mementoId) {
  // when we do a new organic action, we clear the keepsake
  this.keepsake = [];

  if (!this.isUndoing.includes(uuid)) {
    const lastAction = {
      action: 'delete',
      element,
    };

    // if multi delete
    if (mementoId >= 0) {
      /* create an array that will be filled with the create action
       * that will be considered as a single action
       */
      if (!this.memento[mementoId]) {
        this.memento[mementoId] = [];
      }
      this.memento[mementoId].push(lastAction);
    } else {
      this.memento.push(lastAction);
    }
  } else {
    this.isUndoing = this.isUndoing.filter(o => o === uuid);
  }
}

export function deleteElem(moment) {
  this.isUndoing.push(moment.element.object.uuid);
  this.deleteSvgItem(moment.element.object.uuid);
}

function moveElem(moment, shapes, texts, isUndo) {
  const elem = cloneDeep(moment.element.object);
  let shapesRef = shapes;
  let textsRef = texts;

  /* Toggles between the 'originalPositionBeforeDrag' and the current
   * position depending if we are undoing or redoing
   */
  if (isUndo) {
    elem.x = elem.originalPositionBeforeDrag.x;
    elem.y = elem.originalPositionBeforeDrag.y;
  }

  if (moment.element.type === 'shape') {
    shapesRef = {
      ...shapesRef,
      [moment.element.uuid]: { ...omit(elem, ['originalPositionBeforeDrag']) },
    };
  } else {
    textsRef = {
      ...textsRef,
      [moment.element.uuid]: { ...omit(elem, ['originalPositionBeforeDrag']) },
    };
  }

  return { shapes: shapesRef, texts: textsRef };
}

export function createElem(moment, shapes, texts) {
  const { currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;
  let shapesRef = shapes;
  let textsRef = texts;

  // depending on if the shape was existing on the DB already
  const uuid = moment.element.object.uuid || uuidV1();

  this.isUndoing.push(uuid);

  if (moment.element.type === 'shape') {
    this.props.actions.createShape(selectedPrototype,
                                   currentPageId,
                                   { ...moment.element.object, uuid },
                                   user.token);
    shapesRef = {
      ...shapes,
      [uuid]: omit(moment.element.object, ['id']),
    };
  } else {
    this.props.actions.createText(selectedPrototype,
                                  currentPageId,
                                  { ...moment.element.object, uuid },
                                  user.token);
    textsRef = {
      ...texts,
      [uuid]: omit(moment.element.object, ['id']),
    };
  }

  return { uuid, shapes: shapesRef, texts: textsRef };
}

export function undo() {
  let shapes = cloneDeep(this.state.shapes);
  let texts = cloneDeep(this.state.texts);

  let shouldSetState = true;

  // Closure in which the undo will be applied
  const apply = (last) => {
    const ref = last;

    switch (ref.action) {
      case 'delete': {
        const {
          uuid,
          shapes: updatedShapes,
          texts: updatedTexts } = this.createElem(ref, shapes, texts);
        shapes = updatedShapes;
        texts = updatedTexts;
        ref.element.object.uuid = uuid;
        break;
      }
      case 'create':
        /* if we 'setState' upon a deleteElem,
         * the element would not have been deleted from the Workspace state
         */
        shouldSetState = false;
        this.deleteElem(ref, shapes, texts);
        break;
      case 'move': {
        const { shapes: updatedShapes, texts: updatedTexts } = moveElem(ref, shapes, texts, true);
        shapes = updatedShapes;
        texts = updatedTexts;
        break;
      }
      default:
        break;
    }
  };

  // Only apply undo if there exist last actions
  if (!isEmpty(this.memento)) {
    const last = this.memento.pop();

    // keep track of the undos
    this.keepsake.push(last);

    // if it was a multi action or a single action
    if (isArray(last)) {
      last.forEach(o => apply(o));
    } else {
      apply(last);
    }

    // set state if needed
    if (shouldSetState) {
      this.setState({
        shapes,
        texts,
      });
    }
  }
}

export function redo() {
  let shapes = cloneDeep(this.state.shapes);
  let texts = cloneDeep(this.state.texts);

  let shouldSetState = true;

  // Closure in which the redo will be applied
  const apply = (last) => {
    const ref = last;

    switch (ref.action) {
      case 'delete':
        /* if we 'setState' upon a deleteElem,
        * the element would not have been deleted from the Workspace state
        */
        shouldSetState = false;
        this.deleteElem(ref, shapes, texts);
        delete ref.element.object.uuid;
        break;
      case 'create': {
        const {
          uuid,
          shapes: updatedShapes,
          texts: updatedTexts } = this.createElem(ref, shapes, texts);
        shapes = updatedShapes;
        texts = updatedTexts;
        ref.element.object.uuid = uuid;
        break;
      }
      case 'move': {
        const { shapes: updatedShapes, texts: updatedTexts } = moveElem(ref, shapes, texts);
        shapes = updatedShapes;
        texts = updatedTexts;
        break;
      }
      default:
        break;
    }
  };

  // Only apply undo if a keepsake exist
  if (!isEmpty(this.keepsake)) {
    const last = this.keepsake.pop();

    // restore the used keepsake to the memento
    this.memento.push(last);

    // if it was a multi action or a single action
    if (isArray(last)) {
      last.forEach(o => apply(o));
    } else {
      apply(last);
    }

    // set state if needed
    if (shouldSetState) {
      this.setState({
        shapes,
        texts,
      });
    }
  }
}
