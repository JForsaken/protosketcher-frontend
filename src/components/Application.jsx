import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import DisplayError from './common/DisplayErrors/DisplayError';
import { FormattedMessage } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
      <MuiThemeProvider>
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
      </MuiThemeProvider>
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
