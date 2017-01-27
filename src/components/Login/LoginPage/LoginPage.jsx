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
import { isEmail, isRequired } from '../../../utils/validation';

@injectIntl
class Login extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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
    const { email, password } = this.props.form.loginForm.values;

    this.props.actions.loginPending();
    this.props.actions.login({ email, password });
  }

  redirectToSketch() {
    this.props.router.push('/');
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
          <Field
            name="email"
            component={ValidatedField}
            validate={[isRequired, isEmail]}
            type="email"
            placeholder={intl.messages['login.form.email']}
          />
          <Field
            name="password"
            component={ValidatedField}
            type="password"
            validate={isRequired}
            placeholder={intl.messages['login.form.password']}
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
})(connect(
  ({ api, form }) => ({ api, form }),
  dispatch => ({
    actions: bindActionCreators({
      ...apiActions,
    }, dispatch),
  })
)(Login));
