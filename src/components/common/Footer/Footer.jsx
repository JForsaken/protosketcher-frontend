/* Node modules */
import React, { Component } from 'react';
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
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
      showRenameModal: false,
      showDeleteModal: false,
      pageName: '',
      pageModifiedIndex: -1,
    };
  }

  onPageNameChanged(e) {
    this.setState({
      pageName: e.target.value,
    });
  }

  renamePage() {
    const pages = this.state.pages.slice();
    let pageName = this.state.pageName;
    if (pageName === '' || pageName === ' ') {
      pageName = ' - ';
    }
    pages[this.state.pageModifiedIndex] = pageName;
    this.setState({
      pages,
      pageModifiedIndex: -1,
      pageName: '',
      showRenameModal: false,
    });
  }

  removePage() {
    const pages = this.state.pages.slice();
    if (pages.length === 1) {
      // TODO Do something when only one page
      return;
    }

    pages.splice(this.state.pageModifiedIndex, 1);
    let activePage = this.state.activePage;
    if (activePage === this.state.pageModifiedIndex) {
      activePage = 0;
    }
    this.setState({
      pages,
      activePage,
      showDeleteModal: false,
      pageModifiedIndex: -1,
    });
  }

  showRenameModal(index) {
    this.setState({
      showRenameModal: true,
      pageModifiedIndex: index,
      pageName: '',
    });
  }

  showDeleteModal(index) {
    this.setState({
      showDeleteModal: true,
      pageModifiedIndex: index,
    });
  }

  closeModal() {
    this.setState({
      showRenameModal: false,
      showDeleteModal: false,
      pageModifiedIndex: -1,
    });
  }

  showAddPageMenu() {
    this.setState({
      isAddPageMenuVisible: true,
    });
  }

  hideAddPageMenu() {
    this.setState({
      isAddPageMenuVisible: false,
    });
  }

  addPage() {
    const pages = this.state.pages;
    pages.push(this.props.intl.messages['footer.newPage']);
    this.setState({
      pages,
      activePage: pages.length - 1,
      isAddPageMenuVisible: false,
    });
  }

  changePage(index) {
    if (this.state.activePage === index) {
      return;
    }
    this.setState({ activePage: index });
  }

  renderModal() {
    if (this.state.showRenameModal) {
      console.log('wejpwfjepofjwepofjpowef');
      return (
        <Modal
          dialogClassName="add-modal"
          show={this.state.showRenameModal}
          onHide={() => this.closeModal()}
        >
          <Modal.Header closeButton>
            <i className="fa fa-pencil-square" />
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="prototype-name">
              <label><FormattedMessage id="footer.renamePage" /></label>
              <FormControl
                type="text"
                onChange={(e) => this.onPageNameChanged(e)}
                placeholder={this.props.intl.messages['footer.newName']}
              />
            </FormGroup>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              disabled={!this.state.pageName}
              onClick={() => this.renamePage()}
            >
              <FormattedMessage id="save" />
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    if (this.state.showDeleteModal) {
      return (
        <Modal
          dialogClassName="add-modal"
          show={this.state.showDeleteModal}
          onHide={() => this.closeModal()}
        >
          <Modal.Header closeButton>
            <i className="fa fa-trash" />
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="prototype-name">
              <label><FormattedMessage id="footer.deletePageConfirm" /></label>
            </FormGroup>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={() => this.closeModal()}
              className="doubleButton"
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              bsStyle="warning"
              onClick={() => this.removePage()}
              className="doubleButton"
            >
              <FormattedMessage id="footer.delete" />
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    return '';
  }

  render() {
    const pages = [];
    const contextMenus = [];
    let pageIndex;
    let menuIndex;
    forEach(this.state.pages, (page, index) => {
      pageIndex = `page-${index}`;
      menuIndex = `menu-${index}`;
      const className = classNames({
        'page-tab': true,
        'page-tab--active': this.state.activePage === index,
      });

      pages.push(
        <ContextMenuTrigger key={`menuTrigger-${index}`} id={pageIndex}>
          <Button
            key={pageIndex}
            className={className}
            onDoubleClick={() => this.showRenameModal(index)}
            onClick={() => this.changePage(index)}
          >
            {page}
          </Button>
        </ContextMenuTrigger>
      );

      contextMenus.push(
        <ContextMenu key={menuIndex} id={pageIndex}>
          <MenuItem key={`rename${menuIndex}`} onClick={() => this.showRenameModal(index)}>
            {this.props.intl.messages['footer.renamePage']}
          </MenuItem>
          <MenuItem key={`remove-${menuIndex}`} onClick={() => this.showDeleteModal(index)}>
            {this.props.intl.messages['footer.deletePage']}
          </MenuItem>
        </ContextMenu>
      );
    });

    const addPageMenu = <div id="addPageMenu">Allo</div>;

    return (
      <footer id="footer">
        {this.renderModal()}
        {pages}
        <div
          id="pageAddZone"
          className={this.state.isAddPageMenuVisible ? 'menuVisible' : ''}
          onMouseOver={() => this.showAddPageMenu()}
          onMouseOut={() => this.hideAddPageMenu()}
        >
          {this.state.isAddPageMenuVisible ? addPageMenu : null}
          <Button
            className="page-tab page-tab-add"
            title={this.props.intl.messages['footer.addPage']}
            onClick={() => this.addPage()}
          >
            <i className="fa fa-plus" />
          </Button>
        </div>
        {contextMenus}
      </footer>
    );
  }
}
