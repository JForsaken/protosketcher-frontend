/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import FontAwesome from 'react-fontawesome';
import { isEmpty, find, keys, invert } from 'lodash';

// Components
import AddPageMenu from './AddPageMenu';

/* Actions */
import { createPage, patchPage, deletePage } from '../../../actions/api';
import { selectPage } from '../../../actions/application';

@injectIntl

class Footer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showRenameModal: false,
      showDeleteModal: false,
      showOnePageWarning: false,
      pageName: '',
      pageModifiedId: '',
    };

    this.changePage = this.changePage.bind(this);
    this.addPage = this.addPage.bind(this);
    this.renamePage = this.renamePage.bind(this);
  }

  onPageNameChanged(e) {
    this.setState({
      pageName: e.target.value,
    });
  }

  renamePage() {
    let pageName = this.state.pageName;
    if (pageName === '' || pageName === ' ') {
      pageName = ' - ';
    }

    this.props.actions.patchPage(this.props.application.selectedPrototype,
      this.state.pageModifiedId,
      {
        name: pageName,
      }, this.props.application.user.token);

    this.setState({
      pageModifiedId: '',
      pageName: '',
      showRenameModal: false,
    });
  }

  removePage() {
    const { selectedPrototype, selectedPage, prototypes } = this.props.application;
    const { pageModifiedId } = this.state;

    // If deleting current page, change page
    if (pageModifiedId === selectedPage) {
      const { pages } = prototypes[selectedPrototype];

      const newPageId = find(keys(pages), (pageId) => (pageId !== pageModifiedId));

      this.changePage(newPageId);
    }

    this.props.actions.deletePage(selectedPrototype,
      pageModifiedId, this.props.application.user.token);

    this.setState({
      showDeleteModal: false,
      pageModifiedId: '',
    });
  }

  showRenameModal(id) {
    this.setState({
      showRenameModal: true,
      pageModifiedId: id,
      pageName: '',
    });
  }

  showDeleteModal(id) {
    const { prototypes, selectedPrototype } = this.props.application;
    const prototype = prototypes[selectedPrototype] || {};
    const pages = prototype.pages || [];
    if (Object.keys(pages).length <= 1) {
      this.setState({
        showOnePageWarningModal: true,
        showDeleteModal: false,
      });
      return;
    }
    this.setState({
      showDeleteModal: true,
      pageModifiedId: id,
    });
  }

  closeModal() {
    this.setState({
      showRenameModal: false,
      showDeleteModal: false,
      showOnePageWarningModal: false,
      pageModifiedId: '',
    });
  }

  addPage(type) {
    this.props.actions.createPage(this.props.application.selectedPrototype,
      {
        name: this.props.intl.messages['footer.newPage'],
        pageTypeId: invert(this.props.api.getPageTypes.pageTypes)[type],
      }, this.props.application.user.token);

    this.setState({
      isAddPageMenuVisible: false,
    });
  }

  changePage(id) {
    if (this.props.application.currentPage === id) {
      return;
    }
    this.props.actions.selectPage(id);
  }

  renderRenameModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showRenameModal}
        onEntering={() => {
          this.inputName.focus();
        }}
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
                inputRef={ref => { this.inputName = ref; }}
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
    const { prototypes, selectedPrototype } = this.props.application;
    const prototype = prototypes[selectedPrototype] || {};
    const pages = prototype.pages || [];
    let { pageTypes } = this.props.api.getPageTypes || {};

    pageTypes = invert(pageTypes);

    const icons = pageTypes ? {
      [pageTypes.modal]: <FontAwesome name="window-maximize" />,
      [pageTypes.page]: <FontAwesome name="desktop" />,
    } : {};

    return (
      <footer id="footer" className={isEmpty(pages) ? 'footer-hidden' : ''}>
        <div className="container">
          {this.renderModal()}
          <div className="tabs-container">
            <div className="tabs-slider">
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
                        {icons[pages[key].pageTypeId]}
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
            </div>
          </div>
          <AddPageMenu
            addNormalPage={() => this.addPage('page')}
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
      selectPage,
      createPage,
      patchPage,
      deletePage,
    }, dispatch),
  })
)(Footer);
