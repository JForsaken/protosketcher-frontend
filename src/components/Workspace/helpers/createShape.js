import uuidV1 from 'uuid/v1';
import { invert } from 'lodash';

/**
 * Creates a new shape and adds it in the application cache.
 * @param  {Object{x, y}} point last point to be added to the shape to create.
 */
export function createShape(point) {
  const uuid = uuidV1();
  const { pathString, position } = this.state.currentPath;

  const shape = {
    path: `${pathString} L${point.x - position.x} ${point.y - this.state.currentPath.position.y}`,
    color: this.props.application.workspace.drawColor,
    x: position.x,
    y: position.y,
    shapeTypeId: invert(this.props.api.getShapeTypes.shapeTypes).line,
    uuid,
  };

  this.setState({
    currentPath: null,
    previousPoint: null,
    shapes: {
      ...this.state.shapes,
      [uuid]: shape,
    },
  });

  this.props.actions.createShape(this.props.application.selectedPrototype,
    this.state.currentPageId, shape, this.props.application.user.token);
}
