/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuidV1 from 'uuid/v1';
import { has, omit } from 'lodash';

import * as constants from '../constants';
import * as actions from '../../actions/constants';

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
  patchText } from '../../actions/api';
import { updateWorkspace, selectPage } from '../../actions/application';

/* Helpers */
import { changeColor } from './helpers';

const menuItems = [
  constants.menuItems.CHANGE_COLOR,
  constants.menuItems.ADD_TEXT,
  constants.menuItems.SELECT_AREA,
];

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.onStartingEvent = this.onStartingEvent.bind(this);
    this.onEndingEvent = this.onEndingEvent.bind(this);
    this.onMovingEvent = this.onMovingEvent.bind(this);
    this.createShape = this.createShape.bind(this);
    this.createText = this.createText.bind(this);
    this.doAction = this.doAction.bind(this);
    this.computeSvgPath = this.computeSvgPath.bind(this);
    this.arePointsFeedable = this.arePointsFeedable.bind(this);
    this.dragSvgPath = this.dragSvgPath.bind(this);
    this.deleteSvgPath = this.deleteSvgPath.bind(this);
    this.copySvgPath = this.copySvgPath.bind(this);
    this.onKeyDownEvent = this.onKeyDownEvent.bind(this);
    this.multiSelect = this.multiSelect.bind(this);
    this.toggleDragging = this.toggleDragging.bind(this);
    this.saveOriginalPathPositionForDrag = this.saveOriginalPathPositionForDrag.bind(this);

    this.changeColor = changeColor.bind(this);

    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];

    let shapes = null;
    let texts = null;

    // if the pages, shapes and texts already cached upon load
    if (prototype.pages && prototype.pages[selectedPage]) {
      shapes = prototype.pages[selectedPage].shapes || null;
      texts = prototype.pages[selectedPage].texts || null;
    }

    this.state = {
      showMenu: false,
      menuPending: false,
      currentPath: null,
      onDragging: false,
      selectingRect: null,
      previousPoint: null,
      pages: prototype.pages || null,
      currentPageId: null,
      shapes,
      texts,
      currentMode: null,
    };

    this.touchTimer = 0;
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
        shapes: shapes || null,
        texts: texts || null,
      });

      // Get shapes and texts if they are not cached
      if (!shapes) {
        this.props.actions.getShapes(selectedPrototype, selectedPage,
        newProps.application.user.token);
      }
      if (!texts) {
        this.props.actions.getTexts(selectedPrototype, selectedPage,
        newProps.application.user.token);
      }
    }

    // If the page types are not cached, get them
    if (!newProps.api.getPageTypes.pageTypes) {
      this.props.actions.getPageTypes(newProps.application.user.token);
    }

    // If the shape types are not cached, get them
    if (!newProps.api.getShapeTypes.shapeTypes) {
      this.props.actions.getShapeTypes(newProps.application.user.token);
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
    else if (newProps.api.lastAction === actions.GET_SHAPES && !this.state.shapes) {
      this.setState({ shapes: prototype.pages[selectedPage].shapes });
    }

    // If you just cached the texts, copy them in the state
    else if (newProps.api.lastAction === actions.GET_TEXTS && !this.state.texts) {
      this.setState({ texts: prototype.pages[selectedPage].texts });
    }

    // Replace the uuid of the created shape with th uui of the DB
    else if (newProps.api.lastAction === actions.CREATE_SHAPE) {
      const { shape } = newProps.api.createShape;
      this.setState({
        shapes: {
          ...omit(this.state.shapes, shape.uuid),
          [shape.id]: omit(shape, ['uuid', 'id', 'pageId']),
        },
      });
    }
  }

  onStartingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    // Add text if there was one being created
    if (this.state.currentMode === constants.modes.TEXT) {
      this.createText();
    }

    // Set the initial position
    let pointer = e;
    if (e.type === constants.events.TOUCH_START) {
      pointer = e.changedTouches.item(0);
    }
    const point = {
      x: pointer.clientX - constants.LEFT_MENU_WIDTH,
      y: pointer.clientY - constants.TOP_MENU_HEIGHT,
    };
    this.props.actions.updateWorkspace({
      currentPos: {
        x: point.x,
        y: point.y,
      },
    });

    if (e.type === constants.events.CONTEXT_MENU) {
      this.toggleMenu(true);
    } else {
      // Set timer for menu
      this.touchTimer = setTimeout(() => this.toggleMenu(true), 500);

      if (this.state.onDragging === false) {
        // Start drawing
        this.setState({
          menuPending: true,
          previousPoint: point,
          currentPath: {
            pathString: '',
            position: point,
          },
        }, () => {
          if (this.state.currentPath) {
            this.computeSvgPath(point, 'M');
          }
        });
      }
    }

    this.setState({
      menuPending: true,
    });

    if (this.state.onDragging === false) {
      // Monoselection
      const elementMouseIsOver = document.elementFromPoint(
          point.x + constants.LEFT_MENU_WIDTH, point.y + constants.TOP_MENU_HEIGHT);

      if (elementMouseIsOver.nodeName === 'path') {
        const selectedPaths = [];
        selectedPaths.push(elementMouseIsOver.id);
        this.props.actions.updateWorkspace({
          selectedItems: selectedPaths,
        });
      } else {
        this.props.actions.updateWorkspace({
          selectedItems: [],
        });
      }

      this.setState({ currentPath: null });
    }

    // Save original path position before dragging
    if (this.state.onDragging === true) {
      for (const id of this.props.application.workspace.selectedItems) {
        this.saveOriginalPathPositionForDrag(id);
      }
    }
  }

  onEndingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    // Add text if there was one being created
    if (this.state.currentMode === constants.modes.TEXT) {
      this.createText();
    }

    // Get event position
    let pointer = e;
    if (e.type === constants.events.TOUCH_END) {
      pointer = e.changedTouches.item(0);
    }

    const point = {
      x: pointer.clientX - constants.LEFT_MENU_WIDTH,
      y: pointer.clientY - constants.TOP_MENU_HEIGHT,
    };

    // Finish drawing by adding last point
    if (this.state.currentPath && this.state.onDragging === false) {
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

    this.doAction(point);
  }

  onMovingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    // Get event position
    let pointer = e;
    if (e.type === constants.events.TOUCH_MOVE) {
      pointer = e.changedTouches.item(0);

      // HACK : The touchmove event is not fired on the svg : we have to handle it here
      const el = document.elementFromPoint(pointer.clientX, pointer.clientY);
      if (el.nodeName === 'path' && el.className) {
        const classes = el.className.baseVal.split('-');
        if (classes[0] === 'action' && classes[1] !== this.props.application.workspace.action) {
          if (classes.length > 2 && classes[2] !== this.props.application.workspace.actionValue) {
            this.props.actions.updateWorkspace({
              action: classes[1],
              actionValue: classes[2],
            });
          } else {
            this.props.actions.updateWorkspace({ action: classes[1] });
          }
        }
      }
    }

    const point = {
      x: pointer.clientX - constants.LEFT_MENU_WIDTH,
      y: pointer.clientY - constants.TOP_MENU_HEIGHT,
    };

    const { currentPos } = this.props.application.workspace;
    // Determine if we draw or wait for the menu
    if (this.state.menuPending === true) {
      let deltaX = 0;
      let deltaY = 0;

      deltaX = Math.abs(point.x - currentPos.x);
      deltaY = Math.abs(point.y - currentPos.y);

      // Add error margin for small moves
      if (deltaX > 25 || deltaY > 25) {
        // stops move (draw action) from firing the event
        if (this.touchTimer) {
          clearTimeout(this.touchTimer);

          if (this.state.onDragging === true) {
            // Start Dragging
            const translation = {
              x: point.x - currentPos.x,
              y: point.y - currentPos.y,
            };
            for (const uuid of this.props.application.workspace.selectedItems) {
              this.dragSvgPath(uuid, translation);
            }
          }
        }
      }
    }
    if (this.props.application.workspace.action === constants.menuItems.SELECT_AREA.action) {
      // Selecting
      this.setState({
        selectingRect: {
          x: currentPos.x,
          y: currentPos.y,
          width: point.x - currentPos.x,
          height: point.y - currentPos.y,
        },
      });
    } else if (this.state.currentPath && this.state.onDragging === false) {
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
      for (const uuid of this.props.application.workspace.selectedItems) {
        this.deleteSvgPath(uuid);
        this.props.actions.deleteShape(this.props.application.selectedPrototype,
          this.state.currentPageId, uuid, this.props.application.user.token);
      }
    } else if (e.key === constants.keys.C) {
      for (const uuid of this.props.application.workspace.selectedItems) {
        this.copySvgPath(uuid);
      }
    } else if (e.key === constants.keys.D) {
      this.toggleDragging();
    } else if (e.key === constants.keys.ENTER) {
      this.createText();
    }
  }

  arePointsFeedable(currentPoint) {
    const minDistance = 10;
    const a = this.state.previousPoint.x - currentPoint.x;
    const b = this.state.previousPoint.y - currentPoint.y;
    const c = Math.sqrt(a * a + b * b);

    return c > minDistance;
  }

  createShape(point) {
    const uuid = uuidV1();
    const shape = {
      path: this.state.currentPath.pathString
      += `L${point.x - this.state.currentPath.position.x} ` +
      `${point.y - this.state.currentPath.position.y}`,
      color: this.props.application.workspace.drawColor,
      x: this.state.currentPath.position.x,
      y: this.state.currentPath.position.y,
      shapeTypeId: this.props.api.getShapeTypes.shapeTypes.line,
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

  createText() {
    const uuid = uuidV1();
    const { currentPos } = this.props.application.workspace;

    const text = {
      content: this.textEdit.value,
      x: currentPos.x,
      y: currentPos.y + 27,
      /* TODO: this should come from a default workspace font size,
       * that can be changed with the radial menu */
      fontSize: 24,
      uuid,
    };

    this.setState({
      texts: {
        ...this.state.texts,
        [uuid]: text,
      },
      currentPath: null,
      previousPoint: null,
      currentMode: null,
    });

    this.props.actions.createText(this.props.application.selectedPrototype,
      this.state.currentPageId, text, this.props.application.user.token);
  }

  computeSvgPath(point, prefix) {
    const path = this.state.currentPath;

    path.pathString += `${prefix}${point.x - path.position.x} ${point.y - path.position.y} `;
    this.setState({
      currentPath: path,
    });
  }

  copySvgPath(uuid) {
    const shapes = this.state.shapes;
    const shape = shapes[uuid];
    const newUuid = uuidV1();
    shapes[newUuid] = {
      path: shape.path,
      color: shape.color,
      position: {
        x: shape.x + 100,
        y: shape.y + 100,
      },
    };
    this.setState({
      shapes,
    });
  }

  deleteSvgPath(uuid) {
    const shapes = this.state.shapes;
    delete shapes[uuid];
    this.setState({
      shapes,
    });
  }

  dragSvgPath(uuid, translation) {
    const { shapes, texts } = this.state;

    if (has(shapes, uuid)) {
      shapes[uuid].x = shapes[uuid].originalPositionBeforeDrag.x + translation.x;
      shapes[uuid].y = shapes[uuid].originalPositionBeforeDrag.y + translation.y;
    } else if (has(texts, uuid)) {
      texts[uuid].x = texts[uuid].originalPositionBeforeDrag.x + translation.x;
      texts[uuid].y = texts[uuid].originalPositionBeforeDrag.y + translation.y;
    }

    this.setState({
      shapes,
      texts,
    });
  }

  multiSelect(pointerPos) {
    const { currentPos } = this.props.application.workspace;

    const selectRectRight = pointerPos.x < currentPos.x ? currentPos.x : pointerPos.x;
    const selectRectLeft = pointerPos.x > currentPos.x ? currentPos.x : pointerPos.x;
    const selectRectTop = pointerPos.y > currentPos.y ? currentPos.y : pointerPos.y;
    const selectRectBottom = pointerPos.y < currentPos.y ? currentPos.y : pointerPos.y;


    const selectedItems = Object.keys({
      ...this.state.shapes,
      ...this.state.texts,
    }).filter((key) => {
      const pathRect = document.getElementById(key).getBoundingClientRect();
      const pathRectRight = pathRect.right - constants.LEFT_MENU_WIDTH;
      const pathRectLeft = pathRect.left - constants.LEFT_MENU_WIDTH;
      const pathRectTop = pathRect.top - constants.TOP_MENU_HEIGHT;
      const pathRectBottom = pathRect.bottom - constants.TOP_MENU_HEIGHT;

      return pathRectRight <= selectRectRight && pathRectLeft >= selectRectLeft
          && pathRectTop >= selectRectTop && pathRectBottom <= selectRectBottom;
    });

    this.props.actions.updateWorkspace({
      selectedItems,
    });
  }

  toggleMenu(state) {
    if (this.state.currentPath) {
      this.setState({
        menuPending: false,
        showMenu: state,
        currentPath: null,
      });
    } else {
      this.setState({
        menuPending: false,
        showMenu: state,
      });
    }
  }

  doAction(point) {
    if (this.props.application.workspace.action === constants.menuItems.CHANGE_COLOR.action) {
      this.changeColor();
    } else if (this.props.application.workspace.action === constants.menuItems.SELECT_AREA.action) {
      this.multiSelect(point);
      this.setState({
        selectingRect: null,
      });
    } else if (this.props.application.workspace.action === constants.menuItems.ADD_TEXT.action) {
      this.setState({
        currentMode: constants.modes.TEXT,
      });
      setTimeout(() => {
        this.textEdit.focus();
      }, 100);
    }
  }

  toggleDragging() {
    const dragging = !this.state.onDragging;
    this.setState({
      onDragging: dragging,
    });


    // when done dragging, path all dragged items
    if (!dragging) {
      const { shapes, texts, currentPageId } = this.state;
      this.props.application.workspace.selectedItems.forEach((o) => {
        const { selectedPrototype, user } = this.props.application;

        if (has(shapes, o)) {
          const patch = { x: shapes[o].x, y: shapes[o].y };
          this.props.actions.patchShape(selectedPrototype, currentPageId, o, patch, user.token);
        } else if (has(texts, o)) {
          const patch = { x: texts[o].x, y: texts[o].y };
          this.props.actions.patchText(selectedPrototype, currentPageId, o, patch, user.token);
        }
      });
    }
  }

  saveOriginalPathPositionForDrag(uuid) {
    const { shapes, texts } = this.state;

    if (has(shapes, uuid)) {
      shapes[uuid].originalPositionBeforeDrag = {
        x: shapes[uuid].x,
        y: shapes[uuid].y,
      };
    } else if (has(texts, uuid)) {
      texts[uuid].originalPositionBeforeDrag = {
        x: texts[uuid].x,
        y: texts[uuid].y,
      };
    }

    this.setState({
      shapes,
      texts,
    });
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
          onContextMenu={this.onStartingEvent}
        >
          {this.state.showMenu && <RadialMenu items={menuItems} offset={Math.PI / 4} />}
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
                  key={i}
                />)
            }
            {
              Object.entries(this.state.texts).map((item, i) =>
                <Text
                  id={item[0]}
                  posx={item[1].x}
                  posy={item[1].y}
                  size={item[1].fontSize}
                  content={item[1].content}
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
                stroke={this.props.application.workspace.drawColor}
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
    }, dispatch),
  })
)(Workspace);
