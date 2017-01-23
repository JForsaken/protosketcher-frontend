/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <FormattedMessage id="footer.title" />
      </footer>
    );
  }
}
