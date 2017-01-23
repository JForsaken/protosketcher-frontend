/* Node modules */
import React, { Component } from 'react';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

export default class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);

    this.state = {
      showMenu: false,
      mode: 0,
    };
  }

  toggleMenu(state) {
    this.setState({ showMenu: state });
  }

  render() {
    return (
      <div
        className="workspace-container"
        onMouseDown={() => this.toggleMenu(true)}
        onMouseUp={() => this.toggleMenu(false)}
      >
      {this.state.showMenu && <RadialMenu />}
      </div>
      );
  }
}
