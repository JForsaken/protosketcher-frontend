/* Node modules */
import { cloneDeep, isArray, omit, isEmpty } from 'lodash';
import uuidV1 from 'uuid/v1';


export function extractCreatedElementMoment(id, uuid, element, type) {
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

    if (this.groupCopy.group && this.groupCopy.group.includes(uuid)) {
      if (!this.memento[this.groupCopy.mementoId]) {
        this.memento[this.groupCopy.mementoId] = [];
      }
      this.memento[this.groupCopy.mementoId].push(lastAction);
      this.groupCopy.group = this.groupCopy.group.filter(o => o !== uuid);
    } else {
      this.memento.push(lastAction);
    }
  } else {
    this.isUndoing = this.isUndoing.filter(o => o !== uuid);
  }
}

export function extractMovedElementMoment(uuid, element, type) {
  return {
    action: 'move',
    element: {
      type,
      uuid,
      object: {
        ...omit(element, ['originalPositionBeforeDrag']),
        x: element.originalPositionBeforeDrag.x,
        y: element.originalPositionBeforeDrag.y,
      },
    },
  };
}

export function extractDeletedElementMoment(uuid, element, mementoId) {
  if (!this.isUndoing.includes(uuid)) {
    const lastAction = {
      action: 'delete',
      element,
    };

    // if group
    if (mementoId >= 0) {
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

export function undo() {
  const { currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;
  let shouldSetState = true;
  let shapes = cloneDeep(this.state.shapes);
  let texts = cloneDeep(this.state.texts);

  // Closure in which the undo will be applied
  const apply = (last) => {
    const ref = last;

    switch (ref.action) {
      case 'delete': {
        const uuid = ref.element.object.uuid || uuidV1();
        ref.element.object.uuid = uuid;

        this.isUndoing.push(uuid);

        if (ref.element.type === 'shape') {
          this.props.actions.createShape(selectedPrototype,
                                         currentPageId,
                                         { ...ref.element.object, uuid },
                                         user.token);
          shapes = {
            ...shapes,
            [uuid]: omit(ref.element.object, ['id']),
          };
        } else {
          this.props.actions.createText(selectedPrototype,
                                        currentPageId,
                                        { ...ref.element.object, uuid },
                                        user.token);
          texts = {
            ...texts,
            [uuid]: omit(ref.element.object, ['id']),
          };
        }
        break;
      }
      case 'create':
        shouldSetState = false;
        this.isUndoing.push(ref.element.object.uuid);
        this.deleteSvgItem(ref.element.object.uuid);
        break;
      case 'move':
        if (ref.element.type === 'shape') {
          shapes = {
            ...shapes,
            [ref.element.uuid]: ref.element.object,
          };
        } else {
          texts = {
            ...texts,
            [ref.element.uuid]: ref.element.object,
          };
        }
        break;
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
  // const { currentPageId } = this.state;
  // const { selectedPrototype, user } = this.props.application;
  let shouldSetState = true;

  const shapes = cloneDeep(this.state.shapes);
  const texts = cloneDeep(this.state.texts);

  // Closure in which the redo will be applied
  const apply = (last) => {
    const ref = last;

    switch (ref.action) {
      case 'delete':
        shouldSetState = false;
        this.isUndoing.push(ref.element.object.uuid);
        this.deleteSvgItem(ref.element.object.uuid);
        delete ref.element.object.uuid;
        break;
      case 'create':
        break;
      case 'move':
        break;
      default:
        break;
    }
  };

  if (!isEmpty(this.keepsake)) {
    const last = this.keepsake.pop();

    // keep track of the undos
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
