/* global __DEVTOOLS__ */
import React, { PropTypes, Component } from 'react';
import { StyleRoot } from 'radium';
import { Route } from 'react-router';
import DevTools from './components/common/DevTools/DevTools';
import { ReduxRouter } from 'redux-router';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { isEmpty } from 'lodash';
import configureStore from './utils/configure-store';
import * as storage from './persistence/storage';
import * as components from './components';
import * as constants from './actions/constants';
import * as i18n from './i18n';

const {
  Application,
  HomePage,
  LoginPage,
} = components;

const initialState = {
  application: {
    token: storage.get('token'),
    locale: storage.get('locale') || 'en',
    locales: [
      'en',
      'fr',
    ],
    user: { permissions: [/* 'manage_account'*/] },
  },
};

export const store = configureStore(initialState);

function logout(nextState, replaceState) {
  store.dispatch({ type: constants.LOGOUT });
  replaceState({}, '/login');
}

function requireAuth(nextState, replaceState) {
  const state = store.getState();
  const isLoggedIn = !isEmpty(state.api.login.user);
  if (!isLoggedIn) {
    replaceState({
      nextPathname: nextState.location.pathname,
    }, '/login');
  }
}

function renderRoutes() {
  return (
    <ReduxRouter>
      <Route component={Application}>
        <Route path="/" component={HomePage} onEnter={requireAuth} />
        <Route path="login" component={LoginPage} />
        <Route path="logout" onEnter={logout} />
      </Route>
    </ReduxRouter>
  );
}

function getRootChildren(props) {
  const intlData = {
    locale: props.application.locale,
    messages: i18n[props.application.locale],
  };
  const rootChildren = [
    <IntlProvider key="intl" {...intlData}>
      <StyleRoot>
        {renderRoutes()}
      </StyleRoot>
    </IntlProvider>,
  ];

  if (__DEVTOOLS__) {
    rootChildren.push(<DevTools key="devtools" />);
  }
  return rootChildren;
}

class Root extends Component {
  render() {
    return (
      <div>{getRootChildren(this.props)}</div>
    );
  }
}

Root.propTypes = {
  application: PropTypes.object.isRequired,
};

export default connect(({ application }) => ({ application }))(Root);
