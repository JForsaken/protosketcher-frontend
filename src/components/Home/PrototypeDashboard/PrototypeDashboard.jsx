/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEqual, map } from 'lodash';
import { FormGroup, FormControl, Row, Col, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';

/* Actions */
import * as apiActions from '../../../actions/api';
import { selectPrototype } from '../../../actions/application';

class PrototypeDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prototypes: map(props.application.prototypes, ((o, k) => ({ id: k, name: o.name }))),
      showModal: false,
      desktopRadio: true,
      mobileRadio: false,
      prototypeName: '',
      showDeleteModal: false,
      prototypeModifiedId: -1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.state.prototypes, nextProps.application.prototypes)) {
      this.setState({
        prototypes: map(nextProps.application.prototypes, ((o, k) => ({ id: k, name: o.name }))),
      });
    }
  }

  onPrototypeNameChanged(e) {
    this.setState({
      prototypeName: e.target.value,
    });
  }

  onDesktopChange() {
    this.setState({
      desktopRadio: true,
      mobileRadio: false,
    });
  }

  onMobileChange() {
    this.setState({
      desktopRadio: false,
      mobileRadio: true,
    });
  }

  onPrototypeClick(id) {
    this.props.actions.selectPrototype(id);
  }

  onAddClick() {
    this.setState({ showModal: true });
  }

  showDeleteModal(e, id) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showDeleteModal: true,
      prototypeModifiedId: id,
    });
    return false;
  }

  removePrototype() {
    this.props.actions.deletePrototype(this.state.prototypeModifiedId,
      this.props.application.user.token);

    this.closeModal();
  }

  closeModal() {
    this.setState({
      showModal: false,
      showDeleteModal: false,
      prototypeModifiedId: -1,
    });
  }

  createPrototype(e) {
    const { actions, application } = this.props;
    e.preventDefault();

    actions.createPrototype({
      name: this.state.prototypeName,
      isMobile: this.state.mobileRadio === true,
    }, application.user.token);

    this.setState({ showModal: false });
  }

  renderModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showModal}
        onEntering={() => {
          this.inputName.focus();
        }}
        onHide={() => this.closeModal()}
      >
        <form onSubmit={(e) => this.createPrototype(e)}>
          <Modal.Header closeButton>
            <FontAwesome name="plus-circle" />
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="prototype-name">
              <FormControl
                type="text"
                placeholder="Prototype name"
                onChange={(e) => this.onPrototypeNameChanged(e)}
                inputRef={ref => { this.inputName = ref; }}
              />
            </FormGroup>
            <hr />
            <FormGroup controlId="prototype-type">
              <ul>
                <li>
                  <input
                    checked={this.state.desktopRadio}
                    onChange={() => this.onDesktopChange()}
                    type="radio"
                    id="f-option"
                    name="selector"
                  />
                  <label htmlFor="f-option">
                    <FormattedMessage id="dashboard.modal.desktop" />
                  </label>

                  <div className="check"></div>
                </li>
                <li>
                  <input
                    checked={this.state.mobileRadio}
                    onChange={() => this.onMobileChange()}
                    type="radio"
                    id="s-option"
                    name="selector"
                  />
                  <label htmlFor="s-option">
                    <FormattedMessage id="dashboard.modal.mobile" />
                  </label>
                  <div className="check">
                    <div className="inside"></div>
                  </div>
                </li>
              </ul>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              disabled={!this.state.prototypeName}
              onClick={(e) => this.createPrototype(e)}
            >
              <FormattedMessage id="dashboard.modal.create" />
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

  renderDeleteModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showDeleteModal}
        onHide={() => this.closeModal()}
      >
        <Modal.Header closeButton>
          <FontAwesome name="trash" />
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="prototype-name">
            <label><FormattedMessage id="dashboard.modal.deleteConfirm" /></label>
          </FormGroup>
          <hr />
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={() => this.closeModal()}
            className="doubleButton"
          >
            <FormattedMessage id="cancel" />
          </Button>
          <Button
            bsStyle="warning"
            onClick={() => this.removePrototype()}
            className="doubleButton"
          >
            <FormattedMessage id="footer.delete" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderPrototypes() {
    // Add prototype Button
    const prototypes = [(
      <Col sm={4} md={3} key="add-prototype" className="prototype-container">
        <div
          className="prototype-container__prototype--add"
          onClick={() => this.onAddClick()}
        >
          <div className="prototype-container__prototype__title--add">
            <FontAwesome name="plus" />
          </div>
        </div>
      </Col>
    )];

    // Prototype list
    return prototypes.concat(this.state.prototypes.map((p, i) => (
      <Col sm={4} md={3} key={`prototype-${i}`} className="prototype-container">
        <div
          className="prototype-container__prototype"
          onClick={() => this.onPrototypeClick(p.id)}
        >
          <span className="remove-prototype" onClick={(e) => this.showDeleteModal(e, p.id)}>
            <FontAwesome name="times" />
          </span>
          <div className="prototype-container__prototype__title">{p.name}</div>
        </div>
      </Col>
    )));
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        {this.renderDeleteModal()}
        <div className="prototype-dashboard">
          <h1 className="title">
            <FormattedMessage id="dashboard.title" />
          </h1>
          <Row>
            {this.renderPrototypes()}
          </Row>
        </div>
      </div>
    );
  }
}

export default (connect(
  ({ api, application }) => ({ api, application }),
  dispatch => ({
    actions: bindActionCreators({
      ...apiActions,
      selectPrototype,
    }, dispatch),
  })
)(PrototypeDashboard));
