/* Node modules */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import forEach from 'lodash/forEach';
@injectIntl

export default class Footer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pages: ['Page 1', 'Page 2'],
    };
  }

  render() {
    const pages = [];
    forEach(this.state.pages, (page, index) => {
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
