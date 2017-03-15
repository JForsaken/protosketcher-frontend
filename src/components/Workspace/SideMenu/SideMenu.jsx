/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { has, omit, map, invert } from 'lodash';
import uuidV1 from 'uuid/v1';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right.js';

/* ACTIONS */
import { patchShape, createControl, patchControl, deleteControl } from '../../../actions/api';

/* Constants */
import { menuItems } from '../../constants';

@injectIntl
class SideMenu extends Component {
  static propTypes = {
    application: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      currentEvent: null,
      currentAction: null,
    };

    this.updateShapeType = this.updateShapeType.bind(this);
    this.updateChangePage = this.updateChangePage.bind(this);
    this.updateCurrentEvent = this.updateCurrentEvent.bind(this);
    this.updateCurrentAction = this.updateCurrentAction.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.parentState.selectedItems !== this.props.parentState.selectedItems) {
      this.setState({
        currentEvent: invert(this.props.api.getEventTypes.eventTypes).click,
        currentAction: invert(this.props.api.getActionTypes.actionTypes).show,
      });
    }
  }

  handleToggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  /**
   * Update the shapeTypeId param of the selected shape
   * @param  {syntheticEvent} event React event
   * @param  {int} key   Index of the selected item
   * @param  {string} value Selected item's value
   */
  updateShapeType(event, key, value) {
    const { shapes, selectedItems, currentPageId } = this.props.parentState;
    const id = selectedItems[0];
    const shape = shapes[id];
    this.props.parent.setState({
      shapes: {
        ...omit(shapes, [id]),
        [id]: {
          ...omit(shape, ['shapeTypeId']),
          shapeTypeId: value,
        },
      },
    });

    const { selectedPrototype, user } = this.props.application;
    const realId = this.props.parent.getRealId(id);

    const patch = { shapeTypeId: value };
    this.props.actions.patchShape(selectedPrototype, currentPageId, realId, patch, user.token);
  }

  /**
   * Update the color param of the selected shape
   * @param  {string} color New color of the shape, in hex
   */
  updateShapeColor(color) {
    const { shapes, selectedItems, currentPageId } = this.props.parentState;
    const id = selectedItems[0];
    const shape = shapes[id];
    this.props.parent.setState({
      shapes: {
        ...omit(shapes, [id]),
        [id]: {
          ...omit(shape, ['color']),
          color,
        },
      },
    });

    const { selectedPrototype, user } = this.props.application;
    const realId = this.props.parent.getRealId(id);

    const patch = { color };
    this.props.actions.patchShape(selectedPrototype, currentPageId, realId, patch, user.token);
  }

  /**
   * Create or update the control to change the page
   * @param  {syntheticEvent} event React event
   * @param  {id} pageId Id of the page to change to, or '' to kepp the same page
   */
  updateChangePage(event, index, pageId) {
    const { shapes, selectedItems, currentPageId } = this.props.parentState;
    const id = selectedItems[0];
    const shape = shapes[id];
    const { selectedPrototype, user } = this.props.application;
    const changePageActionId = invert(this.props.api.getActionTypes.actionTypes).changePage;
    const onClickEventId = invert(this.props.api.getEventTypes.eventTypes).click;
    const realId = this.props.parent.getRealId(id);

    let controlId = null;
    Object.entries(shape.controls).some(control => {
      if (control[1].actionTypeId === changePageActionId) {
        controlId = control[0];
        return true;
      }
      return false;
    });

    // Delete existing control
    if (!pageId && controlId) {
      this.props.actions.deleteControl(selectedPrototype, currentPageId, realId,
        shape.controls[controlId].id || controlId, user.token);
      delete shape.controls[controlId];
    }

    // Patch existing control
    else if (controlId) {
      shape.controls[controlId].affectedPageId = pageId;
      this.props.actions.patchControl(selectedPrototype, currentPageId, realId,
        shape.controls[controlId].id || controlId, shape.controls[controlId], user.token);
    }

    // Create new control
    else {
      const uuid = uuidV1();
      const control = {
        uuid,
        affectedShapeIds: [],
        affectedTextIds: [],
        affectedPageId: pageId,
        actionTypeId: changePageActionId,
        eventTypeId: onClickEventId,
        shapeId: id,
      };
      shape.controls[uuid] = control;

      this.props.actions.createControl(selectedPrototype, currentPageId, realId, control,
        user.token);
    }

    // Update the state
    this.props.parent.setState({
      shapes: {
        ...omit(shapes, [id]),
        [id]: shape,
      },
    });
  }

  updateCurrentEvent(event, index, value) {
    this.setState({ currentEvent: value });
  }

  updateCurrentAction(event, index, value) {
    this.setState({ currentAction: value });
  }

  /**
   * Render the settings panel for the selected shape
   * @return {html} The HTML code of the rendered panel
   */
  renderSettingsPanel() {
    if (this.props.parentState.selectedItems.length !== 1) return (<div></div>);
    return (
      <div className="settings-panel">
        {this.renderSettings()}
        {this.renderControls()}
        <div>
        </div>
      </div>
    );
  }

  /**
   * Render the items settings form (shape or text)
   * @return {html} HTML code of the top part of the settings panel
   */
  renderSettings() {
    const { shapes, texts, selectedItems } = this.props.parentState;
    const { shapeTypes } = this.props.api.getShapeTypes;
    const id = selectedItems[0];

    // Text item
    if (has(texts, id)) {
      // TODO Edit text
      // const text = texts[id];
    }

    // Shape item
    else if (has(shapes, id)) {
      const shape = shapes[id];
      return (
        <div>
          <div className="settings-label"><FormattedMessage id="sidemenu.typeSelector" /></div>
          <SelectField
            className="select-type"
            value={shape.shapeTypeId}
            onChange={this.updateShapeType}
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
          <div className="settings-label"><FormattedMessage id="sidemenu.colorLabel" /></div>
          <div className="color-settings-container">
            {
              menuItems.CHANGE_COLOR.items.map((item) =>
                <div
                  key={item.color}
                  className={`change-color-btn ${(shape.color === item.color) ? 'selected' : ''}`}
                  style={{ background: item.color }}
                  onClick={() => this.updateShapeColor(item.color)}
                  onTouchStart={this.updateShapeColor}
                />
              )
            }
          </div>
        </div>
      );
    }
    return '';
  }

  /**
   * Render the items settings form (shape or text)
   * @return {html} HTML code of the top part of the settings panel
   */
  renderControls() {
    const { shapes, selectedItems } = this.props.parentState;
    const { actionTypes } = this.props.api.getActionTypes;
    const { eventTypes } = this.props.api.getEventTypes;
    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];
    const id = selectedItems[0];

    const shape = shapes[id];
    if (!shape) return ('');

    let affectedPageId = null;
    Object.values(shape.controls).some(control => {
      if (control.actionTypeId === invert(this.props.api.getActionTypes.actionTypes).changePage) {
        affectedPageId = control.affectedPageId;
        return true;
      }
      return false;
    });

    return (
      <div>
        <SelectField
          className={'select-control'}
          floatingLabelText={this.props.intl.messages['sidemenu.changePageLabel']}
          fullWidth
          value={affectedPageId}
          onChange={this.updateChangePage}
        >
          <MenuItem
            value=""
            primaryText={this.props.intl.messages['sidemenu.pageSelector']}
            style={{ opacity: 0.5 }}
          />
          {
            map(omit(prototype.pages, [selectedPage]), (page, pageId) =>
              <MenuItem key={pageId} value={pageId} primaryText={page.name} />
            )}
        </SelectField>
        <div className="settings-label" style={{ marginBottom: -12 }}>
          <FormattedMessage id="sidemenu.newControlLabel" />
        </div>
        <SelectField
          className="select-control"
          floatingLabelText={this.props.intl.messages['sidemenu.eventSelector']}
          fullWidth
          value={this.state.currentEvent}
          onChange={this.updateCurrentEvent}
        >
          {
            map(eventTypes, (eventType, typeId) =>
              <MenuItem
                key={typeId}
                value={typeId}
                primaryText={this.props.intl.messages[eventType]}
              />
            )}
        </SelectField>
        <SelectField
          className="select-control"
          floatingLabelText={this.props.intl.messages['sidemenu.actionSelector']}
          fullWidth
          value={this.state.currentAction}
          onChange={this.updateCurrentAction}
        >
          {
            map(omit(actionTypes, [invert(actionTypes).changePage]), (actionType, typeId) =>
              <MenuItem
                key={typeId}
                value={typeId}
                primaryText={this.props.intl.messages[actionType]}
              />
            )}
        </SelectField>
        <RaisedButton
          label={this.props.intl.messages['sidemenu.selectItems']}
          style={{ margin: '12px auto', display: 'table' }}
        />
        <div className="settings-label" style={{ marginBottom: -12 }}>
          <FormattedMessage id="sidemenu.controlsLabel" />
        </div>
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div style={{ height: '100%', display: 'flex' }}>
        <div className={`side-menu ${isOpen ? 'opened' : ''}`} >
        {this.renderSettingsPanel()}
        </div>
        <div
          className="drawer-toggle vertical-text"
          onClick={() => this.handleToggle()}
        >
          <ArrowIcon
            style={{ height: 48, width: 48, transition: '(color .3s cubic-bezier(.4, 0, .2, 1))' }}
            color="rgba(0,0,0,.5)"
            hoverColor="rgba(0,0,0,.75)"
          />
          <FormattedMessage className="vertical-text" id="sidemenu.toggle" />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ api, application }) => ({ api, application }),
  dispatch => ({
    actions: bindActionCreators({
      patchShape,
      createControl,
      patchControl,
      deleteControl,
    }, dispatch),
  })
)(SideMenu);
