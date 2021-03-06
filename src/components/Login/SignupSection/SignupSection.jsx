/* Node modules */
import React, { Component, PropTypes } from 'react';
import { Button, Form } from 'react-bootstrap';
import { isEqual, isEmpty } from 'lodash';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

/* Components */
import ValidatedField from '../../common/ValidatedField/ValidatedField';

/* Actions */
import * as apiActions from '../../../actions/api';

/* Constants */
import { LOGIN } from '../../../actions/constants';

/* Utils */
import {
  isRequired,
  isEmail,
  isMinLengthValid,
  isMaxLengthValid,
  containsUpperCase,
  containsSpecial,
  isMatching,
  containsDigit } from '../../../utils/validation';

@injectIntl
class SignupSection extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isShowingModal: false,
      pending: false,
      message: '',
    };

    this.fields = {
      password: {
        value: '',
        visited: false,
      },
      confirmPassword: {
        value: '',
        visited: false,
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { login, createUser } = nextProps.api;

    if (!isEqual(this.props.api.createUser, createUser)) {
      this.setState({ pending: false });

      // if the user creation has errors
      if (!isEmpty(createUser.error)) {
        let message = '';
        switch (createUser.error.code) {
          case 409:
            message = 'signup.form.modal.409';
            break;
          default:
            message = 'signup.form.modal.500';
            break;
        }
        this.setState({ isShowingModal: true, message });
      } else {
        const { email, password } = this.props.form.signupForm.values;
        this.props.actions.login({ email, password });
      }
    } else if (!isEqual(this.props.api.login, login)
               && login.lastAction === LOGIN) {
      this.setState({ pending: false });

      // if the login has errors
      if (!isEmpty(login.error)) {
        this.setState({ isShowingModal: true });
      } else {
        this.redirectToSketch();
      }
    }
  }

  onChange(e, inputId) {
    this.fields[inputId] = {
      ...this.fields[inputId],
      value: e.target.value,
    };
  }

  onBlur(e, inputId) {
    this.fields[inputId] = {
      ...this.fields[inputId],
      visited: true,
    };
  }

  handleModalClose() {
    this.setState({ isShowingModal: false });
  }

  handleSubmit() {
    const { email, password } = this.props.form.signupForm.values;

    this.setState({ pending: true });
    this.props.actions.createUser({ email, password });
  }

  redirectToSketch() {
    this.props.router.push('/');
  }

  renderModal() {
    return (
      <ModalContainer onClose={() => this.handleModalClose()}>
        <ModalDialog className="error-modal" onClose={() => this.handleModalClose()}>
          <h2>
            <FormattedMessage id="signup.form.modal.title" />
          </h2>
          <h4>
            <FormattedMessage id={this.state.message} />
          </h4>
        </ModalDialog>
      </ModalContainer>
    );
  }

  render() {
    const {
      handleSubmit,
      intl,
    } = this.props;

    const { pending, isShowingModal } = this.state;

    let syncErrors = {};
    let asyncErrors = {};

    const submitButtonContent = pending ?
      <div className="spinner" /> :
      intl.messages['signup.form.button'];

    if (this.props.form.signupForm) {
      asyncErrors = this.props.form.signupForm.asyncErrors;
      syncErrors = this.props.form.signupForm.syncErrors;
    }

    return (
      <div>
        {isShowingModal && this.renderModal()}
        <h1 className="login-form__title"><FormattedMessage id="signup.form.title" /></h1>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            name="email"
            component={ValidatedField}
            validate={[isRequired, isEmail]}
            containerClass="login-section__input-container"
            inputClass="login-section__input-container__input"
            errorClass="login-section__input-container__error-label"
            type="email"
            placeholder={intl.messages['login.form.email']}
          />
          <Field
            name="password"
            component={ValidatedField}
            containerClass="login-section__input-container"
            inputClass="login-section__input-container__input"
            errorClass="login-section__input-container__error-label"
            type="password"
            validate={[isRequired,
                       (v) => isMaxLengthValid(v, 25),
                       (v) => isMinLengthValid(v, 8),
                       (v) => containsUpperCase(v, false),
                       (v) => containsSpecial(v, false),
                       (v) => containsDigit(v, false),
                       () => isMatching(this.fields.password,
                                        this.fields.confirmPassword)]}
            placeholder={intl.messages['login.form.password']}
            onChange={(e) => this.onChange(e, 'password')}
            onBlur={(e) => this.onBlur(e, 'password')}
          />
          <Field
            name="confirmPassword"
            component={ValidatedField}
            containerClass="login-section__input-container"
            inputClass="login-section__input-container__input"
            errorClass="login-section__input-container__error-label"
            type="password"
            validate={[isRequired,
                       (v) => isMaxLengthValid(v, 25),
                       (v) => isMinLengthValid(v, 8),
                       (v) => containsUpperCase(v, false),
                       (v) => containsSpecial(v, false),
                       (v) => containsDigit(v, false),
                       () => isMatching(this.fields.password,
                                        this.fields.confirmPassword)]}
            placeholder={intl.messages['login.form.confirmPassword']}
            onChange={(e) => this.onChange(e, 'confirmPassword')}
            onBlur={(e) => this.onBlur(e, 'confirmPassword')}
          />
          <Button
            className="login-section__login-button"
            type="submit"
            disabled={pending
                  || isShowingModal
                  || !isEmpty(asyncErrors)
                  || !isEmpty(syncErrors)
                  || this.fields.password.value
                  !== this.fields.confirmPassword.value}
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
  destroyOnUnmount: true,
  asyncBlurFields: ['password', 'confirmPassword'],
})(connect(
  ({ api, form }) => ({ api, form }),
  dispatch => ({
    actions: bindActionCreators({
      ...apiActions,
    }, dispatch),
  })
)(SignupSection));
