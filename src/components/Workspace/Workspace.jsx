/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

const menuItems = [
  {
    color: '#F44336',
  },
  {
    color: '#4CAF50',
  },
  {
    color: '#FFEB3B',
  },
  {
    color: '#2196F3',
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
        pageX: e.pageX,
        pageY: e.pageY,
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
        pageX: e.changedTouches.item(0).pageX,
        pageY: e.changedTouches.item(0).pageY,
      };
    } else {
      this.state.touchStartPos = {
        pageX: e.pageX,
        pageY: e.pageY,
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
      deltaX = Math.abs(e.changedTouches.item(0).pageX - this.state.touchStartPos.pageX);
      deltaY = Math.abs(e.changedTouches.item(0).pageY - this.state.touchStartPos.pageY);
    } else {
      deltaX = Math.abs(e.pageX - this.state.touchStartPos.pageX);
      deltaY = Math.abs(e.pageY - this.state.touchStartPos.pageY);
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
      {this.state.showMenu && <RadialMenu offset="0.4" items={menuItems} />}
      </div>
      );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(Workspace);
