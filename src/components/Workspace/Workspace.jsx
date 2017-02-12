/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import uuidV1 from 'uuid/v1';

import * as constants from '../constants';
import * as actions from '../../actions/constants';

/* Components */
import Footer from '../common/Footer/Footer';
import RadialMenu from '../common/RadialMenu/RadialMenu';
import Shape from './Shape/Shape';

/* Actions */
import { getPages, getShapes, getTexts } from '../../actions/api';
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
    this.computeSvgPathString = this.computeSvgPathString.bind(this);
    this.createShape = this.createShape.bind(this);
    this.arePointsFeedable = this.arePointsFeedable.bind(this);
    this.doAction = this.doAction.bind(this);

    this.changeColor = changeColor.bind(this);

    this.state = {
      showMenu: false,
      menuPending: false,
      isDrawing: false,
      currentPath: '',
      previousPoint: null,
      pages: null,
      shapes: null,
      texts: null,
    };

    this.touchTimer = 0;
  }

  componentWillReceiveProps(newProps) {
    const { prototypes, selectedPrototype, selectedPage } = newProps.application;
    if (!prototypes) return;

    const prototype = prototypes[selectedPrototype];

    // If the selected prototype's pages are not cached, get them
    if (!prototype.pages) {
      newProps.actions.getPages(selectedPrototype,
        newProps.application.user.token);
    }

    // If you just cached the pages, select the first one
    else if (newProps.api.lastAction === actions.GET_PAGES && !newProps.application.selectedPage) {
      this.props.actions.selectPage(Object.keys(prototype.pages)[0]);
      this.setState({ pages: prototype.pages });
    }

    // If you just cached the shapes, copy them in the state
    else if (newProps.api.lastAction === actions.GET_SHAPES) {
      this.setState({ shapes: prototype.pages[selectedPage].shapes });
    }

    // If you just cached the texts, copy them in the state
    else if (newProps.api.lastAction === actions.GET_TEXTS) {
      this.setState({ texts: prototype.pages[selectedPage].texts });
    }

    // If you have a selected page but its elements are not in cache, get them
    else if (newProps.application.selectedPage && !this.state.shapes) {
      this.props.actions.getShapes(selectedPrototype, selectedPage,
        newProps.application.user.token);
      this.props.actions.getTexts(selectedPrototype, selectedPage,
        newProps.application.user.token);
    }
  }

  onStartingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

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

      // Start drawing
      this.setState({
        menuPending: true,
        isDrawing: true,
        previousPoint: point,
        currentPath: '',
      });
      this.computeSvgPathString(point, 'M');
    }
  }

  onEndingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

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
    if (this.state.isDrawing === true) {
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
    // Stop Drawing
    this.setState({
      isDrawing: false,
      previousPoint: null,
    });

    this.doAction();
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

    // Determine if we draw or wait for the menu
    if (this.state.menuPending === true) {
      let deltaX = 0;
      let deltaY = 0;

      const { currentPos } = this.props.application.workspace;
      deltaX = Math.abs(point.x - currentPos.x);
      deltaY = Math.abs(point.y - currentPos.y);

      // Add error margin for small moves
      if (deltaX > 25 || deltaY > 25) {
        // stops move (draw action) from firing the event
        if (this.touchTimer) {
          clearTimeout(this.touchTimer);
        }
      }
    }
    if (this.state.isDrawing === true) {
      if (this.arePointsFeedable(point)) {
        this.computeSvgPathString(point, 'L');
        this.setState({
          previousPoint: point,
        });
      }
    }
  }

  doAction() {
    if (this.props.application.workspace.action === constants.menuItems.CHANGE_COLOR.action) {
      this.changeColor();
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
    this.setState({
      shapes: {
        ...this.state.shapes,
        [uuid]: {
          path: this.state.currentPath += `L${point.x} ${point.y}`,
          color: this.props.application.workspace.drawColor,
        },
      },
    });
    this.setState({ currentPath: '' });
  }
  computeSvgPathString(point, prefix) {
    let path = this.state.currentPath;
    path += `${prefix}${point.x} ${point.y} `;
    this.setState({
      currentPath: path,
    });
  }

  toggleMenu(state) {
    if (this.state.isDrawing === true) {
      this.setState({
        menuPending: false,
        showMenu: state,
        isDrawing: false,
        currentPath: '',
      });
    } else {
      this.setState({
        menuPending: false,
        showMenu: state,
      });
    }
  }

  renderWorkspace() {
    if (this.state.shapes && this.state.texts) {
      return (
        <div
          id="workspace"
          className="workspace-container"
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
            {
              Object.entries(this.state.shapes).map((item, i) =>
                <Shape
                  {...item[1]}
                  key={i}
                />)
            }
            <path
              className="workspace-line"
              d={this.state.currentPath}
              stroke={this.props.application.workspace.drawColor}
            />
          </svg>
        </div>
      );
    }

    return (
      <div>
        <div className="workspace-container backdrop"></div>
        <div className="loading">
          <span>Loading workspace</span>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
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
      selectPage,
      getShapes,
      getTexts,
    }, dispatch),
  })
)(Workspace);
