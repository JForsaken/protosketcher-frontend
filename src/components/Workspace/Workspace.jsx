/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

const menuItems = [
  {
    color: '#F44336',
    icon: 'M24 6C14.06 6 6 14.06 6 24s8.06 18 18 18c1.66 0 3-1.34 3-3 0-.78-.29-1.48-.78-2.01-.47-.'
    + '53-.75-1.22-.75-1.99 0-1.66 1.34-3 3-3H32c5.52 0 10-4.48 10-10 0-8.84-8.06-16-18-16zM13 24c-'
    + '1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6-8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34'
    + ' 3 3-1.34 3-3 3zm10 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6 8c-1.66 0-3-1.3'
    + '4-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
  },
  {
    color: '#4CAF50',
    icon: 'M5 8v6h10v24h6V14h10V8H5zm38 10H25v6h6v14h6V24h6v-6z', // Text
  },
  {
    color: '#2196F3',
    flex: 2,
    icon: 'M2 18h4v-4H2v4zm0 8h4v-4H2v4zm0-16h4V6c-2.21 0-4 1.79-4 4zm16 32h4v-4h-4v4zM2 34h4v-4H2v'
    + '4zm4 8v-4H2c0 2.21 1.79 4 4 4zM42 6H26v12h20v-8c0-2.21-1.79-4-4-4zm0 28h4v-4h-4v4zM18 10h4V6'
    + 'h-4v4zm-8 32h4v-4h-4v4zm0-32h4V6h-4v4zm32 32c2.21 0 4-1.79 4-4h-4v4zm0-16h4v-4h-4v4zM26 42h4'
    + 'v-4h-4v4zm8 0h4v-4h-4v4z', // Selection
  },
];

class Workspace extends Component {

  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);

    this.state = {
      showMenu: false,
      mode: 0,
      touchStartPos: {},
    };

    this.touchTimer = 0;
  }

  toggleMenu(e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    if (e.type === 'contextmenu' || e.type === 'touchstart') {
      this.props.application.menu = {
        clientX: e.clientX,
        clientY: e.clientY,
      };
      this.setState({ showMenu: true });
    } else if (e.type === 'touchend' || e.type === 'touchcancel'
      || (e.type === 'mouseleave' && e.target.classList.contains('workspace-container'))) {
      this.props.application.menu = {};
      this.setState({ showMenu: false });
    }
  }

  touchStart(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'touchstart') {
      this.state.touchStartPos = {
        clientX: e.changedTouches.item(0).clientX,
        clientY: e.changedTouches.item(0).clientY,
      };
    } else {
      this.state.touchStartPos = {
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }

    const evt = {
      type: 'touchstart',
      ...this.state.touchStartPos,
    };
    this.touchTimer = setTimeout(() => this.toggleMenu(evt), 500);
  }

  touchEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    this.state.touchStartPos = {};
    const evt = {
      type: 'touchend',
    };
    this.toggleMenu(evt);

    // stops short touches from firing the event
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
    }
  }

  touchMove(e) {
    e.stopPropagation();
    let deltaX = 0;
    let deltaY = 0;

    if (e.type === 'touchmove') {
      deltaX = Math.abs(e.changedTouches.item(0).clientX - this.state.touchStartPos.clientX);
      deltaY = Math.abs(e.changedTouches.item(0).clientY - this.state.touchStartPos.clientY);
    } else {
      deltaX = Math.abs(e.clientX - this.state.touchStartPos.clientX);
      deltaY = Math.abs(e.clientY - this.state.touchStartPos.clientY);
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
  }

  render() {
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
      </div>
      );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(Workspace);
