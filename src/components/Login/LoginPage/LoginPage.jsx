/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/* Components */
import LoginSection from '../LoginSection/LoginSection';
import SignupSection from '../SignupSection/SignupSection';

const animationTime = 600;

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoginButtonActive: true,
      canToggle: true,
    };
  }

  loginClick() {
    if (!this.state.isLoginButtonActive && this.state.canToggle) {
      const timeoutId = setTimeout(() => {
        this.setState({ canToggle: true });
      }, animationTime);

      this.setState({
        timeoutId,
        isLoginButtonActive: true,
        canToggle: false,
      });
    }
  }

  signupClick() {
    if (this.state.isLoginButtonActive && this.state.canToggle) {
      const timeoutId = setTimeout(() => {
        this.setState({ canToggle: true });
      }, animationTime);

      this.setState({
        timeoutId,
        isLoginButtonActive: false,
        canToggle: false,
      });
    }
  }

  render() {
    const loginButtonClass = classNames({
      'login-form__context-button': true,
      'login-form__context-button--active': this.state.isLoginButtonActive,
    });

    const signupButtonClass = classNames({
      'login-form__context-button': true,
      'login-form__context-button--active': !this.state.isLoginButtonActive,
    });

    const { location } = this.props;

    return (
      <div className="page-container login-page">
        <div className="login-form">
          <a className={loginButtonClass} onClick={() => this.loginClick()}>
            <FormattedMessage id="login.form.context" />
          </a>
          <a className={signupButtonClass} onClick={() => this.signupClick()}>
            <FormattedMessage id="signup.form.context" />
          </a>

          <ReactCSSTransitionGroup
            transitionName="form"
            transitionEnterTimeout={animationTime}
            transitionLeaveTimeout={animationTime}
          >
            {this.state.isLoginButtonActive ?
              <LoginSection key="login-section" location={location} /> :
              <SignupSection key="signup-section" location={location} />
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}
