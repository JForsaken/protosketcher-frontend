/* Node modules */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

/* Components */
import MenuListItem from '../MenuListItem/MenuListItem';

/* Actions */
import * as applicationActions from '../../../actions/application';


const menuItems = [
  {
    text: <FormattedMessage id="menu.backToPrototypes" />,
    link: '/',
    icon: 'fa fa-list-alt',
  },
  {
    text: <FormattedMessage id="menu.save" />,
    link: '/',
    icon: 'fa fa-floppy-o',
  },
];

@injectIntl
class Menu extends Component {

  static propTypes = {
    actions: PropTypes.object,
    application: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleSwitchLocale = this.handleSwitchLocale.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.state = { expanded: false };
  }

  handleSwitchLocale() {
    const { application: { locales, locale } } = this.props;

    const langIndex = locales.indexOf(locale);
    const nextLocale = langIndex + 1 < locales.length ? langIndex + 1 : 0;

    this.props.actions.switchLocale(locales[nextLocale]);
  }

  toggleNav() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { application: { locale } } = this.props;
    const { expanded } = this.state;

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
                  import onClick={this.state.expanded ? this.toggleNav : null}
                />)
            }
          </Nav>
          <Nav pullRight>
            <NavItem onClick={this.handleSwitchLocale}>
              {locale.toUpperCase()}
            </NavItem>
            <NavItem title={this.props.intl.messages['menu.logout']}>
              <i className="fa fa-sign-out" />
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
