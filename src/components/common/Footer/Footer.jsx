/* Node modules */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import forEach from 'lodash/forEach';
@injectIntl

export default class Footer extends Component {
  render() {
    const pages = [];
    forEach(this.props.pages, (page, index) => {
      pages.push(<Button key={index} className="page-tab active">{page}</Button>);
    });
    return (
      <footer>
        {pages}
        <Button
          className="page-tab page-tab-add"
          title={this.props.intl.messages['footer.addPage']}
        >
          <i className="fa fa-plus" aria-hidden="true"> </i>
        </Button>
      </footer>
    );
  }
}
