/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import * as constants from '../constants';
import * as actions from '../../actions/constants';
import absorbEvent from '../../utils/events';

/* Components */
import Footer from '../common/Footer/Footer';
import Shape from './Shape/Shape';
import Text from './Text/Text';
import SideMenu from './SideMenu/SideMenu';

/* Actions */
import {
  getPages,
  getPageTypes,
  getShapes,
  getShapeTypes,
  createShape,
  patchShape,
  deleteShape,
  getTexts,
  createText,
  patchText,
  deleteText,
  getActionTypes,
  getEventTypes } from '../../actions/api';
import { updateWorkspace, selectPage } from '../../actions/application';

/* Helpers */
import { changeColor } from './helpers/changeColor';
import { createText as addText } from './helpers/createText';
import { createShape as addShape } from './helpers/createShape';

import {
  copySelectedItems,
  computeCopyPasteOffset,
  pasteClipboard } from './helpers/copyPaste';

import {
  toggleMenu,
  doAction,
  renderRadialMenu } from './helpers/menu';

import {
  getCentralPointOfSelection,
  monoSelect,
  multiSelect,
  updateSelectionOriginalPosition,
  renderSelectionRect,
  addItemToSelection } from './helpers/selection';

import {
  computeSvgPath,
  dragItems,
  arePointsFeedable,
  deleteSvgItem } from './helpers/svg';

import {
  getPointFromEvent,
  onStartingEvent,
  onEndingEvent,
  onMovingEvent,
  onMouseLeaveEvent,
  onKeyDownEvent } from './helpers/events';

import {
  undo,
  redo,
  createElem,
  deleteElem,
  extractMovedElementMoment,
  extractDeletedElementMoment,
  extractCreatedElementMoment } from './helpers/memento';

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    // menu
    this.toggleMenu = toggleMenu.bind(this);
    this.doAction = doAction.bind(this);
    this.renderRadialMenu = renderRadialMenu.bind(this);

    // events
    this.onStartingEvent = onStartingEvent.bind(this);
    this.onEndingEvent = onEndingEvent.bind(this);
    this.onMovingEvent = onMovingEvent.bind(this);
    this.onMouseLeaveEvent = onMouseLeaveEvent.bind(this);
    this.onKeyDownEvent = onKeyDownEvent.bind(this);
    this.getPointFromEvent = getPointFromEvent.bind(this);

    // copy paste
    this.pasteClipboard = pasteClipboard.bind(this);
    this.copySelectedItems = copySelectedItems.bind(this);
    this.computeCopyPasteOffset = computeCopyPasteOffset.bind(this);

    // svg
    this.deleteSvgItem = deleteSvgItem.bind(this);
    this.computeSvgPath = computeSvgPath.bind(this);
    this.arePointsFeedable = arePointsFeedable.bind(this);
    this.dragItems = dragItems.bind(this);

    // selection
    this.updateSelectionOriginalPosition = updateSelectionOriginalPosition.bind(this);
    this.getCentralPointOfSelection = getCentralPointOfSelection.bind(this);
    this.monoSelect = monoSelect.bind(this);
    this.multiSelect = multiSelect.bind(this);
    this.renderSelectionRect = renderSelectionRect.bind(this);
    this.addItemToSelection = addItemToSelection.bind(this);

    // Helpers
    this.changeColor = changeColor.bind(this);
    this.createText = addText.bind(this);
    this.createShape = addShape.bind(this);

    // Undo
    this.undo = undo.bind(this);
    this.redo = redo.bind(this);
    this.createElem = createElem.bind(this);
    this.deleteElem = deleteElem.bind(this);
    this.extractCreatedElementMoment = extractCreatedElementMoment.bind(this);
    this.extractMovedElementMoment = extractMovedElementMoment.bind(this);
    this.extractDeletedElementMoment = extractDeletedElementMoment.bind(this);

    // Workspace
    this.getRealId = this.getRealId.bind(this);

    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];

    let shapes = {};
    let texts = {};

    // if the pages, shapes and texts already cached upon load
    if (prototype.pages && prototype.pages[selectedPage]) {
      shapes = prototype.pages[selectedPage].shapes || {};
      texts = prototype.pages[selectedPage].texts || {};
    }

    this.state = {
      showMenu: null,
      currentPath: null,
      selectingRect: null,
      previousPoint: null,
      currentPageId: null,
      shapes,
      texts,
      currentMode: null,
      fontSize: constants.paths.TEXT_DEFAULT_SIZE,
      selectedItems: [],
      selectedControlItems: [],
    };

    // undo
    this.isUndoing = [];
    this.groupCopy = {};
    this.memento = [];
    this.keepsake = [];
    this.touchTimer = 0;
    this.menuPending = false;
    this.selectionDirty = false;

    this.selectedItemsCopied = false;
    this.copiedItesmsInit = false;
    this.shapesClipboard = {};
    this.textsClipboard = {};
    this.centralSelectionPoint = null;
    this.currentPos = {
      x: 0,
      y: 0,
    };
    this.itemsList = {};
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { prototypes, selectedPrototype, selectedPage } = newProps.application;
    if (!prototypes) return;

    const prototype = prototypes[selectedPrototype];
    if (!prototype || !selectedPrototype) return;

    // If the selected page has changed, set the state to reflect the new page
    if (selectedPage && this.state.currentPageId !== selectedPage) {
      const { shapes, texts } = prototypes[selectedPrototype].pages[selectedPage];

      this.setState({
        currentPageId: newProps.application.selectedPage,
        shapes: shapes || {},
        texts: texts || {},
      });

      // Get shapes and texts if they are not cached
      if (isEmpty(shapes)) {
        this.props.actions.getShapes(selectedPrototype, selectedPage,
        newProps.application.user.token);
      }
      if (isEmpty(texts)) {
        this.props.actions.getTexts(selectedPrototype, selectedPage,
        newProps.application.user.token);
      }

      // clear undo/redo upon page change
      this.isUndoing = [];
      this.groupCopy = {};
      this.memento = [];
      this.keepsake = [];
    }

    // If the page types are not cached, get them
    if (isEmpty(newProps.api.getPageTypes.pageTypes)) {
      this.props.actions.getPageTypes(newProps.application.user.token);
    }


    // If the shape types are not cached, get them
    if (isEmpty(newProps.api.getShapeTypes.shapeTypes)) {
      this.props.actions.getShapeTypes(newProps.application.user.token);
    }

    // If the action types are not cached, get them
    if (isEmpty(newProps.api.getActionTypes.actionTypes)) {
      this.props.actions.getActionTypes(newProps.application.user.token);
    }

    // If the event types are not cached, get them
    if (isEmpty(newProps.api.getEventTypes.eventTypes)) {
      this.props.actions.getEventTypes(newProps.application.user.token);
    }

    // If the selected prototype's pages are not cached, get them
    else if (!prototype.pages) {
      newProps.actions.getPages(selectedPrototype, newProps.application.user.token);
    }

    // If you just cached the pages, select the first one
    else if (!newProps.application.selectedPage) {
      this.props.actions.selectPage(Object.keys(prototype.pages)[0]);
    }

    else {
      switch (newProps.api.lastAction) {
        // If you just cached the shapes, copy them in the state
        case actions.GET_SHAPES:
          if (isEmpty(this.state.shapes)) {
            this.setState({ shapes: prototype.pages[selectedPage].shapes });
          }
          break;
        // If you just cached the texts, copy them in the state
        case actions.GET_TEXTS:
          if (isEmpty(this.state.texts)) {
            this.setState({ texts: prototype.pages[selectedPage].texts });
          }
          break;
        // Add the uuid of the created shape with the uuid of the DB
        case actions.CREATE_SHAPE: {
          const { id, uuid } = newProps.api.createShape.shape;
          if (this.state.shapes.hasOwnProperty(uuid) && !this.state.shapes[uuid].id) {
            const shape = this.state.shapes[uuid];

            // for undo
            this.extractCreatedElementMoment(id, uuid, shape, 'shape');
            // update the shape list with that shape
            this.setState({
              shapes: {
                ...this.state.shapes,
                [uuid]: {
                  ...shape,
                  id,
                  controls: [],
                },
              },
            });
          }
          break;
        }

        // Add the uuid of the created text with th uui of the DB
        case actions.CREATE_TEXT: {
          const { id, uuid } = newProps.api.createText.text;
          if (this.state.texts.hasOwnProperty(uuid) && !this.state.texts[uuid].id) {
            const text = this.state.texts[uuid];
            // for undo
            this.extractCreatedElementMoment(id, uuid, text, 'text');

            // update the text list with that text
            this.setState({
              texts: {
                ...this.state.texts,
                [uuid]: {
                  ...text,
                  id,
                },
              },
            });
          }
          break;
        }

        // Add the new control to the shape
        case actions.CREATE_CONTROL: {
          const { shapeId, id, uuid } = newProps.api.createControl.control;
          if (this.state.shapes[shapeId].controls.hasOwnProperty(uuid)
            && !this.state.shapes[shapeId].controls[uuid].id) {
            const shape = this.state.shapes[shapeId];
            const control = shape.controls[uuid];

            // update the shape list with that shape
            this.setState({
              shapes: {
                ...this.state.shapes,
                [shapeId]: {
                  ...shape,
                  controls: {
                    ...shape.controls,
                    [uuid]: {
                      ...control,
                      id,
                    },
                  },
                },
              },
            });
          }
          break;
        }
        default:
          break;
      }
    }
  }

  componentDidUpdate() {
    // focus the text edit section if it is displayed
    if (this.state.currentMode === constants.modes.TEXT && this.textEdit) {
      this.textEdit.focus();
    }
  }

  /**
   * Returns the uuid of the item does not exists in the DB, or the DB's id if it exists
   * @param  {uuid} uuid The uuid of the item to check
   * @return {uuid}      The correct uuid to use for this item's call to the DB
   */
  getRealId(uuid) {
    const items = {
      ...this.state.shapes,
      ...this.state.texts,
    };
    return items[uuid].id || uuid;
  }

  /* Ref referencing */
  shapeDidMount(id, shapeSvg) {
    this.svgShapes = { ...this.svgShapes, [id]: shapeSvg };
  }

  textDidMount(id, textSvg) {
    this.svgTexts = { ...this.svgTexts, [id]: textSvg };
  }

  radialMenuDidMount(el) {
    this.radialMenuEl = el;
  }
  selectionRadialMenuDidMount(el) {
    this.selectionRadialMenuEl = el;
  }

  /* Rendering */
  renderWorkspace() {
    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];
    let prototypeType = '';
    if (prototype && prototype.pages && selectedPage) {
      const { pageTypeId } = prototype.pages[selectedPage];
      const { pageTypes: allPageTypes } = this.props.api.getPageTypes;

      if (allPageTypes) {
        this.pageType = allPageTypes[pageTypeId];
        this.isMobile = prototype.isMobile;
      }
      prototypeType = (this.isMobile) ? 'mobile' : 'desktop';
    }

    const fg = this.state.currentMode === constants.modes.CREATE_CONTROL;
    if (this.state.shapes && this.state.texts) {
      return (
        <div
          className={`workspace workspace-${this.pageType} ${prototypeType} ${fg ? 'front' : ''}`}
          ref={div => { this.workspace = div; }}
          onMouseDown={this.onStartingEvent}
          onMouseMove={this.onMovingEvent}
          onMouseUp={this.onEndingEvent}
          onMouseLeave={this.onMouseLeaveEvent}
          onTouchStart={this.onStartingEvent}
          onTouchMove={this.onMovingEvent}
          onTouchEnd={this.onEndingEvent}
          onTouchCancel={absorbEvent}
          onContextMenu={absorbEvent}
        >
        {this.state.showMenu && this.renderRadialMenu(this.currentPos)}
          <svg height="100%" width="100%">
            <filter id="dropshadow-line-alpha" height="130%" filterUnits="userSpaceOnUse">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dropshadow-line-graphic" height="130%" filterUnits="userSpaceOnUse">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dropshadow-curve-alpha" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dropshadow-curve-graphic" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {
              this.state.currentMode === constants.modes.TEXT &&
                <foreignObject
                  x={this.currentPos.x}
                  y={this.currentPos.y}
                >
                  <input
                    id="textEdit"
                    ref={textEdit => (this.textEdit = textEdit)}
                    style={{ fontSize: this.state.fontSize }}
                  />
                </foreignObject>
            }
            {
              Object.entries(this.state.shapes).map((item, i) =>
                <Shape
                  id={item[0]}
                  ref={(shape) => { this.itemsList[item[0]] = shape; }}
                  color={item[1].color}
                  path={item[1].path}
                  posX={item[1].x}
                  posY={item[1].y}
                  selected={this.state.selectedItems.some(e => e === item[0])}
                  affected={this.state.selectedControlItems.some(e => e === item[0])}
                  monoSelect={this.monoSelect}
                  onLoad={(id, svgShape) => this.shapeDidMount(id, svgShape)}
                  key={i}
                />)
            }
            {
              Object.entries(this.state.texts).map((item, i) =>
                <Text
                  id={item[0]}
                  ref={(text) => { this.itemsList[item[0]] = text; }}
                  posX={item[1].x}
                  posY={item[1].y}
                  size={item[1].fontSize}
                  content={item[1].content}
                  selected={this.state.selectedItems.some(e => e === item[0])}
                  affected={this.state.selectedControlItems.some(e => e === item[0])}
                  monoSelect={this.monoSelect}
                  onLoad={(id, svgText) => this.textDidMount(id, svgText)}
                  key={i}
                />)
            }
            {this.state.currentPath &&
              <path
                className="workspace-line"
                d={this.state.currentPath.pathString}
                stroke={this.props.application.workspace.drawColor}
                transform={`translate(${this.state.currentPath.position.x}
                    ${this.state.currentPath.position.y})`}
              />
            }
            {this.state.selectingRect && this.renderSelectionRect()}
          </svg>
        </div>
      );
    }

    return (
      <div>
        <div className="backdrop"></div>
        <div className="loading">
          <FormattedMessage id="workspace.loading" />
          <div className="spinner" />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="workspace-flexbox">
        {this.state.currentMode === constants.modes.CREATE_CONTROL && <div className="backdrop" />}
        <SideMenu parent={this} parentState={this.state} />
        <div
          id="workspace-container"
          ref={div => div && div.focus()}
          className="workspace-container"
          tabIndex="0"
          onKeyDown={this.onKeyDownEvent}
        >
          {this.renderWorkspace()}
        </div>
        <Footer selectedPage={this.state.currentPageId || ''} />
      </div>
    );
  }
}

export default connect(
  ({ application, api }) => ({ application, api }),
  dispatch => ({
    actions: bindActionCreators({
      updateWorkspace,
      getPages,
      getPageTypes,
      selectPage,
      getShapes,
      getShapeTypes,
      createShape,
      patchShape,
      deleteShape,
      getTexts,
      createText,
      patchText,
      deleteText,
      getActionTypes,
      getEventTypes,
    }, dispatch),
  })
)(Workspace);
