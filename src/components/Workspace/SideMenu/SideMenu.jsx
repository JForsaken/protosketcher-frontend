/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, SelectField, MenuItem } from 'material-ui';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { omit, invert } from 'lodash';

/* ACTIONS */
import { getShapeTypes, getActionTypes } from '../../../actions/api';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  handleToggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  /**
   * Render the items settings form (shape or text)
   * @return {html} HTML code of the top part of the settings panel
   */
  renderSettings() {
    const { shapeTypes } = this.props.api.getShapeTypes;
    const { actionTypes } = this.props.api.getActionTypes;

    const menuItemStyle = {
      textTransform: 'capitalize',
    };

    return (
      <div>
        <SelectField
          className="select-type"
          floatingLabelText="TYPES"
          fullWidth
        >
          {
            Object.entries(omit(shapeTypes, [invert(shapeTypes).squiggly])).map((item) =>
              <MenuItem style={menuItemStyle} key={item[0]} value={item[0]} primaryText={item[1]} />
            )}
        </SelectField>
        <SelectField
          className="select-control"
          floatingLabelText="CONTROLS"
          fullWidth
        >
          {
            Object.entries(actionTypes).map((item) =>
              <MenuItem style={menuItemStyle} key={item[0]} value={item[0]} primaryText={item[1]} />
            )}
        </SelectField>
      </div>
    );
  }

  render() {
    const style = {
      position: 'absolute',
      overflow: 'visible',
      padding: '17px',
    };
    return (
      <div>
        <Drawer open={this.state.isOpen} containerStyle={style}>
          <Button
            className="drawer-toggle vertical-text"
            onClick={() => this.handleToggle()}
          >
            <FontAwesome name="caret-down" />
            <FormattedMessage id="sidemenu.toggle" />
          </Button>

          {this.renderSettings()}
        </Drawer>
      </div>
    );
  }
}

export default connect(
  ({ api }) => ({ api }),
  dispatch => ({
    actions: bindActionCreators({
      getShapeTypes,
      getActionTypes,
    }, dispatch),
  })
)(SideMenu);
