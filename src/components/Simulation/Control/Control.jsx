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
    color: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    posx: PropTypes.number.isRequired,
    posy: PropTypes.number.isRequired,
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

    switch (this.state.shapeType) {
      case 'button':
        control = (
          <Button
            onClick={() => this.onButtonClick()}
            style={{
              zIndex: 10000,
              position: 'absolute',
              left: this.props.posx,
              top: this.props.posy,
            }}
          >
            Couille
          </Button>
        );
        break;
      case 'textbox':
        control = (
          <FormControl
            type="text"
            placeholder="Enter text"
            style={{
              zIndex: 10000,
              position: 'absolute',
              left: this.props.posx,
              top: this.props.posy,
              placeholder: 'write here',
              width: 150,
            }}
          />
        );
        break;
      case 'line':
      default:
        break;
    }

    return control;
  }

  render() {
    return (
      <div>
        {this.getControl()}
      </div>
    );
  }
}

export default connect(
  ({ application, api }) => ({ application, api })
)(Control);
