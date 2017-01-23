import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import Menu from './common/Menu/Menu';
import Footer from './common/Footer/Footer';
import DisplayError from './common/DisplayErrors/DisplayError';

/* Constants */
import { FETCH_ME } from '../actions/constants';

class Application extends Component {
  static propTypes = {
    children: PropTypes.any,
  };

  constructor(props, context) {
    super(props, context);

    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.state = {
      isMenuActive: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { login } = nextProps.api;

    // Redirect to the login page if the /me call failed (invalid or expired token)
    if (!isEqual(this.props.api.login, login)
        && login.lastAction === FETCH_ME) {
      if (!login.user.id) {
        this.redirectToLoginPage();
      }
    }
  }

  redirectToLoginPage() {
    const { history, location } = this.props;
    let nextPath = '/login';

    if (location.state && location.state.nextPathname) {
      nextPath = location.state.nextPathname;
    }

    history.pushState({}, nextPath);
  }

  handleMenuClick(evt) {
    evt.preventDefault();
    this.setState({ isMenuActive: !this.state.isMenuActive });
  }

  render() {
    const { isMenuActive } = this.state;
    const activeClass = isMenuActive ? 'active' : '';

    return (
      <div id="layout" className={activeClass}>
        <a
          href="#menu" id="menuLink"
          className={classnames('menu-link', activeClass)}
          onClick={this.handleMenuClick}
        >
          <span></span>
        </a>

        <Menu activeClass={activeClass} />

        <div id="main">
          <DisplayError />

          {!this.props.api.login.user.id && this.props.router.location.pathname === '/'
           // TODO: replace with with loading or spinner or whatever
           ? <p>LOADING FETCH ME</p>
           : null
          }

          {/* this will render the child routes */}
          {this.props.children}
        </div>

        <Footer />
      </div>
    );
  }
}

export default (connect(
  ({ api, router }) => ({ api, router }),
  )(Application));

