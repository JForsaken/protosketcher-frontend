/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenu from '../common/RadialMenu/RadialMenu';

const menuItems = [
  {
    color: '#F44336',
    icon: 'icon-palette', // Color
  },
  {
    color: '#4CAF50',
    icon: 'icon-text', // Text
  },
  {
    color: '#2196F3',
    flex: 2,
    icon: 'icon-selection', // Selection
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
    };

    this.touchTimer = 0;
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

  touchStart(e) {
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
  }

  touchEnd(e) {
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
  }

  touchMove(e) {
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
