/* global __DEVTOOLS__ */
import React, { PropTypes, Component } from 'react';
import { isEqual, isEmpty } from 'lodash';
import { IndexRoute, Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import DevTools from './components/common/DevTools/DevTools';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from './utils/configure-store';
import { bindActionCreators } from 'redux';

/* Components */
import * as components from './components';
const {
  Application,
  HomePage,
  LoginPage,
  LandingPage,
} = components;

/* Actions */
import { fetchMe, getPrototypes } from './actions/api';
import { selectPrototype } from './actions/application';

/* Utils */
import * as storage from './persistence/storage';

/* Constants */
import * as constants from './actions/constants';
import * as i18n from './i18n';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: true });

export const store = configureStore({});

class Root extends Component {
  static propTypes = {
    application: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // Route authentication middleware
    this.requireAuth = (myProps) => (nextState, replaceState) => {
      const token = storage.get('token');
      const selectedPrototype = storage.get('selectedPrototype');

      if (token) {
        myProps.actions.fetchMe(token);

        // get last prototype used in session
        if (selectedPrototype) {
          myProps.actions.selectPrototype(selectedPrototype);
        }
      } else {
        replaceState('/login');
      }
    };

    // Route definitions
    this.routes = (
      <Route path="/" component={Application}>
        <IndexRoute component={HomePage} onEnter={this.requireAuth(this.props)} />
        <Route path="login" component={LoginPage} />
        <Route path="landing" component={LandingPage} />
      </Route>
    );
  }

  componentWillReceiveProps(nextProps) {
    const { login } = nextProps.api;

    if (!isEqual(this.props.api.login.user, login.user)
        && login.lastAction === constants.FETCH_ME) {
      // if the login has no errors
      if (isEmpty(login.error)) {
        this.props.actions.getPrototypes(storage.get('token'));
      }
    }
  }

  getRootChildren(props) {
    const intlData = {
      locale: props.application.locale,
      messages: i18n[props.application.locale],
    };
    const rootChildren = [
      <IntlProvider key="intl" {...intlData}>
        {this.renderRoutes(props)}
      </IntlProvider>,
    ];

    if (__DEVTOOLS__) {
      rootChildren.push(<DevTools key="devtools" />);
    }
    return rootChildren;
  }

  renderRoutes() {
    return (
      <Router history={appHistory}>
        {this.routes}
      </Router>
    );
  }

  render() {
    return (
      <div>{this.getRootChildren(this.props)}</div>
    );
  }
}

export default (connect(
  ({ application, api }) => ({ application, api }),
  dispatch => ({
    actions: bindActionCreators({
      fetchMe,
      getPrototypes,
      selectPrototype,
    }, dispatch),
  })
)(Root));
