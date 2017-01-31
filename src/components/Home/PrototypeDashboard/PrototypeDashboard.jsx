/* Node modules */
import React, { Component } from 'react';
import { isEqual, isEmpty } from 'lodash';
import { FormGroup, FormControl, Radio, Row, Col, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Actions */
import * as apiActions from '../../../actions/api';
import { selectPrototype } from '../../../actions/application';

class PrototypeDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prototypes: [],
      showModal: false,
      desktopRadio: true,
      mobileRadio: false,
      prototypeName: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { getPrototypes, createPrototype } = nextProps.api;

    if (!isEqual(this.props.api.getPrototypes.prototypes, getPrototypes.prototypes)) {
      // if the login has no errors
      if (isEmpty(getPrototypes.error)) {
        this.setState({ prototypes: getPrototypes.prototypes });
      }
    } else if (!isEqual(this.props.api.createPrototype, createPrototype)) {
      if (isEmpty(createPrototype.error)) {
        const { id, token } = nextProps.application.user;
        nextProps.actions.getPrototypes(id, token);
      }
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

  closeModal() {
    this.setState({ showModal: false });
  }

  createPrototype() {
    const { actions, application } = this.props;
    actions.createPrototype({ name: this.state.prototypeName }, application.user.token);
    this.setState({ showModal: false });
  }

  renderModal() {
    return (
      <Modal
        dialogClassName="add-modal"
        show={this.state.showModal}
        onHide={() => this.closeModal()}
      >
        <Modal.Body>
          <h4>Create new prototype</h4>
          <hr />
          <FormGroup controlId="prototype-name">
            <FormControl
              type="text"
              placeholder="Prototype name"
              onChange={(e) => this.onPrototypeNameChanged(e)}
            />
          </FormGroup>
          <hr />
          <FormGroup controlId="prototype-type">
            <Radio inline checked={this.state.desktopRadio} onChange={() => this.onDesktopChange()}>
              Desktop
            </Radio>
            <Radio inline checked={this.state.mobileRadio} onChange={() => this.onMobileChange()}>
              Mobile
            </Radio>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="primary"
            disabled={!this.state.prototypeName}
            onClick={() => this.createPrototype()}
          >
            Create
          </Button>
          <Button onClick={() => this.closeModal()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderPrototypes() {
    const prototypes = [(
      <Col sm={4} md={3} key="add-prototype" className="prototype-container">
        <div
          className="prototype-container__prototype"
          onClick={() => this.onAddClick()}
        >
          <div className="prototype-container__prototype__title--add">
            <i className="fa fa-plus" aria-hidden="true" />
          </div>
        </div>
      </Col>
    )];

    return prototypes.concat(this.state.prototypes.map((p, i) => (
      <Col sm={4} md={3} key={`prototype-${i}`} className="prototype-container">
        <div
          className="prototype-container__prototype"
          onClick={() => this.onPrototypeClick(p.id)}
        >
          <div className="prototype-container__prototype__title">{p.name}</div>
        </div>
      </Col>
    )));
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        <div className="prototype-dashboard">
          <h1 className="title">Prototypes</h1>
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
