/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import iconSelect from '../../../assets/images/icons/select-area.svg';
import iconPalette from '../../../assets/images/icons/palette.png';
import iconText from '../../../assets/images/icons/text-fields.png';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

let offsetTop;
let offsetLeft;

const menuItems = [
  {
    color: '#F44336',
    icon: iconPalette, // Color
  },
  {
    color: '#4CAF50',
    icon: iconText, // Text
  },
  {
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

    this.state = {
      showMenu: false,
      mode: 0,
      isDrawing: false,
      svgPathStrings: [],
      previousPoints: null,
    };

    this.touchTimer = 0;
  }

  componentDidMount() {
    const workspaceElement = document.getElementById('workspace');
    offsetTop = workspaceElement.offsetTop;
    offsetLeft = workspaceElement.offsetLeft;
  }

  onStartingEvent(e) {
    e.stopPropagation();

    if (e.type === 'touchstart') {
      this.props.application.touchStartPos = {
        clientX: e.changedTouches.item(0).clientX,
        clientY: e.changedTouches.item(0).clientY,
      };
    } else {
      this.props.application.touchStartPos = {
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }

    const evt = {
      type: 'touchstart',
      ...this.props.application.touchStartPos,
    };
    this.touchTimer = setTimeout(() => this.toggleMenu(evt), 500);

    // Start Drawing
    let pointer = e;
    if (e.type.substring(0, 5) === 'touch') {
      pointer = e.touches[0];
    }
    const points = {
      x: pointer.pageX - offsetLeft,
      y: pointer.pageY - offsetTop,
    };
    this.setState({
      isDrawing: true,
      previousPoints: points,
    });
    this.createSvgPathString();
    this.computeSvgPathString(points, 'M');
  }

  onEndingEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    const evt = {
      type: 'touchend',
    };
    this.toggleMenu(evt);

    // stops short touches from firing the event
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
    }

    // Stop Drawing
    this.setState({
      isDrawing: false,
      previousPoints: null,
    });
  }

  onMovingEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    let deltaX = 0;
    let deltaY = 0;

    if (e.type === 'touchmove') {
      const touch = e.changedTouches.item(0);
      deltaX = Math.abs(touch.clientX - this.props.application.touchStartPos.clientX);
      deltaY = Math.abs(touch.clientY - this.props.application.touchStartPos.clientY);
      if (this.state.showMenu === true) {
        // const el = document.elementFromPoint(touch.clientX, touch.clientY);
        // console.log(el);
      }
    } else {
      deltaX = Math.abs(e.clientX - this.props.application.touchStartPos.clientX);
      deltaY = Math.abs(e.clientY - this.props.application.touchStartPos.clientY);
    }
    if (this.state.showMenu === false) {
      // Add error margin for small moves
      if (deltaX > 25 || deltaY > 25) {
        // stops move (draw action) from firing the event
        if (this.touchTimer) {
          clearTimeout(this.touchTimer);
        }
      }
    }

    // Drawing
    if (!this.state.showMenu) {
      let pointer = e;
      if (e.type.substring(0, 5) === 'touch') {
        pointer = e.touches[0];
      }
      const points = {
        x: pointer.pageX - offsetLeft,
        y: pointer.pageY - offsetTop,
      };
      if (this.arePointsFeedable(points)) {
        this.computeSvgPathString(points, 'L');
        this.setState({
          previousPoints: points,
        });
      }
    }
  }

  arePointsFeedable(currentPoints) {
    const minDistance = 10;
    const a = this.state.previousPoints.x - currentPoints.x;
    const b = this.state.previousPoints.y - currentPoints.y;
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

  toggleMenu(e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    if (e.type === 'contextmenu' || e.type === 'touchstart') {
      this.props.application.touchStartPos = {
        clientX: e.clientX,
        clientY: e.clientY,
      };
      this.setState({ showMenu: true });
    } else if (e.type === 'touchend' || e.type === 'touchcancel'
      || (e.type === 'mouseleave' && e.target.classList.contains('workspace-container'))) {
      this.setState({ showMenu: false });
    }
  }

  render() {
    const svgPaths = [];
    for (let i = 0; i < this.state.svgPathStrings.length; i++) {
      svgPaths.push(
        <path d={this.state.svgPathStrings[i]} stroke="blue" strokeWidth="3" fill="none">
        </path>);
    }
    return (
      <div
        id="workspace"
        className="workspace-container"
        onMouseDown={this.onStartingEvent}
        onMouseMove={this.onMovingEvent}
        onMouseUp={this.onEndingEvent}
        onMouseLeave={this.onEndingEvent}
        onMouseLeave={this.toggleMenu}
        onTouchStart={this.onStartingEvent}
        onTouchMove={this.onMovingEvent}
        onTouchEnd={this.onEndingEvent}
        onContextMenu={this.toggleMenu}
      >
      {this.state.showMenu && <RadialMenu items={menuItems} offset={Math.PI / 4} />}
        <svg height="100%" width="100%">
          {svgPaths}
        </svg>
      </div>
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(Workspace);
