/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class Footer extends Component {
  render() {
    return (
      <div>
        <FormattedMessage id="footer.title" />
      </div>
    );
  }
}
