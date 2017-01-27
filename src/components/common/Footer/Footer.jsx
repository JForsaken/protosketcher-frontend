/* Node modules */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import forEach from 'lodash/forEach';
import classNames from 'classnames';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
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

  addPage() {
    const newPages = this.state.pages;
    newPages.push(this.props.intl.messages['footer.newPage']);
    this.setState({
      pages: newPages,
      activePage: newPages.length - 1,
    });
  }

  render() {
    const pages = [];
    const contextMenus = [];
    let pageIndex;
    let menuIndex;
    forEach(this.state.pages, (page, index) => {
      pageIndex = `page-, ${index}!`;
      menuIndex = `menu-, ${index}!`;
      const className = classNames({
        'page-tab': true,
        'page-tab--active': this.state.activePage === index,
      });

      pages.push(
        <ContextMenuTrigger id={pageIndex}>
          <Button key={pageIndex} className={className} onClick={() => this.changePage(index)}>
            {page}
          </Button>
        </ContextMenuTrigger>
      );

      contextMenus.push(
        <ContextMenu key={menuIndex} id={pageIndex}>
          <MenuItem>
            ContextMenu Item 1
          </MenuItem>
        </ContextMenu>
      );
    });
    return (
      <footer>
        {pages}
        <Button
          className="page-tab page-tab-add"
          title={this.props.intl.messages['footer.addPage']}
          onClick={() => this.addPage()}
        >
          <i className="fa fa-plus" aria-hidden="true"> </i>
        </Button>
        {contextMenus}
      </footer>
    );
  }
}
