/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class CuteText extends Component {
  render() {
    return (
      <div>
        <h1 className="parallax-white-text">
          <FormattedMessage id={this.props.text} />
        </h1>
      </div>
    );
  }
}
