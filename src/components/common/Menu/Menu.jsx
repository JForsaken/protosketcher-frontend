/* Node modules */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { isEqual } from 'lodash';

/* Components */
import MenuListItem from '../MenuListItem/MenuListItem';

/* Actions */
import * as applicationActions from '../../../actions/application';


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
    this.state = { expanded: false };
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props.application.user, nextProps.application.user) &&
      nextProps.application.user == null) {
      this.props.router.push('/login');
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

  toggleNav() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  save() {
    // TODO add api call to save
  }

  render() {
    const { application: { locale } } = this.props;
    const { expanded } = this.state;
    const menuItems = [
      {
        text: <FormattedMessage id="menu.backToPrototypes" />,
        link: '/',
        icon: 'list-alt',
      },
      {
        text: <FormattedMessage id="menu.save" />,
        link: '/',
        onClick: this.save,
        icon: 'floppy-o',
      },
    ];

    return (
      <Navbar inverse fixedTop expanded={expanded} onToggle={this.toggleNav}>
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
  ({ application }) => ({ application }),
  dispatch => ({
    actions: bindActionCreators({
      ...applicationActions,
    }, dispatch),
  })
)(Menu);
