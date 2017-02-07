/**
 * Displays a radial menu with specified items
 *
 * Props :
 *
 * items: Array of objects containig props for each RadialMenuItem
 * offset: Offset to aply to the first element's angle
 */

/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenuItem from './RadialMenuItem/RadialMenuItem';

/* Constants */
const MENU_SIZE = 150;

class RadialMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedIndex: -1,
    };

    this.initElements();
  }

  initElements() {
    let flexTotal = 0;
    for (const item of this.props.items) {
      flexTotal += item.flex || 1;
    }
    let offset = this.props.offset || 0;
    offset = parseFloat(offset);

    for (const item of this.props.items) {
      item.startAngle = offset;
      offset += 2 * Math.PI * (item.flex || 1) / flexTotal;
      if (offset > 2 * Math.PI) {
        offset -= 2 * Math.PI;
      }
      item.endAngle = offset;
    }
  }

  render() {
    const menuStyle = {
      left: this.props.application.workspace.currentPos.x - MENU_SIZE,
      top: this.props.application.workspace.currentPos.y - MENU_SIZE,
    };

    return (
      <svg className="radial-menu" style={menuStyle}>
        {
          this.props.items.map((item, i) =>
            <RadialMenuItem
              {...item}
              key={i}
            />)
        }
        <circle cx={MENU_SIZE} cy={MENU_SIZE} r="35" />
      </svg>
    );
  }
}

export default connect(
  ({ application }) => ({ application })
)(RadialMenu);
