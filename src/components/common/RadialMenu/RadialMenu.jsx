/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import RadialMenuItem from './RadialMenuItem/RadialMenuItem';

/* Actions */


const menuItems = [
  {
  },
];

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
      <div className="radial-menu" style={menuStyle}>
        <svg>
          <circle cx="100" cy="100" r="25" />
        </svg>
        <div>
        {
          menuItems.map((item, i) =>
            <RadialMenuItem
              {...item}
              key={i}
                /* Constants */
              // import onClick={this.state.expanded ? this.toggleNav : null}
            />)
        }
        </div>
      </div>
    );
  }
}

export default connect(
  ({ application }) => ({ application })
)(RadialMenu);
