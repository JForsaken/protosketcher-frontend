/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class CuteText extends Component {
  render() {
    return (
      <div>
        <h1 className="parallax-text" style={{ color: this.props.color }}>
          <FormattedMessage id={this.props.text} />
        </h1>
      </div>
    );
  }
}

CuteText.defaultProps = {
  color: 'black',
};
