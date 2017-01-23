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
      opened: false,
      selectedIndex: -1,
    };
  }

  render() {
    const { opened } = this.state.opened;

    return (
      <div>
        <span>Opened : {opened} </span>
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
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(RadialMenu);
