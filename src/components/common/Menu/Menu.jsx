/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Divider, FlatButton, MenuItem, IconMenu, IconButton, AppBar } from 'material-ui';
import { isEqual } from 'lodash';
import Scroll from 'react-scroll';

/* Icons */
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Create from 'material-ui/svg-icons/content/create';
import Send from 'material-ui/svg-icons/content/send';
import Apps from 'material-ui/svg-icons/navigation/apps';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Language from 'material-ui/svg-icons/action/language';

/* Actions */
import {
  redirectToDashboard,
  toggleSimulation,
  logout,
  switchLocale,
  updateWorkspace } from '../../../actions/application';

/* CONSTANTS */
import { TOP_MENU_HEIGHT } from '../../constants';


class Menu extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      logged: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    // LOGOUT
    if (!isEqual(this.props.application.user, nextProps.application.user) &&
        nextProps.application.user === null) {
      if (this.props.router.location.pathname === '/') {
        this.props.router.push('/landing');
      }
    }

    if (!isEqual(this.props.application.prototypes, nextProps.application.propTypes) &&
        nextProps.application.selectedPrototype) {
      const { prototypes, selectedPrototype } = nextProps.application;
      this.setState({ prototypeName: prototypes[selectedPrototype].name });
    }
  }

  onSettings() {
    this.props.router.push('/account');
  }

  onHome() {
    if (this.props.router.location.pathname !== '/') {
      this.props.router.push('/');
    }
  }

  handleSwitchLocale() {
    const { application: { locales, locale } } = this.props;
    const langIndex = locales.indexOf(locale);
    const nextLocale = langIndex + 1 < locales.length ? langIndex + 1 : 0;

    this.props.actions.switchLocale(locales[nextLocale]);
  }

  redirectToDashboard() {
    const { router } = this.props;

    this.props.actions.redirectToDashboard();
    if (router.location.pathname !== '/') {
      router.push('/');
    }
  }

  toggleSimulation() {
    // deselect shapes if some are selected
    this.props.actions.updateWorkspace({
      selectedItems: [],
    });
    this.props.actions.toggleSimulation();
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

  renderBrand() {
    return (
      <a
        className="app-bar__title"
        onClick={() => this.onHome()}
      >
        Protosketcher
      </a>
    );
  }

  renderLogin() {
    return (
      <div>
        <FlatButton
          label="Sign up"
          onTouchTap={() => this.props.router.push('/signup')}
          labelStyle={{ color: 'white' }}
          icon={<Create style={{ fill: 'white', width: 18 }} />}
        />
        <FlatButton
          label="Login"
          onTouchTap={() => this.props.router.push('/login')}
          labelStyle={{ color: 'white' }}
          icon={<Send style={{ fill: 'white', width: 18 }} />}
        />
      </div>
    );
  }

  renderLogged() {
    const { application: { locale, locales } } = this.props;
    const otherLocale = locales.find(o => o !== locale);
    let simulation = null;

    if (this.props.router.location.pathname === '/') {
      simulation = !this.props.application.simulation.isSimulating ?
        <MenuItem
          primaryText="Preview"
          onTouchTap={() => this.toggleSimulation()}
          leftIcon={<Visibility />}
        /> :
        <MenuItem
          primaryText="Edit mode"
          onTouchTap={() => this.toggleSimulation()}
          leftIcon={<VisibilityOff />}
        />;
    }

    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        className="app-bar__icon"
      >
        {simulation}
        <MenuItem
          primaryText="Prototypes"
          onTouchTap={() => this.redirectToDashboard()}
          leftIcon={<Apps />}
        />
        <MenuItem
          primaryText={otherLocale.toUpperCase()}
          onTouchTap={() => this.handleSwitchLocale()}
          leftIcon={<Language />}
        />
        <Divider />
        <MenuItem
          primaryText="Sign out"
          onTouchTap={() => this.props.actions.logout()}
          leftIcon={<ExitToApp />}
        />
      </IconMenu>
    );
  }

  renderNav() {
    return (
      <IconMenu
        iconButtonElement={<IconButton iconStyle={{ fill: 'white' }}><Hamburger /></IconButton>}
        targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        className="app-bar__icon"
      >
        <MenuItem
          primaryText="Features"
          onTouchTap={() => this.scrollToElement('features')}
        />
      </IconMenu>
    );
  }

  render() {
    return (
      <div>
        <AppBar
          title={this.renderBrand()}
          className="app-bar"
          iconElementLeft={this.props.router.location.pathname === '/landing' ?
                           this.renderNav() : <i />}
          iconElementRight={this.props.application.user ?
                            this.renderLogged() : this.renderLogin()}
        />
      </div>
    );
  }
}

export default (connect(
  ({ application }) => ({ application }),
  dispatch => ({
    actions: bindActionCreators({
      toggleSimulation,
      updateWorkspace,
      redirectToDashboard,
      logout,
      switchLocale,
    }, dispatch),
  })
)(Menu));
