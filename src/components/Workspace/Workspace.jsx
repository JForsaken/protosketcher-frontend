/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuidV1 from 'uuid/v1';
import { isEmpty, has, omit, clone } from 'lodash';

import * as constants from '../constants';
import * as actions from '../../actions/constants';
import absorbEvent from '../../utils/events';

/* Components */
import Footer from '../common/Footer/Footer';
import RadialMenu from '../common/RadialMenu/RadialMenu';
import Shape from './Shape/Shape';
import Text from './Text/Text';

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
  getActionTypes } from '../../actions/api';
import { updateWorkspace, selectPage } from '../../actions/application';

/* Helpers */
import { changeColor } from './helpers/changeColor';
import { createText as addText } from './helpers/createText';
import { createShape as addShape } from './helpers/createShape';
import {
  cloneElement,
  pasteClipboard } from './helpers/copyPaste';
import {
  getCentralPointOfSelection,
  monoSelect,
  multiSelect,
  updateSelectionOriginalPosition } from './helpers/selection';

const menuItems = [
  constants.menuItems.CHANGE_COLOR,
  constants.menuItems.ADD_TEXT,
  constants.menuItems.SELECT_AREA,
];

const selectionMenuItems = [
  constants.menuItems.DRAG_SELECTION,
  constants.menuItems.COPY_SELECTION,
  constants.menuItems.DELETE_SELECTION,
];

const MAX_TOUCH_DISTANCE = 15;

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.onStartingEvent = this.onStartingEvent.bind(this);
    this.onEndingEvent = this.onEndingEvent.bind(this);
    this.onMovingEvent = this.onMovingEvent.bind(this);
    this.doAction = this.doAction.bind(this);
    this.computeSvgPath = this.computeSvgPath.bind(this);
    this.arePointsFeedable = this.arePointsFeedable.bind(this);
    this.dragItems = this.dragItems.bind(this);
    this.deleteSvgPath = this.deleteSvgPath.bind(this);
    this.copySvgPath = this.copySvgPath.bind(this);
    this.onKeyDownEvent = this.onKeyDownEvent.bind(this);
    this.copySelectedItems = this.copySelectedItems.bind(this);
    this.pasteClipboard = pasteClipboard.bind(this);
    this.getPointFromEvent = this.getPointFromEvent.bind(this);

    // selection
    this.updateSelectionOriginalPosition = updateSelectionOriginalPosition.bind(this);
    this.getCentralPointOfSelection = getCentralPointOfSelection.bind(this);
    this.monoSelect = monoSelect.bind(this);
    this.multiSelect = multiSelect.bind(this);

    // Helpers
    this.changeColor = changeColor.bind(this);
    this.createText = addText.bind(this);
    this.createShape = addShape.bind(this);

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
      pages: prototype.pages || null,
      currentPageId: null,
      shapes,
      texts,
      currentMode: null,
      fontSize: constants.paths.TEXT_DEFAULT_SIZE,
      selectedItems: [],
    };

    this.touchTimer = 0;
    this.menuPending = false;
    this.selectionDirty = false;

    this.copiedInClipboard = false;
    this.clipboard = [];
    this.centralSelectionPoint = null;
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
      const { shapes, texts } = this.state.pages[newProps.application.selectedPage];

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

    // If the selected prototype's pages are not cached, get them
    else if (!prototype.pages) {
      newProps.actions.getPages(selectedPrototype,
        newProps.application.user.token);
    }

    // If you just cached the pages, select the first one
    else if (!newProps.application.selectedPage) {
      this.props.actions.selectPage(Object.keys(prototype.pages)[0]);
      this.setState({ pages: prototype.pages });
    }

    // If you just cached the shapes, copy them in the state
    else if (newProps.api.lastAction === actions.GET_SHAPES && isEmpty(this.state.shapes)) {
      this.setState({ shapes: prototype.pages[selectedPage].shapes });
    }

    // If you just cached the texts, copy them in the state
    else if (newProps.api.lastAction === actions.GET_TEXTS && isEmpty(this.state.texts)) {
      this.setState({ texts: prototype.pages[selectedPage].texts });
    }

    // Replace the uuid of the created shape with the uuid of the DB
    else if (newProps.api.lastAction === actions.CREATE_SHAPE &&
             !has(this.state.shapes, newProps.api.createShape.shape.id)) {
      const { shape } = newProps.api.createShape;

      // update the ref that shape
      this.svgShapes = {
        ...omit(this.svgShapes, shape.uuid),
        [shape.id]: this.svgShapes[shape.uuid],
      };

      // update the shape list with that shape
      this.setState({
        shapes: {
          ...omit(this.state.shapes, shape.uuid),
          [shape.id]: omit(shape, ['uuid', 'id', 'pageId']),
        },
      }, () => {
        // update selectedItems
        const selectedItems = this.state.selectedItems.slice(0);
        const i = selectedItems.indexOf(shape.uuid);
        if (i !== -1) {
          selectedItems[i] = shape.id;
          this.setState({
            selectedItems,
          });
        }
      });
    }

    // Replace the uuid of the created text with th uui of the DB
    else if (newProps.api.lastAction === actions.CREATE_TEXT &&
      !has(this.state.texts, newProps.api.createText.text.id)) {
      const { text } = newProps.api.createText;

      // update the ref that text
      this.svgTexts = {
        ...omit(this.svgTexts, text.uuid),
        [text.id]: this.svgTexts[text.uuid],
      };

      // update the text list with that text
      this.setState({
        texts: {
          ...omit(this.state.texts, text.uuid),
          [text.id]: omit(text, ['uuid', 'id', 'pageId']),
        },
      }, () => {
        // update selectedItems
        const selectedItems = this.state.selectedItems.slice(0);
        const i = selectedItems.indexOf(text.uuid);
        if (i !== -1) {
          selectedItems[i] = text.id;
          this.setState({
            selectedItems,
          });
        }
      });
    }
  }

/**
 * Focus the text edit section if it is displayed
 */
  componentDidUpdate() {
    if (this.state.currentMode === constants.modes.TEXT && this.textEdit) {
      this.textEdit.focus();
    }
  }

  onStartingEvent(e) {
    absorbEvent(e);

    // Add text if there was one being created
    if (this.state.currentMode === constants.modes.TEXT) {
      this.createText();
    }

    const point = this.getPointFromEvent(e, constants.events.TOUCH_START);
    this.props.actions.updateWorkspace({
      currentPos: {
        x: point.x,
        y: point.y,
      },
    });

    // Right mouse press
    if (e.type === constants.events.MOUSE_DOWN
      && e.nativeEvent.which === constants.keys.MOUSE_RIGHT) {
      this.toggleMenu(true, point);
    }

    // Left mouse press
    else {
      // Set timer for menu
      this.touchTimer = setTimeout(() => this.toggleMenu(true), 500);

      this.menuPending = true;

      // Start drawing
      this.setState({
        previousPoint: point,
        currentPath: {
          pathString: '',
          position: point,
        },
      });
    }
  }

  onEndingEvent(e) {
    absorbEvent(e);

    // Add text if there was one being created
    if (this.state.currentMode === constants.modes.TEXT) {
      this.createText();
    }

    const point = this.getPointFromEvent(e, constants.events.TOUCH_END);

    // Finish drawing by adding last point
    if (this.state.currentPath && this.state.currentPath.pathString
      && isEmpty(this.state.selectedItems)) {
      this.createShape(point);
    }

    if (!(e.type === constants.events.MOUSE_LEAVE
      && e.target.classList.contains('workspace-container'))) {
      this.toggleMenu(false);
      this.props.actions.updateWorkspace({ action: null });
    }

    // stops short touches from firing the event
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
    }
    if (!this.selectionDirty && !this.props.application.workspace.action) {
      this.setState({
        selectedItems: [],
      });
    }
    this.selectionDirty = false;

    this.doAction(point);
    this.setState({
      selectingRect: null,
    });
  }

  onMovingEvent(e) {
    absorbEvent(e);

    // Get event position
    let pointer = e;
    if (e.type === constants.events.TOUCH_MOVE) {
      pointer = e.changedTouches.item(0);

      // HACK : The touchmove event is not fired on the svg : we have to handle it here
      const el = document.elementFromPoint(pointer.clientX, pointer.clientY);
      if (el.nodeName === 'path' && el.className) {
        const classes = el.className.baseVal.split('-');
        if (classes[0] === 'action') {
          // Move on a menu item
          if (classes.length === 2 && classes[1] !== this.props.application.workspace.action) {
            this.props.actions.updateWorkspace({
              action: classes[1],
              actionValue: null,
            });
          }

          // Move on a sub-menu item
          else if (classes.length > 2
            && classes[2] !== this.props.application.workspace.actionValue) {
            this.props.actions.updateWorkspace({
              action: classes[1],
              actionValue: classes[2],
            });
          }
        } else if (classes[0] === 'hover') {
          this.props.actions.updateWorkspace({
            actionValue: null,
          });
        }
      }

      // Move in the center of the menu
      else if (el.nodeName === 'circle' && this.props.application.workspace.action) {
        this.props.actions.updateWorkspace({ action: null });
      }
    }

    const point = {
      x: pointer.clientX - constants.LEFT_MENU_WIDTH,
      y: pointer.clientY - constants.TOP_MENU_HEIGHT,
    };

    const { currentPos } = this.props.application.workspace;
    // Determine if we draw or wait for the menu
    if (this.menuPending === true) {
      let deltaX = 0;
      let deltaY = 0;

      deltaX = Math.abs(point.x - currentPos.x);
      deltaY = Math.abs(point.y - currentPos.y);

      // Add error margin for small moves
      if (deltaX > MAX_TOUCH_DISTANCE || deltaY > MAX_TOUCH_DISTANCE) {
        // stops move (draw action) from firing the event
        if (this.touchTimer) {
          clearTimeout(this.touchTimer);
        }

        // Clear selection
        this.setState({
          selectedItems: [],
        });

        this.menuPending = false;

        // Add initial point
        this.computeSvgPath(this.state.previousPoint, 'M');
      }
    }
    const { action } = this.props.application.workspace;

    // If we are doing a multi selection
    if (action === constants.menuItems.SELECT_AREA.action) {
      // Selecting
      this.setState({
        selectingRect: {
          x: currentPos.x,
          y: currentPos.y,
          width: point.x - currentPos.x,
          height: point.y - currentPos.y,
        },
      });
    }

    // If we are dragging items
    else if (action === constants.menuItems.DRAG_SELECTION.action) {
      const translation = {
        x: point.x - this.centralSelectionPoint.x,
        y: point.y - this.centralSelectionPoint.y,
      };
      this.dragItems(translation);
    }

    // If we are dragging a copy
    else if (action === constants.menuItems.COPY_SELECTION.action) {
      if (this.copiedInClipboard === false) {
        this.copySelectedItems();
      } else {
        const translation = {
          x: point.x - this.centralSelectionPoint.x,
          y: point.y - this.centralSelectionPoint.y,
        };
        this.dragItems(translation);
      }
    }

    // If we are drawing
    else if (!this.menuPending && this.state.currentPath && this.state.currentPath.pathString) {
      if (this.arePointsFeedable(point)) {
        this.computeSvgPath(point, 'L');
        this.setState({
          previousPoint: point,
        });
      }
    }
  }

  onKeyDownEvent(e) {
    if (e.key === constants.keys.DELETE || e.key === constants.keys.BACKSPACE) {
      this.state.selectedItems.forEach(o => this.deleteSvgPath(o));
      this.setState({
        selectedItems: [],
      });
    } else if (e.key === constants.keys.ENTER) {
      this.createText();
    } else if (e.key === constants.keys.C && e.ctrlKey === true) {
      this.clipboard = clone(this.state.selectedItems);
    } else if (e.key === constants.keys.V && e.ctrlKey === true) {
      this.pasteClipboard();
      this.clipboard = [];
    }
  }

  // Return the position of an event
  getPointFromEvent(e, type) {
    let pointer = e;
    if (e.type === type) {
      pointer = e.changedTouches.item(0);
    }
    const point = {
      x: pointer.clientX - constants.LEFT_MENU_WIDTH,
      y: pointer.clientY - constants.TOP_MENU_HEIGHT,
    };
    return point;
  }

  arePointsFeedable(currentPoint) {
    const a = this.state.previousPoint.x - currentPoint.x;
    const b = this.state.previousPoint.y - currentPoint.y;
    const c = Math.sqrt(a * a + b * b);

    return c > constants.paths.SEGMENT_LENGTH;
  }

  computeSvgPath(point, prefix) {
    const path = this.state.currentPath;
    path.pathString += `${prefix}${point.x - path.position.x} ${point.y - path.position.y} `;
    this.setState({
      currentPath: path,
    });
  }

  copySelectedItems(selectedItems = this.state.selectedItems) {
    const selectedItemsClone = selectedItems.slice(0);
    const newSelectedItems = [];
    selectedItemsClone.forEach(o => newSelectedItems.push(this.copySvgPath(o)));

    this.copiedInClipboard = true;
    this.centralSelectionPoint = this.getCentralPointOfSelection();
    this.setState({ selectedItems: newSelectedItems });
  }


  copySvgPath(uuid) {
    const newUuid = uuidV1();
    const shapes = this.state.shapes;
    const texts = this.state.texts;

    if (has(shapes, uuid)) {
      const shape = shapes[uuid];
      shapes[newUuid] = {
        path: shape.path,
        color: shape.color,
        x: shape.x,
        y: shape.y,
        shapeTypeId: shape.shapeTypeId,
        uuid: newUuid,
      };
      const items = this.updateSelectionOriginalPosition([uuid], shapes);
      this.setState({
        shapes: items.shapes,
      });
    } else if (has(texts, uuid)) {
      const text = texts[uuid];
      texts[newUuid] = {
        content: text.content,
        x: text.x,
        y: text.y,
        fontSize: text.fontSize,
        uuid: newUuid,
      };
      const items = this.updateSelectionOriginalPosition([uuid], shapes, texts);
      this.setState({
        texts: items.texts,
      });
    }
    return newUuid;
  }

  deleteSvgPath(uuid) {
    const { shapes, texts, currentPageId } = this.state;
    const { selectedPrototype, user } = this.props.application;

    if (has(shapes, uuid)) {
      delete shapes[uuid];
      this.props.actions.deleteShape(selectedPrototype, currentPageId, uuid, user.token);
    } else if (has(texts, uuid)) {
      delete texts[uuid];
      this.props.actions.deleteText(selectedPrototype, currentPageId, uuid, user.token);
    }

    this.setState({
      shapes,
    });
  }

  dragItems(translation) {
    const { shapes, texts, selectedItems } = this.state;

    selectedItems.forEach((uuid) => {
      if (has(shapes, uuid)) {
        shapes[uuid].x = shapes[uuid].originalPositionBeforeDrag.x + translation.x;
        shapes[uuid].y = shapes[uuid].originalPositionBeforeDrag.y + translation.y;
      } else if (has(texts, uuid)) {
        texts[uuid].x = texts[uuid].originalPositionBeforeDrag.x + translation.x;
        texts[uuid].y = texts[uuid].originalPositionBeforeDrag.y + translation.y;
      }
    });

    this.setState({
      shapes,
      texts,
    });
  }

  toggleMenu(state, ...params) {
    let menu = null;
    menu = this.state.selectedItems.length > 0 ? this.selectionRadialMenuEl : this.radialMenuEl;
    let point;
    if (params.length) {
      point = params[0];
    } else {
      point = {
        x: this.props.application.workspace.currentPos.x,
        y: this.props.application.workspace.currentPos.y,
      };
    }

    if (state) {
      menu.style.left = point.x - constants.RADIAL_MENU_SIZE;
      menu.style.top = point.y - constants.RADIAL_MENU_SIZE;
    } else {
      menu.style.left = -9999;
    }
    this.menuPending = false;
    if (this.state.currentPath) {
      this.setState({
        showMenu: state,
        currentPath: null,
      });
    } else {
      this.setState({
        showMenu: state,
      });
    }
  }

  doAction(point) {
    switch (this.props.application.workspace.action) {
      case constants.menuItems.CHANGE_COLOR.action:
        this.changeColor();
        break;
      case constants.menuItems.ADD_TEXT.action:
        this.setState({
          currentMode: constants.modes.TEXT,
        });
        break;
      case constants.menuItems.SELECT_AREA.action:
        this.multiSelect(point);
        break;
      case constants.menuItems.DELETE_SELECTION.action:
        for (const uuid of this.state.selectedItems) {
          this.deleteSvgPath(uuid);
        }
        this.setState({
          selectedItems: [],
        });
        break;
      case constants.menuItems.DRAG_SELECTION.action: {
        // when done dragging, patch all dragged items
        const { shapes, texts, currentPageId } = this.state;
        this.state.selectedItems.forEach((o) => {
          const { selectedPrototype, user } = this.props.application;

          if (has(shapes, o)) {
            const patch = { x: shapes[o].x, y: shapes[o].y };
            this.props.actions.patchShape(selectedPrototype, currentPageId, o, patch, user.token);
          } else if (has(texts, o)) {
            const patch = { x: texts[o].x, y: texts[o].y };
            this.props.actions.patchText(selectedPrototype, currentPageId, o, patch, user.token);
          }
        });

        // Save new original positions before draging
        const items = this.updateSelectionOriginalPosition(this.state.selectedItems);
        this.setState({
          shapes: items.shapes,
          texts: items.texts,
        });
        break;
      }
      case constants.menuItems.COPY_SELECTION.action: {
        const shapesToClear = [];
        const textsToClear = [];

        // when done copying, create all new items
        const { shapes, texts, currentPageId } = this.state;
        this.state.selectedItems.forEach((o) => {
          const { selectedPrototype, user } = this.props.application;

          // create the elements
          if (has(shapes, o)) {
            shapesToClear.push(o);
            const copy = cloneElement(o, shapes[o], shapes);
            this.props.actions.createShape(selectedPrototype, currentPageId, copy, user.token);
          } else if (has(texts, o)) {
            textsToClear.push(o);
            const copy = cloneElement(o, texts[o], texts);
            this.props.actions.createText(selectedPrototype, currentPageId, copy, user.token);
          }
        });

        // clear the dragging elements that displayed where the new elements were created
        this.setState({
          shapes: omit(shapes, shapesToClear),
          texts: omit(texts, textsToClear),
        });

        // clear clipboard
        this.copiedInClipboard = false;
        this.clipboard = [];
        break;
      }
      default:
    }
  }

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

  renderWorkspace() {
    const { workspace } = this.props.application;
    if (this.state.shapes && this.state.texts) {
      return (
        <div
          id="workspace"
          onMouseDown={this.onStartingEvent}
          onMouseMove={this.onMovingEvent}
          onMouseUp={this.onEndingEvent}
          onMouseLeave={this.onEndingEvent}
          onTouchStart={this.onStartingEvent}
          onTouchMove={this.onMovingEvent}
          onTouchEnd={this.onEndingEvent}
          onTouchCancel={absorbEvent}
          onContextMenu={absorbEvent}
        >
          <RadialMenu
            items={menuItems}
            offset={Math.PI / 4}
            onLoad={(svgEl) => this.radialMenuDidMount(svgEl)}
          />
          <RadialMenu
            items={selectionMenuItems}
            offset={Math.PI / 4}
            onLoad={(svgEl) => this.selectionRadialMenuDidMount(svgEl)}
          />
          <svg height="100%" width="100%">
            <filter id="dropshadow" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {
              this.state.currentMode === constants.modes.TEXT &&
                <foreignObject
                  x={workspace.currentPos.x}
                  y={workspace.currentPos.y}
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
                  color={item[1].color}
                  path={item[1].path}
                  posX={item[1].x}
                  posY={item[1].y}
                  selected={this.state.selectedItems.some(e => e === item[0])}
                  monoSelect={this.monoSelect}
                  onLoad={(id, svgShape) => this.shapeDidMount(id, svgShape)}
                  key={i}
                />)
            }
            {
              Object.entries(this.state.texts).map((item, i) =>
                <Text
                  id={item[0]}
                  posX={item[1].x}
                  posY={item[1].y}
                  size={item[1].fontSize}
                  content={item[1].content}
                  selected={this.state.selectedItems.some(e => e === item[0])}
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
            {this.state.selectingRect !== null &&
              <path
                className="workspace-line"
                d={`M${this.state.selectingRect.x} ${this.state.selectingRect.y}
                  L${this.state.selectingRect.x}
                  ${this.state.selectingRect.y + this.state.selectingRect.height}
                  L${this.state.selectingRect.x + this.state.selectingRect.width}
                  ${this.state.selectingRect.y + this.state.selectingRect.height}
                  L${this.state.selectingRect.x + this.state.selectingRect.width}
                  ${this.state.selectingRect.y} Z`}
                stroke="black"
                strokeDasharray="5, 5"
              />
            }
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
      <div
        id="workspace-container"
        ref={div => div && div.focus()}
        className="workspace-container"
        tabIndex="0"
        onKeyDown={this.onKeyDownEvent}
      >
        {this.renderWorkspace()}
        <Footer pages={this.state.pages || {}} selectedPage={this.state.currentPageId || ''} />
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
    }, dispatch),
  })
)(Workspace);
