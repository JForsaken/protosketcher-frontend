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
import { isRequired, isEmail } from '../../../utils/validation';

@injectIntl
class LoginSection extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isShowingModal: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { email, password } = this.props.form.loginForm.values;

    this.props.actions.loginPending();
    this.props.actions.login({ email, password });
  }

  redirectToSketch() {
    this.props.router.push('/');
  }

  renderModal() {
    return (
      <ModalContainer onClose={() => this.handleModalClose()}>
        <ModalDialog className="error-modal" onClose={() => this.handleModalClose}>
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
      handleSubmit,
      api,
      intl,
    } = this.props;

    const submitButtonContent = api.login.pending ?
      <div className="spinner" /> :
      intl.messages['login.form.button'];

    return (
      <div>
        {this.state.isShowingModal && this.renderModal()}
        <h1 className="login-form__title"><FormattedMessage id="login.form.title" /></h1>
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
            validate={isRequired}
            placeholder={intl.messages['login.form.password']}
          />
          <a className="login-section__input-container__forgot-password">Forgot password?</a>
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
  form: 'loginForm',
  destroyOnUnmount: false,
})(connect(
  ({ api, form }) => ({ api, form }),
  dispatch => ({
    actions: bindActionCreators({
      ...apiActions,
    }, dispatch),
  })
)(LoginSection));
