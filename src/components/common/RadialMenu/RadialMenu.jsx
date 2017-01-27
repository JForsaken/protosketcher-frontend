/**
 * Displays a radial menu with specified items
 *
 * Props :
 *
 * items: Array of objects containig props for each RadialMenuItem
 */

/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenuItem from './RadialMenuItem/RadialMenuItem';

/* Actions */

class RadialMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedIndex: -1,
    };
  }

  render() {
    const menuStyle = {
      left: this.props.application.menu.pageX - 100,
      top: this.props.application.menu.pageY - 150,
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
        <circle cx="100" cy="100" r="35" />
      </svg>
    );
  }
}

export default connect(
  ({ application }) => ({ application })
)(RadialMenu);
