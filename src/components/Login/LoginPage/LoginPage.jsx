/* Node modules */
import React, { Component, PropTypes } from 'react';
import { Button, Form } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

/* Components */
import FieldGroup from '../../common/FieldGroup/FieldGroup';

/* Actions */
import * as apiActions from '../../../actions/api';

/* Utils */
import loginValidation, { fields } from './loginValidation';

/* Constants */
import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
} from '../../../actions/constants';


@injectIntl
class Login extends Component {

  static propTypes = {
    location: PropTypes.object,
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

  componentWillUpdate(nextProps) {
    const { api } = this.props;

    if (api.login.lastAction !== nextProps.api.login.lastAction) {
      this.handleApiResponse(nextProps.api.login.lastAction);
    }
  }

  handleModalClose() {
    this.setState({ isShowingModal: false });
  }

  handleApiResponse(response) {
    switch (response) {

      case LOGIN_FAILED:
        this.setState({ isShowingModal: true });
        break;

      case LOGIN_SUCCESS:
        this.redirectToSketch();
        break;

      default:
        break;
    }
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
      <div><i className="fa fa-paper-plane" /> {intl.messages['login.form.title']}</div>;

    return (
      <div className="page-container">
        {this.state.isShowingModal && this.renderModal()}
        <Form className="login-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <h1 className="login-form__title">
            <FormattedMessage id="login.form.title" />
          </h1>
          <FieldGroup
            id="email"
            type="text"
            label={intl.messages['login.form.email']}
            placeholder={intl.messages['login.form.email']}
            {...email}
          />
          <FieldGroup
            id="password"
            type="password"
            label={intl.messages['login.form.password']}
            placeholder={intl.messages['login.form.password']}
            {...password}
          />
          <div className="login-form__button-container">
            <Button
              style={{ width: 150, height: 45 }}
              bsStyle="primary"
              bsSize="large"
              type="submit"
              disabled={api.login.pending}
            >
              {submitButtonContent}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'loginForm',
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
)(Login));
