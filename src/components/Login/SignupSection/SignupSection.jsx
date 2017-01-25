/* Node modules */
import React, { Component, PropTypes } from 'react';
import { Button, Form } from 'react-bootstrap';
import { isEqual, isEmpty } from 'lodash';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

/* Components */
import FieldGroup from '../../common/FieldGroup/FieldGroup';

/* Actions */
import * as apiActions from '../../../actions/api';

/* Constants */
import { LOGIN } from '../../../actions/constants';

/* Utils */
import loginValidation, { fields } from './loginValidation';

@injectIntl
class SignupSection extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
  };

  static contextTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    this.state = {
      isShowingModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { login } = nextProps.api;

    if (!isEqual(this.props.api.login, login)
        && login.lastAction === LOGIN) {
      // if the login has errors
      if (!isEmpty(login.error)) {
        this.setState({ isShowingModal: true });
      } else {
        this.redirectToSketch();
      }
    }
  }

  handleModalClose() {
    this.setState({ isShowingModal: false });
  }

  handleSubmit() {
    const loginAttempt = {
      email: this.props.fields.email.value,
      password: this.props.fields.password.value,
    };

    this.props.actions.loginPending();
    this.props.actions.login(loginAttempt);
  }

  redirectToSketch() {
    const { history } = this.context;
    const { location } = this.props;
    let nextPath = '/';

    if (location.state && location.state.nextPathname) {
      nextPath = location.state.nextPathname;
    }

    history.pushState({}, nextPath);
  }

  renderModal() {
    return (
      <ModalContainer onClose={this.handleModalClose}>
        <ModalDialog className="error-modal" onClose={this.handleModalClose}>
          <h2>
            <FormattedMessage id="login.form.modal.title" />
          </h2>
          <h4>
            <FormattedMessage id="login.form.modal.content" />
          </h4>
        </ModalDialog>
      </ModalContainer>
    );
  }

  render() {
    const {
      fields: {
        email,
        password,
      },
      handleSubmit,
      api,
      intl,
    } = this.props;

    const submitButtonContent = api.login.pending ?
      <div className="spinner" /> :
      intl.messages['signup.form.button'];

    return (
      <div>
        {this.state.isShowingModal && this.renderModal()}
        <h1 className="login-form__title"><FormattedMessage id="signup.form.title" /></h1>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <FieldGroup
            id="email"
            type="text"
            className="login-section__input"
            placeholder={intl.messages['login.form.email']}
            {...email}
          />
          <FieldGroup
            id="password"
            type="password"
            className="login-section__input"
            placeholder={intl.messages['login.form.password']}
            {...password}
          />
          <Button
            className="login-section__login-button"
            type="submit"
            disabled={api.login.pending}
          >
            {submitButtonContent}
          </Button>
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'signupForm',
  destroyOnUnmount: false,
  validate: loginValidation,
  fields,
})(connect(
  ({ api }) => ({ api }),
  dispatch => ({
    actions: bindActionCreators({
      ...apiActions,
    }, dispatch),
  })
)(SignupSection));
