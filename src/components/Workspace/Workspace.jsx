/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.onDrawing = this.onDrawing.bind(this);
    this.computeSvgPathStrings = this.computeSvgPathStrings.bind(this);

    this.state = {
      showMenu: false,
      mode: 0,
      coordsBuffer: [],
      paths: [],
      svgPathStrings: [],
    };
  }

  onDrawing(e) {
    const points = new Array(2);
    const b = this.state.coordsBuffer;
    if (e.type === 'mousemove' && b.length > 0) {
      const p = this.state.paths;
      points[0] = e.pageX - document.getElementById('workspace').offsetLeft;
      points[1] = e.pageY - document.getElementById('workspace').offsetTop;
      b.push(points);
      p[p.length - 1] = b;
      this.setState({
        coordsBuffer: b,
        paths: p,
      });
      this.computeSvgPathStrings();
    } else if (e.type === 'mousedown') {
      const p = this.state.paths;
      points[0] = e.pageX - document.getElementById('workspace').offsetLeft;
      points[1] = e.pageY - document.getElementById('workspace').offsetTop;
      b.push(points);
      p.push(b);
      this.setState({
        coordsBuffer: b,
        paths: p,
      });
      this.computeSvgPathStrings();
    } else if ((e.type === 'mouseup' || e.type === 'mouseleave')
        && b.length > 0) {
      this.setState({
        coordsBuffer: [],
      });
      this.computeSvgPathStrings();
    }
  }

  computeSvgPathStrings() {
    const paths = this.state.paths;
    const pathStrings = [];
    for (const path of paths) {
      let pathString = '';
      for (let index = 0; index < path.length; ++index) {
        if (index === 0) {
          pathString += `M${path[index][0]} ${path[index][1]} `;
        } else {
          pathString += `L${path[index][0]} ${path[index][1]} `;
        }
      }
      pathStrings.push(pathString);
    }
    this.setState({ svgPathStrings: pathStrings });
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
    const svgPaths = [];
    for (let i = 0; i < this.state.svgPathStrings.length; i++) {
      svgPaths.push(
        <path d={this.state.svgPathStrings[i]} stroke="orange" strokeWidth="3" fill="none">
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
