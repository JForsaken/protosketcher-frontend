/* Node modules */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import forEach from 'lodash/forEach';
import classNames from 'classnames';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Popup from 'react-popup';
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

  renamePage(index) {
    const newPages = this.state.pages.slice();

    // Show popup to set new name
    Popup.prompt(
      this.props.intl.messages['footer.renamePage'],
      this.props.intl.messages['footer.newName'],
      {
        placeholder: newPages[index],
        type: 'text',
      },
      {
        text: 'Ok',
        className: 'success',
        action: (Box) => {
          // Button pressed, rename the page
          newPages[index] = Box.value;
          this.setState({
            pages: newPages,
          });
          Box.close();
        },
      }
    );
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
          <MenuItem key={`rename-, ${menuIndex}!`} onClick={() => this.renamePage(index)}>
            {this.props.intl.messages['footer.renamePage']}
          </MenuItem>
          <MenuItem key={`remove-, ${menuIndex}!`}>
            {this.props.intl.messages['footer.deletePage']}
          </MenuItem>
        </ContextMenu>
      );
    });
    return (
      <footer id="footer">
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
