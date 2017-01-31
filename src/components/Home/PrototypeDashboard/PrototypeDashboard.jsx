/* Node modules */
import React, { Component } from 'react';
import { isEqual, isEmpty } from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

class PrototypeDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prototypes: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { getPrototypes } = nextProps.api;

    if (!isEqual(this.props.api.getPrototypes.prototypes, getPrototypes.prototypes)) {
      // if the login has no errors
      if (isEmpty(getPrototypes.error)) {
        this.setState({ prototypes: getPrototypes.prototypes });
      }
    }
  }

  onAddClick() {
    alert('plz add');
  }

  renderPrototypes() {
    const prototypes = [(
      <Col sm={4} md={3} key="add-prototype" className="prototype-container">
        <div className="prototype-container__prototype" onClick={() => this.onAddClick()}>
          <div className="prototype-container__prototype__title--add">
            <i className="fa fa-plus" aria-hidden="true" />
          </div>
        </div>
      </Col>
    )];

    return prototypes.concat(this.state.prototypes.map((p, i) => (
      <Col sm={4} md={3} key={`prototype-${i}`} className="prototype-container">
        <div className="prototype-container__prototype">
          <div className="prototype-container__prototype__title">{p.name}</div>
        </div>
      </Col>
    )));
  }

  render() {
    return (
      <div className="prototype-dashboard">
        <h1 className="title">Prototypes</h1>
        <Row>
          {this.renderPrototypes()}
        </Row>
      </div>
    );
  }
}

export default (connect(
  ({ api }) => ({ api }),
)(PrototypeDashboard));
