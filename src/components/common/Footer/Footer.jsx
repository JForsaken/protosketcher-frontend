/* Node modules */
import React, { Component } from 'react';
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import forEach from 'lodash/forEach';
import classNames from 'classnames';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import AddPageMenu from './AddPageMenu';
@injectIntl

export default class Footer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pages: [{
        id: 0,
        name: 'Page 1',
        type: 'normal',
      }, {
        id: 1,
        name: 'Page 2',
        type: 'modal',
      }],
      activePage: 0,
      showRenameModal: false,
      showDeleteModal: false,
      showOnePageWarning: false,
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
    pages[this.state.pageModifiedIndex].name = pageName;
    this.setState({
      pages,
      pageModifiedIndex: -1,
      pageName: '',
      showRenameModal: false,
    });
  }

  removePage() {
    const pages = this.state.pages.slice();

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
    if (this.state.pages.length <= 1) {
      this.setState({
        showOnePageWarningModal: true,
        showDeleteModal: false,
      });
      return;
    }
    this.setState({
      showDeleteModal: true,
      pageModifiedIndex: index,
    });
  }

  closeModal() {
    this.setState({
      showRenameModal: false,
      showDeleteModal: false,
      showOnePageWarningModal: false,
      pageModifiedIndex: -1,
    });
  }

  addPage(type) {
    const pages = this.state.pages;
    pages.push({
      id: pages.length,
      name: this.props.intl.messages['footer.newPage'],
      type,
    });
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
    if (this.state.showOnePageWarningModal) {
      return (
        <Modal
          dialogClassName="add-modal"
          show={this.state.showOnePageWarningModal}
          onHide={() => this.closeModal()}
        >
          <Modal.Header closeButton>
            <i className="fa fa-exclamation-triangle" />
          </Modal.Header>
          <Modal.Body>
            <h4><FormattedMessage id="footer.moreThanOnePage" /></h4>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={() => this.closeModal()}
            >
              <FormattedMessage id="OK" />
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
    const icons = {
      modal: <i className="fa fa-window-maximize" />,
      normal: <i className="fa fa-television" />,
    }

    forEach(this.state.pages, (page) => {
      pageIndex = `page-${page.id}`;
      menuIndex = `menu-${page.id}`;
      const className = classNames({
        'page-tab': true,
        'page-tab--active': this.state.activePage === page.id,
      });

      pages.push(
        <ContextMenuTrigger id={pageIndex} key={`trigger${page.id}`}>
          <Button
            key={pageIndex}
            className={className}
            onDoubleClick={() => this.showRenameModal(page.id)}
            onClick={() => this.changePage(page.id)}
          >
            {page.name}
            {icons[page.type]}
          </Button>
        </ContextMenuTrigger>
      );

      contextMenus.push(
        <ContextMenu key={menuIndex} id={pageIndex}>
          <MenuItem key={`rename${menuIndex}`} onClick={() => this.showRenameModal(page.id)}>
            {this.props.intl.messages['footer.renamePage']}
          </MenuItem>
          <MenuItem key={`remove-${menuIndex}`} onClick={() => this.showDeleteModal(page.id)}>
            {this.props.intl.messages['footer.deletePage']}
          </MenuItem>
        </ContextMenu>
      );
    });

    return (
      <footer id="footer">
        <div className="container">
          {this.renderModal()}
          {pages}
          <AddPageMenu
            addNormalPage={() => this.addPage('normal')}
            addModalPage={() => this.addPage('modal')}
          />
          {contextMenus}
        </div>
      </footer>
    );
  }
}
