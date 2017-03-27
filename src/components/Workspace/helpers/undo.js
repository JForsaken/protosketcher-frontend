/* Node modules */
import { cloneDeep, isArray, omit, isEmpty } from 'lodash';

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
        const { uuid } = last.element.object;
        this.isUndoing = uuid;

        if (last.element.type === 'shape') {
          this.props.actions.createShape(selectedPrototype,
                                       currentPageId,
                                       last.element.object,
                                       user.token);
          shapes = {
            ...shapes,
            [uuid]: omit(last.element.object, ['id']),
          };
        } else {
          this.props.actions.createText(selectedPrototype,
                                      currentPageId,
                                      last.element.object,
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
        this.isUndoing = last.element.object.uuid;
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
  if (!isEmpty(this.lastActions)) {
    const last = this.lastActions.pop();

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

