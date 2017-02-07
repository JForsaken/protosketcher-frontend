/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import uuidV1 from 'uuid/v1';

import * as constants from '../constants';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

/* Actions */
import { updateWorkspace } from '../../actions/application';

/* Helpers */
import { changeColor } from './helpers';

// TODO
// - Keep first points and delete them if menu
// - Keep last point regardless of distance

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

    // Set initial props
    this.props.actions.updateWorkspace({
      currentPos: {
        x: 0,
        y: 0,
      },
      drawColor: 'black',
      menuHidden: true,
      action: null,
      actionValue: null,
      selectedItems: null,
      shapes: {}, // TODO Update with page/shape structure when done
    });

    this.state = {
      showMenu: false,
      menuPending: false,
      isDrawing: false,
      currentPath: '',
      previousPoint: null,
    };

    this.touchTimer = 0;
  }

  onStartingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    // Set the initial position
    if (e.type === constants.events.TOUCH_START) {
      this.props.actions.updateWorkspace({
        currentPos: {
          x: e.changedTouches.item(0).clientX - constants.LEFT_MENU_WIDTH,
          y: e.changedTouches.item(0).clientY - constants.TOP_MENU_HEIGHT,
        },
      });
    } else {
      this.props.actions.updateWorkspace({
        currentPos: {
          x: e.clientX - constants.LEFT_MENU_WIDTH,
          y: e.clientY - constants.TOP_MENU_HEIGHT,
        },
      });
    }

    if (e.type === constants.events.CONTEXT_MENU) {
      this.toggleMenu(true);
    } else {
      // Set timer for menu
      this.touchTimer = setTimeout(() => this.toggleMenu(true), 500);
    }
    this.setState({
      menuPending: true,
    });
  }

  onEndingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.isDrawing === true) {
      this.createShape();
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

          // Start Drawing
          this.setState({
            menuPending: false,
            isDrawing: true,
            previousPoint: point,
          });
          this.setState({ currentPath: '' });
          this.computeSvgPathString(point, 'M');
        }
      }
    } else if (this.state.isDrawing === true) {
      if (this.arePointsFeedable(point)) {
        this.computeSvgPathString(point, 'L');
        this.setState({
          previousPoint: point,
        });
      }
    }
  }

  doAction() {
    if (this.props.application.workspace.action === 'changeColor') {
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

  createShape() {
    const uuid = uuidV1();
    this.props.actions.updateWorkspace({
      shapes: {
        ...this.props.application.workspace.shapes,
        [uuid]: {
          path: this.state.currentPath,
          color: this.props.application.workspace.drawColor,
        },
      },
    });
    this.setState({ currentPath: '' });
  }
  computeSvgPathString(points, prefix) {
    let path = this.state.currentPath;
    path += `${prefix}${points.x} ${points.y} `;
    this.setState({
      currentPath: path,
    });
  }

  toggleMenu(state) {
    this.setState({
      menuPending: false,
      showMenu: state,
    });
  }

  render() {
    const shapes = this.props.application.workspace.shapes;
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
            Object.entries(shapes).map((item, i) =>
              <path
                className="workspace-line"
                d={item[1].path}
                stroke={item[1].color}
                key={i}
              />)
          }
          <path
            className="workspace-line"
            d={this.state.currentPath}
            stroke={this.props.application.workspace.drawColor}
          />)
        </svg>
      </div>
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  dispatch => ({
    actions: bindActionCreators({
      updateWorkspace,
    }, dispatch),
  })
)(Workspace);
