/* Node modules */
import { cloneDeep, isArray, omit, isEmpty } from 'lodash';
import uuidV1 from 'uuid/v1';


export function undo() {
  const { currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;
  let shouldSetState = true;
  let shapes = cloneDeep(this.state.shapes);
  let texts = cloneDeep(this.state.texts);

  // Closure in which the undo will be applied
  const apply = (last) => {
    switch (last.action) {
      case 'delete': {
        const uuid = last.element.object.uuid || uuidV1();

        this.isUndoing.push(uuid);

        if (last.element.type === 'shape') {
          this.props.actions.createShape(selectedPrototype,
                                         currentPageId,
                                         { ...last.element.object, uuid },
                                         user.token);
          shapes = {
            ...shapes,
            [uuid]: omit(last.element.object, ['id']),
          };
        } else {
          this.props.actions.createText(selectedPrototype,
                                        currentPageId,
                                        { ...last.element.object, uuid },
                                        user.token);
          texts = {
            ...texts,
            [uuid]: omit(last.element.object, ['id']),
          };
        }
        break;
      }
      case 'create':
        shouldSetState = false;
        this.isUndoing.push(last.element.object.uuid);
        this.deleteSvgItem(last.element.object.uuid);
        break;
      case 'move':
        if (last.element.type === 'shape') {
          shapes = {
            ...shapes,
            [last.element.uuid]: last.element.object,
          };
        } else {
          texts = {
            ...texts,
            [last.element.uuid]: last.element.object,
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
