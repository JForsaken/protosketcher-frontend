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
      activePage: 0,
    };
  }

  changePage(index) {
    if (this.state.activePage === index) {
      return;
    }
    this.setState({ activePage: index });
  }

  render() {
    const pages = [];
    let className;
    forEach(this.state.pages, (page, index) => {
      className = 'page-tab';
      if (this.state.activePage === index) {
        className += ' active';
      }
      pages.push(
        <Button key={index} className={className} onClick={() => this.changePage(index)}>
          {page}
        </Button>
      );
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
