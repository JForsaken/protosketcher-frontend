/* global __DEVTOOLS__ */
import React, { PropTypes, Component } from 'react';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import DevTools from './components/common/DevTools/DevTools';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from './utils/configure-store';

import { bindActionCreators } from 'redux';

import { fetchMe } from './actions/api.js';


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
    locale: storage.get('locale') || 'en',
    locales: [
      'en',
      'fr',
    ],
  },
};

export const store = configureStore(initialState);

function logout(nextState, replaceState) {
  store.dispatch({ type: constants.LOGOUT });
  replaceState('/login');
}

const requireAuth = (props) => (nextState, replaceState) => {
  const token = storage.get('token');
  if (token) {
    props.actions.fetchMe(token);
  } else {
    replaceState('/login');
  }
};

function renderRoutes(props) {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={Application}>
        <IndexRoute component={HomePage} onEnter={requireAuth(props)} />
        <Route path="login" component={LoginPage} />
        <Route path="logout" onEnter={logout} />
      </Route>
    </Router>
  );
}

function getRootChildren(props) {
  const intlData = {
    locale: props.application.locale,
    messages: i18n[props.application.locale],
  };
  const rootChildren = [
    <IntlProvider key="intl" {...intlData}>
      {renderRoutes(props)}
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

export default (connect(
  ({ application }) => ({ application }),
  dispatch => ({
    actions: bindActionCreators({
      fetchMe,
    }, dispatch),
  })
)(Root));
