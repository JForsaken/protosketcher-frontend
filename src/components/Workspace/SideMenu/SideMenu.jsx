/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, SelectField, MenuItem } from 'material-ui';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { omit, invert, map } from 'lodash';

/* ACTIONS */
import { getShapeTypes, getActionTypes } from '../../../actions/api';

@injectIntl
class SideMenu extends Component {
  static propTypes = {
    application: PropTypes.object.isRequired,
  };

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
    const { prototypes, selectedPrototype } = this.props.application;
    const prototype = prototypes[selectedPrototype];

    return (
      <div>
        <SelectField
          className="select-type"
          floatingLabelText={this.props.intl.messages['sidemenu.typeSelector']}
          fullWidth
        >
          {
            map(omit(shapeTypes, [invert(shapeTypes).squiggly]), (shapeType, typeId) =>
              <MenuItem
                key={typeId}
                value={typeId}
                primaryText={this.props.intl.messages[shapeType]}
              />
            )}
        </SelectField>
        <SelectField
          className="select-control"
          floatingLabelText={this.props.intl.messages['sidemenu.actionSelector']}
          fullWidth
        >
          {
            map(actionTypes, (actionType, typeId) =>
              <MenuItem
                key={typeId}
                value={typeId}
                primaryText={this.props.intl.messages[actionType]}
              />
            )}
        </SelectField>
        <SelectField
          className="select-control"
          floatingLabelText={this.props.intl.messages['sidemenu.pageSelector']}
          fullWidth
        >
          {
            map(prototype.pages, (page, pageId) =>
              <MenuItem key={pageId} value={pageId} primaryText={page.name} />
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
        <Drawer className={this.state.isOpen ? 'drawer-open' : ''} open={this.state.isOpen} containerStyle={style}>
          <Button
            className="drawer-toggle vertical-text"
            onClick={() => this.handleToggle()}
          >
            <FontAwesome name="caret-up" />
            <FormattedMessage id="sidemenu.toggle" />
          </Button>

          {this.renderSettings()}
        </Drawer>
      </div>
    );
  }
}

export default connect(
  ({ api, application }) => ({ api, application }),
  dispatch => ({
    actions: bindActionCreators({
      getShapeTypes,
      getActionTypes,
    }, dispatch),
  })
)(SideMenu);
