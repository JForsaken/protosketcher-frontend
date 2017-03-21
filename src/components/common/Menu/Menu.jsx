/* Node modules */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Navbar, NavItem, FormGroup } from 'react-bootstrap';
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

  componentWillReceiveProps(nextProps) {
    // LOGOUT
    if (!isEqual(this.props.application.user, nextProps.application.user) &&
      nextProps.application.user === null) {
      this.props.router.push('/landing');
    }

    if (!isEqual(this.props.application.prototypes, nextProps.application.propTypes) &&
        nextProps.application.selectedPrototype) {
      const { prototypes, selectedPrototype } = nextProps.application;
      this.setState({ prototypeName: prototypes[selectedPrototype].name });
    }
  }

  componentDidUpdate() {
    if (this.inputName) {
      this.inputName.focus();
    }
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
    this.props.actions.redirectToDashboard();
  }

  toggleSimulation() {
    // deselect shapes if some are selected
    this.props.actions.updateWorkspace({
      selectedItems: [],
    });
    this.props.actions.toggleSimulation();
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
    this.props.actions.patchPrototype({
      name: this.inputName.value,
      id: this.props.application.selectedPrototype,
    }, this.props.application.user.token);

    e.preventDefault();
    this.closeModal();
  }

  closeModal() {
    this.setState({
      showRenameModal: false,
    });
  }

  renderPrototypeName() {
    if (!this.state.showRenameModal) {
      return (
        <h2
          className="centered"
          onDoubleClick={() => this.changePrototypeName()}
          title={this.props.intl.messages['menu.dblClickRename']}
        >
          {this.state.prototypeName}
        </h2>
      );
    }

    return (
      <form onSubmit={(e) => this.renamePrototype(e)} className="centered">
        <FormGroup controlId="prototype-name">
          <input
            type="text"
            onBlur={(e) => this.renamePrototype(e)}
            defaultValue={this.state.prototypeName}
            placeholder={this.props.intl.messages['menu.newName']}
            ref={ref => { this.inputName = ref; }}
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
        link: '',
        icon: 'list-alt',
        onClick: () => this.redirectToDashboard(),
      },
      {
        text: <FormattedMessage id="menu.simulation" />,
        link: '',
        icon: 'eye',
        onClick: () => this.toggleSimulation(),
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
                  onClick={this.state.expanded ? this.toggleNav : null}
                />)
            }
          </Nav>
          {this.renderPrototypeName()}
          <Nav pullRight>
            <NavItem
              onClick={() => {
                this.handleSwitchLocale();
                if (this.state.expanded) {
                  this.toggleNav();
                }
              }}
            >
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
