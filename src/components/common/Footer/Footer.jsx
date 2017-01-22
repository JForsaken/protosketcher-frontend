/* Node modules */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';


export default class Footer extends Component {
  render() {
    // TODO: fix the addPage message to render properly
    return (
      <footer>
        <Button className="page-tab active"><FormattedMessage id="footer.page" /> 1</Button>
        <Button className="page-tab active"><FormattedMessage id="footer.page" /> 2</Button>
        <Button className="page-tab page-tab-add" title={<FormattedMessage id="footer.addPage" />}>
          <i className="fa fa-plus" aria-hidden="true"> </i>
        </Button>
      </footer>
    );
  }
}
