/* Node modules */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Navbar, NavItem, FormGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { isEqual, forEach } from 'lodash';

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

    const { prototypes, selectedPrototype } = this.props.application;
    this.state = {
      expanded: false,
      showRenameModal: false,
      prototypeName: prototypes[selectedPrototype].name,
    };
  }

  componentDidMount() {
    if (this.inputName) {
      this.inputName.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    // LOGOUT
    if (!isEqual(this.props.application.user, nextProps.application.user) &&
      nextProps.application.user === null) {
      this.props.router.push('/landing');
      return;
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

  redirectToLanding() {
    this.props.actions.backToLanding();
  }

  toggleNav() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  changePrototypeName() {
    this.setState({ showRenameModal: true });
  }

  renamePrototype(e) {
    e.preventDefault();
    this.props.actions.patchPrototype({
      name: this.state.prototypeName,
      id: this.props.application.selectedPrototype,
    }, this.props.application.user.token);
    this.closeModal();
  }

  closeModal() {
    this.setState({
      showRenameModal: false,
    });
  }

  renderPrototypeName() {
    if (!this.state.showRenameModal) {
      return (<h2
        className="centered"
        onDoubleClick={() => this.changePrototypeName()}
        title={this.props.intl.messages['menu.dblClickRename']}
      >
        {this.state.prototypeName}
      </h2>);
    }
    return (
      <form onSubmit={(e) => this.renamePrototype(e)}>
        <FormGroup controlId="prototype-name">
          <FormControl
            type="text"
            className="centered"
            onChange={(e) => this.onPrototypeNameChanged(e)}
            onBlur={(e) => this.renamePrototype(e)}
            value={this.state.prototypeName}
            placeholder={this.props.intl.messages['menu.newName']}
            inputRef={ref => { this.inputName = ref; }}
          />
        </FormGroup>
      </form>
    );
  }

  render() {
    const { application: { locale, locales } } = this.props;
    let otherLocale = '';

    // Get other locale
    forEach(locales, (lang) => {
      if (lang !== locale) {
        otherLocale = lang;
      }
    });

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
    if (!prototypeId) {
      return false;
    }

    return (
      <Navbar inverse fixedTop expanded={expanded} onToggle={this.toggleNav}>
        <Navbar.Header>
          <Navbar.Brand>
            <Link className="brand__title" to="/landing" onClick={() => this.redirectToLanding()}>
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
          {this.renderPrototypeName()}
          <Nav pullRight>
            <NavItem onClick={this.handleSwitchLocale}>
              {otherLocale.toUpperCase()}
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
