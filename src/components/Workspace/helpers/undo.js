/* Node modules */
import { omit, isEmpty } from 'lodash';

export function undo() {
  const { currentPageId } = this.state;
  const { selectedPrototype, user } = this.props.application;

  if (!isEmpty(this.lastActions)) {
    const last = this.lastActions.pop();

    switch (last.action) {
      case 'delete': {
        const { uuid } = last.element.object;
        this.isUndoing = uuid;

        if (last.element.type === 'shape') {
          this.props.actions.createShape(selectedPrototype,
                                        currentPageId,
                                        last.element.object,
                                        user.token);
          this.setState({
            shapes: {
              ...this.state.shapes,
              [uuid]: omit(last.element.object, ['id']),
            },
          });
        } else {
          this.props.actions.createText(selectedPrototype,
                                        currentPageId,
                                        last.element.object,
                                        user.token);
          this.setState({
            texts: {
              ...this.state.texts,
              [uuid]: omit(last.element.object, ['id']),
            },
          });
        }
        break;
      }
      case 'create':
        this.isUndoing = last.element.object.uuid;
        this.deleteSvgItem(last.element.object.uuid);
        break;
      case 'move':
        if (last.element.type === 'shape') {
          this.setState({
            shapes: {
              ...this.state.shapes,
              [last.element.uuid]: last.element.object,
            },
          });
        } else {
          this.setState({
            texts: {
              ...this.state.texts,
              [last.element.uuid]: last.element.object,
            },
          });
        }
        break;
      default:
        break;
    }
  }
}
