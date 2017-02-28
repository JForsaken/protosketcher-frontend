/* Node modules */
import React, { Component, PropTypes } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { invert } from 'lodash';

class Control extends Component {
  static propTypes = {
    controls: PropTypes.array.isRequired,
    shapeTypeId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    rect: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props);
    const { shapeTypes } = this.props.api.getShapeTypes;

    this.state = {
      shapeType: invert(shapeTypes)[this.props.shapeTypeId],
    };
  }

  onButtonClick() {
    /* TODO: hide/show other the shapes of the affectedShape,
     *  or change page to the affectedPageId
     */
  }

  getControl() {
    let control = null;

    const { posX, posY, rect } = this.props;

    // the position where the control should be placed
    const x = (Math.floor(rect.x + rect.width / 2.0) + posX) - rect.width / 2.0;
    const y = (Math.floor(rect.y + rect.height / 2.0) + posY) - rect.height / 2.0;

    const controlStyle = {
      left: x,
      top: y,
      width: rect.width,
      height: rect.height,
    };

    switch (this.state.shapeType) {
      case 'button':
        control = (
          <Button
            onClick={() => this.onButtonClick()}
            className="simulation-control"
            style={controlStyle}
          >
            Button control
          </Button>
        );
        break;

      case 'textbox':
        control = (
          <FormControl
            type="text"
            className="simulation-control"
            style={controlStyle}
          />
        );
        break;

      case 'line':
        break;

      default:
        break;
    }

    return control;
  }

  render() {
    return this.getControl();
  }
}

export default connect(
  ({ application, api }) => ({ application, api })
)(Control);