/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import iconSelect from '../../../assets/images/icons/select-area.svg';
import iconPalette from '../../../assets/images/icons/palette.png';
import iconText from '../../../assets/images/icons/text-fields.png';
import { bindActionCreators } from 'redux';

import * as constants from '../constants';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

/* Actions */
import { updateWorkspace } from '../../actions/application';

const menuItems = [
  {
    action: 'changeColor',
    color: '#F44336',
    icon: iconPalette, // Color
  },
  {
    action: 'addText',
    color: '#4CAF50',
    icon: iconText, // Text
  },
  {
    action: 'selectArea',
    color: '#2196F3',
    flex: 2,
    icon: iconSelect, // Selection
  },
];

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.onStartingEvent = this.onStartingEvent.bind(this);
    this.onEndingEvent = this.onEndingEvent.bind(this);
    this.onMovingEvent = this.onMovingEvent.bind(this);
    this.computeSvgPathString = this.computeSvgPathString.bind(this);
    this.createSvgPathString = this.createSvgPathString.bind(this);
    this.arePointsFeedable = this.arePointsFeedable.bind(this);

    // Set initial props
    this.props.actions.updateWorkspace({
      currentPos: {
        x: 0,
        y: 0,
      },
      drawColor: 'black',
      menuHidden: true,
      action: null,
      selectedItems: null,
    });

    this.state = {
      showMenu: false,
      menuPending: false,
      isDrawing: false,
      svgPathStrings: [],
      previousPoint: null,
    };

    this.touchTimer = 0;
  }

  onStartingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    // Set the initial position
    if (e.type === 'touchstart') {
      this.props.actions.updateWorkspace({
        currentPos: {
          x: e.changedTouches.item(0).clientX - constants.leftMenuWidth,
          y: e.changedTouches.item(0).clientY - constants.topMenuHeight,
        },
      });
    } else {
      this.props.actions.updateWorkspace({
        currentPos: {
          x: e.clientX - constants.leftMenuWidth,
          y: e.clientY - constants.topMenuHeight,
        },
      });
    }

    if (e.type === 'contextmenu') {
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

    if (!(e.type === 'mouseleave' && e.target.classList.contains('workspace-container'))) {
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
  }

  onMovingEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    // Get event position
    let pointer = e;
    if (e.type === 'touchmove') {
      pointer = e.changedTouches.item(0);

      // HACK : The touchmove event is not fired on the svg : we have to handle it here
      const el = document.elementFromPoint(pointer.clientX, pointer.clientY);
      if (el.nodeName === 'path' && el.className) {
        const classes = el.className.baseVal.split('-');
        if (classes[0] === 'action' && classes[1] !== this.props.application.workspace.action) {
          this.props.actions.updateWorkspace({ action: classes[1] });
        }
      }
    }
    const point = {
      x: pointer.clientX - constants.leftMenuWidth,
      y: pointer.clientY - constants.topMenuHeight,
    };

    // Determine if we draw or wait for the menu
    if (this.state.menuPending === true) {
      let deltaX = 0;
      let deltaY = 0;

      deltaX = Math.abs(point.x - this.props.application.workspace.currentPos.x);
      deltaY = Math.abs(point.y - this.props.application.workspace.currentPos.y);

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
          this.createSvgPathString();
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

  arePointsFeedable(currentPoint) {
    const minDistance = 10;
    const a = this.state.previousPoint.x - currentPoint.x;
    const b = this.state.previousPoint.y - currentPoint.y;
    const c = Math.sqrt(a * a + b * b);
    return c > minDistance;
  }

  createSvgPathString() {
    const paths = this.state.svgPathStrings;
    const minimumStringLength = 20;
    if (paths.length > 0 && paths[paths.length - 1].length < minimumStringLength) {
      paths.pop();
    }
    paths.push('');
    this.setState({
      svgPathStrings: paths,
    });
  }

  computeSvgPathString(points, prefix) {
    const pathStrings = this.state.svgPathStrings;
    pathStrings[pathStrings.length - 1] += `${prefix}${points.x} ${points.y} `;
    this.setState({
      svgPathStrings: pathStrings,
    });
  }

  toggleMenu(state) {
    this.setState({
      menuPending: false,
      showMenu: state,
    });
  }

  render() {
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
            this.state.svgPathStrings.map((item, i) =>
              <path
                className="workspace-line"
                d={item}
                stroke={this.props.application.workspace.drawColor}
                key={i}
              />)
          }
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
