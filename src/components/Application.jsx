import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import DisplayError from './common/DisplayErrors/DisplayError';

/* Actions */
import { logout } from '../actions/application';

/* Constants */
import { FETCH_ME } from '../actions/constants';

class Application extends Component {
  static propTypes = {
    children: PropTypes.any,
    router: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { login } = nextProps.api;

    // Redirect to the login page if the /me call failed (invalid or expired token)
    if (!isEqual(this.props.api.login, login)
        && login.lastAction === FETCH_ME) {
      if (!login.user.id) {
        this.redirectToLoginPage();
      }
    } else if (!isEqual(this.props.api.lastCallError, nextProps.api.lastCallError) &&
               !isEmpty(nextProps.api.lastCallError) &&
               nextProps.api.lastCallError.code === 403) {
      this.props.actions.logout();
    }
  }

  redirectToLoginPage() {
    this.props.router.push('/login');
  }

  render() {
    const { user } = this.props.api.login;
    return (
      <div id="layout">
        <div id="main">
          <DisplayError />

          {user && !user.id && this.props.location.pathname === '/'
           // TODO: replace with with loading or spinner or whatever
           ? <p>LOADING FETCH ME</p>
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
  ({ api }) => ({ api }),
  dispatch => ({
    actions: bindActionCreators({
      logout,
    }, dispatch),
  })
  )(Application));
