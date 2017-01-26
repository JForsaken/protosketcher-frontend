/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */

/* Actions */


class RadialMenuItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: false,
      selectedIndex: -1,
    };
  }

  render() {
    return (
      <div>
        <span>Item</span>
      </div>
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(RadialMenuItem);
