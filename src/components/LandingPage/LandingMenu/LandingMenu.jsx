/* Node modules */
import React, { Component, PropTypes } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { forEach } from 'lodash';

/* Components */
import MenuListItem from '../../common/MenuListItem/MenuListItem';

/* Actions */
import * as applicationActions from '../../../actions/application';

/* CONSTANTS */
import { TOP_MENU_HEIGHT } from '../../constants';

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

  logout() {
    this.props.actions.logout();
  }

  scrollToElement(elementName) {
    const scroller = Scroll.scroller;
    const padding = 20;
    scroller.scrollTo(elementName, {
      duration: 250,
      delay: 0,
      smooth: true,
      offset: - (TOP_MENU_HEIGHT + padding),
    });
  }

  render() {
    const { expanded } = this.state;
    const { locale, locales, user } = this.props.application;
    let otherLocale;

    // Get other locale
    forEach(locales, (lang) => {
      if (lang !== locale) {
        otherLocale = lang;
      }
    });

    const menuItemsLeft = [
      {
        text: <FormattedMessage id="landing.features" />,
        link: '',
        icon: 'list',
        onClick: () => this.scrollToElement('features'),
      },
    ];

    const menuItemsRight = [
      {
        text: otherLocale.toUpperCase(),
        link: '',
        onClick: () => this.handleSwitchLocale(),
      },
    ];

    // Check if logged in to put Login button or Go to prototypes
    if (user) {
      menuItemsRight.push(
        {
          text: <FormattedMessage id="menu.logout" />,
          link: '',
          icon: 'sign-out',
          onClick: () => this.logout(),
        },
        {
          text: <FormattedMessage id="landing.goToPrototypes" />,
          link: '/',
          icon: 'list-alt',
          className: 'accent-btn',
        },
      );
    } else {
      menuItemsRight.push(
        {
          text: <FormattedMessage id="login.form.context" />,
          link: '/login',
          icon: 'sign-in',
        },
        {
          text: <FormattedMessage id="landing.useForFree" />,
          link: '/login',
          icon: 'hand-o-right',
          className: 'accent-btn',
        },
      );
    }

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
