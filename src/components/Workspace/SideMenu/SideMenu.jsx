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
import { List, ListItem, makeSelectable } from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete.js';
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right.js';
import { red500, blue500 } from 'material-ui/styles/colors';


/* ACTIONS */
import { patchShape, createControl, patchControl, deleteControl } from '../../../actions/api';

/* Constants */
import { menuItems, modes } from '../../constants';

let SelectableList = makeSelectable(List);

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
      selectedControl: null,
    };

    this.updateShapeType = this.updateShapeType.bind(this);
    this.updateChangePage = this.updateChangePage.bind(this);
    this.updateCurrentEvent = this.updateCurrentEvent.bind(this);
    this.updateCurrentAction = this.updateCurrentAction.bind(this);
    this.selectAffectedItems = this.selectAffectedItems.bind(this);
    this.createControl = this.createControl.bind(this);
    this.createControlCanceled = this.createControlCanceled.bind(this);
    this.updateSelectedControl = this.updateSelectedControl.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.parentState.selectedItems !== this.props.parentState.selectedItems) {
      this.setState({
        currentEvent: invert(this.props.api.getEventTypes.eventTypes).click,
        currentAction: invert(this.props.api.getActionTypes.actionTypes).show,
        selectedControl: null,
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
   * Set the workspace mode to select items affected by the action being created
   */
  selectAffectedItems() {
    this.setState({ selectedControl: null });
    this.props.parent.setState({
      currentMode: modes.CREATE_CONTROL,
      selectedControlItems: [],
    });
  }

  /**
   * Create a new control from the options selected in the menu and the affected shapes
   */
  createControl() {
    const { shapes, selectedItems, currentPageId } = this.props.parentState;
    const id = selectedItems[0];
    const shape = shapes[id];
    const { selectedPrototype, user } = this.props.application;
    const realId = this.props.parent.getRealId(id);

    // Split items into shapes and texts
    const affectedShapeIds = [];
    const affectedTextIds = [];
    this.props.parentState.selectedControlItems.forEach(currentId => {
      if (has(this.props.parentState.shapes, (currentId))) {
        affectedShapeIds.push(currentId);
      } else if (has(this.props.parentState.texts, (currentId))) {
        affectedTextIds.push(currentId);
      }
    });

    const uuid = uuidV1();
    const control = {
      uuid,
      affectedShapeIds,
      affectedTextIds,
      affectedPageId: null,
      actionTypeId: this.state.currentAction,
      eventTypeId: this.state.currentEvent,
      shapeId: id,
    };
    shape.controls[uuid] = control;

    this.props.actions.createControl(selectedPrototype, currentPageId, realId, control, user.token);

    // Update the state
    this.props.parent.setState({
      shapes: {
        ...omit(shapes, [id]),
        [id]: shape,
      },
      currentMode: null,
      selectedControlItems: [],
    });
  }

  /**
   * Cancel control creation and return to normal mode
   */
  createControlCanceled() {
    this.props.parent.setState({
      currentMode: null,
      selectedControlItems: [],
    });
  }

  /**
   * Delete selected control
   */
  deleteControl(controlId) {
    const { shapes, selectedItems, currentPageId } = this.props.parentState;
    const id = selectedItems[0];
    const shape = shapes[id];
    const { selectedPrototype, user } = this.props.application;
    const realId = this.props.parent.getRealId(id);

    this.props.actions.deleteControl(selectedPrototype, currentPageId, realId,
      shape.controls[controlId].id || controlId, user.token);
    delete shape.controls[controlId];

    // Update the state
    this.props.parent.setState({
      shapes: {
        ...omit(shapes, [id]),
        [id]: shape,
      },
      selectedControlItems: [],
    });
  }

  updateSelectedControl(event, value) {
    const shapeId = this.props.parentState.selectedItems[0];
    const control = this.props.parentState.shapes[shapeId].controls[value];
    this.setState({ selectedControl: value });
    this.props.parent.setState({
      selectedControlItems: control.affectedShapeIds.concat(control.affectedTextIds),
    });
  }

  /**
   * Render the settings panel for the selected shape
   * @return {html} The HTML code of the rendered panel
   */
  renderSettingsPanel() {
    if (this.props.parentState.selectedItems.length !== 1) return (<div></div>);

    // TODO: empty div & empty side menu is blank
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
              menuItems.CHANGE_COLOR.items.map(item =>
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
    const changePageActionId = invert(this.props.api.getActionTypes.actionTypes).changePage;

    const shape = shapes[id];
    if (!shape) return ('');

    let changePageControlId = null;
    Object.entries(shape.controls).some(control => {
      if (control[1].actionTypeId === changePageActionId) {
        changePageControlId = control[0];
        return true;
      }
      return false;
    });

    const controls = omit(shape.controls, changePageControlId);

    return (
      <div>
        <SelectField
          className="select-control"
          floatingLabelText={this.props.intl.messages['sidemenu.changePageLabel']}
          fullWidth
          value={changePageControlId && shape.controls[changePageControlId].affectedPageId}
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
          onTouchTap={this.selectAffectedItems}
        />
        <div className="settings-label" style={{ marginBottom: 0 }}>
          <FormattedMessage id="sidemenu.controlsLabel" />
        </div>
        <SelectableList value={this.state.selectedControl} onChange={this.updateSelectedControl}>
        {
          map(Object.entries(controls), control =>
            <ListItem
              key={control[0]}
              value={control[0]}
            >
              <FormattedMessage id={actionTypes[control[1].actionTypeId]} />
              <DeleteIcon
                className="icon-list"
                color="rgba(0,0,0,.5)"
                hoverColor="rgba(0,0,0,.75)"
                onClick={() => this.deleteControl(control[0])}
              />
            </ListItem>
          )
        }
        </SelectableList>
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className="flexbox">
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
        {this.props.parentState.currentMode === modes.CREATE_CONTROL &&
          <div className="create-control-container">
            <div style={{ flex: 1 }} />
            <RaisedButton
              label={this.props.intl.messages.cancel}
              className="create-control-button"
              backgroundColor={red500}
              onTouchTap={this.createControlCanceled}
            />
            <div style={{ flex: 1 }} />
            <RaisedButton
              label={this.props.intl.messages.OK}
              className="create-control-button"
              backgroundColor={blue500}
              onTouchTap={this.createControl}
            />
            <div style={{ flex: 1 }} />
          </div>
        }
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
