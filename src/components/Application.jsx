import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import DisplayError from './common/DisplayErrors/DisplayError';
import { FormattedMessage } from 'react-intl';

/* Constants */
import { FETCH_ME } from '../actions/constants';

class Application extends Component {
  static propTypes = {
    children: PropTypes.any,
  };

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

  render() {
    const { user } = this.props.api.login;
    return (
      <div id="layout">
        <div id="main">
          <DisplayError />

          {user && !user.id && this.props.location.pathname === '/' ?
            <div>
              <div className="backdrop"></div>
              <div className="loading">
                <FormattedMessage id="website.userInfo" />
                <div className="spinner" />
              </div>
            </div>
           : null
          }

          {/* this will render the child routes */}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default (connect(
  ({ api, router }) => ({ api, router }),
  )(Application));
