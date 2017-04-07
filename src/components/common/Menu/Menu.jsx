/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import {
  Divider,
  Checkbox,
  FlatButton,
  MenuItem,
  IconMenu,
  IconButton,
  AppBar,
  TextField } from 'material-ui';
import { orange500 } from 'material-ui/styles/colors';
import { isEqual } from 'lodash';
import Scroll from 'react-scroll';

/* Icons */
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Create from 'material-ui/svg-icons/content/create';
import Send from 'material-ui/svg-icons/content/send';
import Apps from 'material-ui/svg-icons/navigation/apps';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Language from 'material-ui/svg-icons/action/language';

/* Logo */
import Logo from '../../../../assets/images/logo.png';

/* Actions */
import {
  redirectToDashboard,
  toggleSimulation,
  logout,
  switchLocale,
  updateWorkspace } from '../../../actions/application';
import { patchPrototype } from '../../../actions/api';

/* CONSTANTS */
import { TOP_MENU_HEIGHT } from '../../constants';

@injectIntl
class Menu extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { prototypes, selectedPrototype } = this.props.application;
    this.state = {
      logged: true,
      prototypeName: selectedPrototype ? prototypes[selectedPrototype].name : null,
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

    if (!isEqual(this.props.application.prototypes, nextProps.application.prototypes) &&
        nextProps.application.selectedPrototype) {
      const { prototypes, selectedPrototype } = nextProps.application;
      this.setState({ prototypeName: prototypes[selectedPrototype].name });
    }
  }

  onHome() {
    const { application: { user, selectedPrototype }, router } = this.props;
    const insideWorkspace = user && selectedPrototype && router.location.pathname !== '/landing';
    if (insideWorkspace) {
      this.redirectToDashboard();
    } else {
      this.props.router.push('/landing');
    }
  }

  handleSwitchLocale() {
    const { application: { locales, locale } } = this.props;
    const langIndex = locales.indexOf(locale);
    const nextLocale = langIndex + 1 < locales.length ? langIndex + 1 : 0;

    this.props.actions.switchLocale(locales[nextLocale]);
  }

  redirectToDashboard() {
    const { router, application: { simulation } } = this.props;

    if (simulation.isSimulating) {
      this.toggleSimulation();
    }

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

  renamePrototype(e) {
    const { prototypes, selectedPrototype } = this.props.application;

    e.preventDefault();

    if (prototypes[selectedPrototype].name !== this.state.prototypeName) {
      this.props.actions.patchPrototype({
        name: this.state.prototypeName,
        id: this.props.application.selectedPrototype,
      }, this.props.application.user.token);
    }
  }

  renderBrand() {
    return (
      <a
        className="app-bar__title"
        onClick={() => this.onHome()}
      >
        <img src={Logo} alt="Logo" />
      </a>
    );
  }

  renderPrototypeName() {
    const { application: { user, selectedPrototype }, router } = this.props;

    if (!user || !selectedPrototype || router.location.pathname === '/landing') {
      return null;
    }

    return (
      <form onSubmit={(e) => this.renamePrototype(e)} className="app-bar__prototype-form">
        <TextField
          type="text"
          name="prototype-name"
          inputStyle={{ textAlign: 'center', margin: 'auto 0', fontSize: 20, color: 'white' }}
          onBlur={(e) => this.renamePrototype(e)}
          onChange={(e) => this.setState({ prototypeName: e.target.value })}
          value={this.state.prototypeName}
          underlineFocusStyle={{ borderColor: orange500 }}
        />
      </form>
    );
  }

  renderLogin() {
    const {
      application: { locale, locales },
      intl: { messages },
    } = this.props;

    const otherLocale = locales.find(o => o !== locale);

    return (
      <div>
        <FlatButton
          label={otherLocale.toUpperCase()}
          labelStyle={{ color: 'white' }}
          onTouchTap={() => this.handleSwitchLocale()}
          icon={<Language style={{ fill: 'white', width: 18 }} />}
        />
        <FlatButton
          label={messages['login.form.button']}
          onTouchTap={() => this.props.router.push('/login')}
          labelStyle={{ color: 'white' }}
          icon={<Send style={{ fill: 'white', width: 18 }} />}
        />
        <FlatButton
          label={messages['signup.form.context']}
          onTouchTap={() => this.props.router.push('/signup')}
          labelStyle={{ color: 'white' }}
          icon={<Create style={{ fill: 'white', width: 18 }} />}
        />
      </div>
    );
  }

  renderLogged() {
    const {
      application: { locale, locales, simulation, user, selectedPrototype },
      intl: { messages },
      router,
    } = this.props;

    const otherLocale = locales.find(o => o !== locale);

    const insideWorkspace = user && selectedPrototype && router.location.pathname !== '/landing';

    return (
      <Row className="app-bar__right-container">
        {insideWorkspace &&
          <Col xs={6} className="app-bar__right-container__col">
            <Checkbox
              iconStyle={{ fill: 'white' }}
              className={"app-bar__right-container__col__eye"}
              checkedIcon={simulation.isSimulating ? <VisibilityOff /> : <Visibility />}
              uncheckedIcon={simulation.isSimulating ? <VisibilityOff /> : <Visibility />}
              onTouchTap={() => this.toggleSimulation()}
            />
          </Col>
        }
        <Col xs={6} className="app-bar__right-container__col">
          <IconMenu
            iconStyle={{ fill: 'white' }}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            className="app-bar__icon"
          >
            <MenuItem
              primaryText={messages['menu.backToPrototypes']}
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
              primaryText={messages['menu.logout']}
              onTouchTap={() => this.props.actions.logout()}
              leftIcon={<ExitToApp />}
            />
          </IconMenu>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div>
        <AppBar
          title={this.renderBrand()}
          className="app-bar"
          iconElementLeft={<i />}
          iconElementRight={this.props.application.user ?
                            this.renderLogged() : this.renderLogin()}
        />
        {this.renderPrototypeName()}
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
      patchPrototype,
    }, dispatch),
  })
)(Menu));
