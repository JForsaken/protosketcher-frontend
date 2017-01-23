/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

/* Components */
import RadialMenuItem from './RadialMenuItem/RadialMenuItem';

/* Actions */


const menuItems = [
  {
    text: <FormattedMessage id="menu.randomTab" />,
    link: '/',
    icon: 'fa fa-dot-circle-o',
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
      height: 200,
      left: this.props.application.menu.pageX - 100,
      position: 'absolute',
      top: this.props.application.menu.pageY - 100,
      width: 200,
    };

    return (
      <div style={menuStyle}>
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
  ({ application }) => ({ application }),
  null
)(RadialMenu);
