/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);

    this.state = {
      showMenu: false,
      mode: 0,
    };
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
    return (
      <div
        className="workspace-container"
        onMouseDown={this.toggleMenu}
        onMouseUp={this.toggleMenu}
        onMouseLeave={this.toggleMenu}
      >
      {this.state.showMenu && <RadialMenu />}
      </div>
      );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(Workspace);
