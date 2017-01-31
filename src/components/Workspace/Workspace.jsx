/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

let offsetTop;
let offsetLeft;

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
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
  }

  onDrawing(e) {
    const points = new Array(2);
    let pointer = e;
    let pointerCount = 1;
    if (e.type.substring(0, 5) === 'touch') {
      pointerCount = e.touches.length;
    }
    for (let i = 0; i < pointerCount; i++) {
      if (e.type.substring(0, 5) === 'touch') {
        pointer = e.touches[i];
      }
      if ((e.type === 'mousemove' && this.state.isDrawing) || e.type === 'touchmove') {
        points[0] = pointer.pageX - offsetLeft;
        points[1] = pointer.pageY - offsetTop;
        if (this.arePointsFeedable(points)) {
          this.computeSvgPathString(points, i, pointerCount, 'L');
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
        this.computeSvgPathString(points, i, pointerCount, 'M');
      } else if (((e.type === 'mouseup' || e.type === 'mouseleave')
          && this.state.isDrawing) || e.type === 'touchend') {
        this.setState({
          isDrawing: false,
          previousPoints: new Array(2),
        });
      }
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

  computeSvgPathString(points, pointerIndex, pointerCount, prefix) {
    const pathStrings = this.state.svgPathStrings;
    pathStrings[pathStrings.length - pointerCount + pointerIndex] +=
      `${prefix}${points[0]} ${points[1]} `;
    this.setState({
      svgPathStrings: pathStrings,
    });
  }

  toggleMenu(e) {
    if (e.type === 'mousedown') {
      this.props.application.menu = {
        pageX: e.pageX,
        pageY: e.pageY,
      };
      this.setState({ showMenu: true });
    } else if (e.type === 'mouseup' || (e.type === 'mouseleave'
        && e.target.classList.contains('workspace-container'))) {
      this.props.application.menu = {};
      this.setState({ showMenu: false });
    }
  }

  render() {
    window.onload = () => {
      offsetTop = document.getElementById('workspace').offsetTop;
      offsetLeft = document.getElementById('workspace').offsetLeft;
    };
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
        onMouseMove={this.onDrawing}
        onMouseDown={this.onDrawing}
        onMouseUp={this.onDrawing}
        onMouseLeave={this.onDrawing}
        onTouchStart={this.onDrawing}
        onTouchMove={this.onDrawing}
        onTouchEnd={this.onDrawing}
      >
      {this.state.showMenu && <RadialMenu />}
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
