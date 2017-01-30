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
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.onDrawing = this.onDrawing.bind(this);
    this.computeSvgPathString = this.computeSvgPathString.bind(this);
    this.createSvgPathString = this.createSvgPathString.bind(this);
    this.arePointsFeedable = this.arePointsFeedable.bind(this);

    this.state = {
      showMenu: false,
      mode: 0,
      isDrawing: false,
      svgPathStrings: [],
      previousPoints: new Array(2),
    };

    this.touchTimer = 0;
  }

componentDidMount() {
    offsetTop = document.getElementById('workspace').offsetTop;
    offsetLeft = document.getElementById('workspace').offsetLeft;
  }
  onDrawing(e) {
    const points = new Array(2);
    let pointer = e;
    if (e.type.substring(0, 5) === 'touch') {
      pointer = e.touches[0];
    }
    if ((e.type === 'mousemove' && this.state.isDrawing) || e.type === 'touchmove') {
      points[0] = pointer.pageX - offsetLeft;
      points[1] = pointer.pageY - offsetTop;
      if (this.arePointsFeedable(points)) {
        this.computeSvgPathString(points, 'L');
        this.setState({
          previousPoints: points,
        });
      }
    } else if (e.type === 'mousedown' || e.type === 'touchstart') {
      points[0] = pointer.pageX - offsetLeft;
      points[1] = pointer.pageY - offsetTop;
      this.setState({
        isDrawing: true,
        previousPoints: points,
      });
      this.createSvgPathString();
      this.computeSvgPathString(points, 'M');
    } else if (((e.type === 'mouseup' || e.type === 'mouseleave')
        && this.state.isDrawing) || e.type === 'touchend') {
      this.setState({
        isDrawing: false,
        previousPoints: new Array(2),
      });
    }
  }

  arePointsFeedable(currentPoints) {
    const minDistance = 10;
    const a = this.state.previousPoints[0] - currentPoints[0];
    const b = this.state.previousPoints[1] - currentPoints[1];
    const c = Math.sqrt(a * a + b * b);
    return c > minDistance;
  }

  createSvgPathString() {
    const paths = this.state.svgPathStrings;
    const minimumLength = 20;
    if (paths.length > 0 && paths[paths.length - 1].length < minimumLength) {
      paths.pop();
    }
    paths.push('');
    this.setState({
      svgPathStrings: paths,
    });
  }

  computeSvgPathString(points, prefix) {
    const pathStrings = this.state.svgPathStrings;
    pathStrings[pathStrings.length - 1] += `${prefix}${points[0]} ${points[1]} `;
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
        className="workspace-container"
        onMouseDown={this.touchStart}
        onMouseMove={this.touchMove}
        onMouseUp={this.touchEnd}
        onMouseLeave={this.toggleMenu}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
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
