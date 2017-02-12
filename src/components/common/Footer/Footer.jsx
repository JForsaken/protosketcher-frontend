/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import FontAwesome from 'react-fontawesome';
import { isEmpty } from 'lodash';

// Components
import AddPageMenu from './AddPageMenu';

/* Actions */
import { getPage } from '../../../actions/api';
import { updateWorkspace } from '../../../actions/application';

@injectIntl

class Footer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showRenameModal: false,
      showDeleteModal: false,
      showOnePageWarning: false,
      pageName: '',
      pageModifiedIndex: -1,
    };

    this.changePage = this.changePage.bind(this);
  }

  onPageNameChanged(e) {
    this.setState({
      pageName: e.target.value,
    });
  }

  renamePage() {
    // TODO Patch page on backend
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
    // TODO Delete page on backend
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
    // TODO add page on backend
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

  changePage(id) {
    if (this.props.application.currentPage === id) {
      return;
    }
  }

  renderRenameModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showRenameModal}
        onHide={() => this.closeModal()}
      >
        <form onSubmit={() => this.renamePage()}>
          <Modal.Header closeButton>
            <FontAwesome name="pencil-square" />
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
        </form>
      </Modal>
    );
  }

  renderDeleteModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showDeleteModal}
        onHide={() => this.closeModal()}
      >
        <Modal.Header closeButton>
          <FontAwesome name="trash" />
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

  renderOnePageWarningModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showOnePageWarningModal}
        onHide={() => this.closeModal()}
      >
        <Modal.Header closeButton>
          <FontAwesome name="exclamation-triangle" />
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

  renderModal() {
    if (this.state.showRenameModal) {
      return this.renderRenameModal();
    }
    if (this.state.showDeleteModal) {
      return this.renderDeleteModal();
    }
    if (this.state.showOnePageWarningModal) {
      return this.renderOnePageWarningModal();
    }
    return '';
  }

  render() {
    const pages = this.props.pages;
    const icons = {
      modal: <FontAwesome name="window-maximize" />,
      normal: <FontAwesome name="desktop" />,
    };

    return (
      <footer id="footer" className={isEmpty(pages) ? 'footer-hidden' : ''}>
        <div className="container">
          {this.renderModal()}
          {
            Object.keys(pages).map((key, index) =>
              <div key={index}>
                <ContextMenuTrigger id={`page-${key}`} key={`trigger${key}`}>
                  <Button
                    key={`page-${key}`}
                    className={classNames({
                      'page-tab': true,
                      'page-tab--active': this.props.selectedPage === key,
                    })}
                    onDoubleClick={() => this.showRenameModal(key)}
                    onClick={() => this.changePage(key)}
                  >
                    {pages[key].name}
                    {icons[pages[key].type]}
                  </Button>
                </ContextMenuTrigger>

                <ContextMenu key={`menu-${key}`} id={`page-${key}`}>
                  <MenuItem key={`rename-${key}`} onClick={() => this.showRenameModal(key)}>
                    {this.props.intl.messages['footer.renamePage']}
                  </MenuItem>
                  <MenuItem key={`remove-${key}`} onClick={() => this.showDeleteModal(key)}>
                    {this.props.intl.messages['footer.deletePage']}
                  </MenuItem>
                </ContextMenu>
              </div>)
          }
          <AddPageMenu
            addNormalPage={() => this.addPage('normal')}
            addModalPage={() => this.addPage('modal')}
          />
        </div>
      </footer>
    );
  }
}

export default connect(
  ({ application, api }) => ({ application, api }),
  dispatch => ({
    actions: bindActionCreators({
      updateWorkspace,
      getPage,
    }, dispatch),
  })
)(Footer);
