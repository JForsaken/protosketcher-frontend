/* Node modules */
import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';

/* Components */
import MenuListItem from '../../common/MenuListItem/MenuListItem';

@injectIntl
export default class LandingMenu extends Component {
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

  render() {
    const { expanded } = this.state;
    const menuItemsLeft = [
      {
        text: 'Allo',
        link: '/',
        icon: 'list-alt',
      },
    ];

    const menuItemsRight = [
      {
        text: 'Login',
        link: '/',
        icon: 'sign-in',
      },
      {
        text: 'Use for Free',
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
