/* Node modules */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Navbar, NavItem, FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { isEqual } from 'lodash';

/* Components */
import MenuListItem from '../MenuListItem/MenuListItem';

/* Actions */
import * as applicationActions from '../../../actions/application';
import * as apiActions from '../../../actions/api';


@injectIntl
class Menu extends Component {
  static propTypes = {
    actions: PropTypes.object,
    application: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleSwitchLocale = this.handleSwitchLocale.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.state = {
      expanded: false,
      showRenameModal: false,
      prototypeName: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // LOGOUT
    if (!isEqual(this.props.application.user, nextProps.application.user) &&
      nextProps.application.user == null) {
      this.props.router.push('/login');
    }
  }

  onPrototypeNameChanged(e) {
    this.setState({
      prototypeName: e.target.value,
    });
  }

  handleSwitchLocale() {
    const { application: { locales, locale } } = this.props;

    const langIndex = locales.indexOf(locale);
    const nextLocale = langIndex + 1 < locales.length ? langIndex + 1 : 0;

    this.props.actions.switchLocale(locales[nextLocale]);
  }

  logout() {
    this.props.actions.logout();
  }

  redirectToDashboard() {
    this.props.actions.backToDashboard();
  }

  toggleNav() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  changePrototypeName() {
    this.setState({ showRenameModal: true });
  }

  renamePrototype() {
    this.props.actions.patchPrototype({
      name: this.state.prototypeName,
      id: this.props.application.selectedPrototype,
    }, this.props.application.user.token);
    this.closeModal();
  }

  closeModal() {
    this.setState({
      showRenameModal: false,
      prototypeName: '',
    });
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
              <label><FormattedMessage id="menu.renamePrototype" /></label>
              <FormControl
                type="text"
                onChange={(e) => this.onPrototypeNameChanged(e)}
                placeholder={this.props.intl.messages['menu.newName']}
              />
            </FormGroup>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              disabled={!this.state.prototypeName}
              onClick={() => this.renamePrototype()}
            >
              <FormattedMessage id="save" />
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

  render() {
    const { application: { locale } } = this.props;
    const { expanded } = this.state;
    const menuItems = [
      {
        text: <FormattedMessage id="menu.backToPrototypes" />,
        link: '/',
        icon: 'list-alt',
        onClick: () => this.redirectToDashboard(),
      },
    ];
    const prototypeId = this.props.application.selectedPrototype;
    const prototypeName = this.props.application.prototypes[prototypeId].name;

    return (
      <Navbar inverse fixedTop expanded={expanded} onToggle={this.toggleNav}>
        {this.renderRenameModal()}
        <Navbar.Header>
          <Navbar.Brand>
            <Link className="brand__title" to="/">
              <div className="brand__logo" />
              <div className="brand__spacer" />
              <FormattedMessage id="website.title" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {
              menuItems.map((item, i) =>
                <MenuListItem
                  {...item}
                  key={i}
                  /* Constants */
                  // TODO check why this is there
                  // import onClick={this.state.expanded ? this.toggleNav : null}
                />)
            }
          </Nav>
          <h2 className="centered" onDoubleClick={() => this.changePrototypeName()}>
            {prototypeName}
          </h2>
          <Nav pullRight>
            <NavItem onClick={this.handleSwitchLocale}>
              {locale.toUpperCase()}
            </NavItem>
            <NavItem
              title={this.props.intl.messages['menu.logout']}
              onClick={() => this.logout()}
            >
              <FontAwesome name="sign-out" />
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default connect(
  ({ api, application }) => ({ api, application }),
  dispatch => ({
    actions: bindActionCreators({
      ...applicationActions,
      ...apiActions,
    }, dispatch),
  })
)(Menu);
