/* Node modules */
import React, { Component, PropTypes } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* Components */
import MenuListItem from '../../common/MenuListItem/MenuListItem';

/* Actions */
import * as applicationActions from '../../../actions/application';

@injectIntl
class LandingMenu extends Component {
  static propTypes = {
    application: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: false,
    };
  }

  toggleNav() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  handleSwitchLocale() {
    const { application: { locales, locale } } = this.props;

    const langIndex = locales.indexOf(locale);
    const nextLocale = langIndex + 1 < locales.length ? langIndex + 1 : 0;

    this.props.actions.switchLocale(locales[nextLocale]);
  }

  render() {
    const { expanded } = this.state;
    const locale = this.props.application.locale;
    const menuItemsLeft = [
      {
        text: <FormattedMessage id="landing.features" />,
        link: '/',
        icon: 'list',
      },
    ];

    const menuItemsRight = [
      {
        text: locale.toUpperCase(),
        link: '/',
        onClick: () => this.handleSwitchLocale(),
      },
      {
        text: <FormattedMessage id="login.form.context" />,
        link: '/',
        icon: 'sign-in',
      },
      {
        text: <FormattedMessage id="landing.useForFree" />,
        link: '/',
        icon: 'hand-o-right',
        className: 'use-for-free-btn',
      },
    ];

    return (
      <Navbar inverse fixedTop expanded={expanded} onToggle={() => this.toggleNav()}>
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
              menuItemsLeft.map((item, i) =>
                <MenuListItem
                  {...item}
                  key={i}
                />)
            }
          </Nav>
          <Nav pullRight>
            {
              menuItemsRight.map((item, i) =>
                <MenuListItem
                  {...item}
                  key={i}
                />)
            }
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
)(LandingMenu);
