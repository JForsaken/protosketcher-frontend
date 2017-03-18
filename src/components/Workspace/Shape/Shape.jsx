/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Actions */
import { updateWorkspace } from '../../../actions/application';

class Shape extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    onLoad: PropTypes.func,
  };

  componentDidMount() {
    const { onLoad, id } = this.props;

    // if an onLoad callback has been provided
    if (onLoad) {
      onLoad(id, this.svgShape);
    }
  }

  selectShape() {
    if (!this.props.application.simulation.isSimulating) {
      this.props.monoSelect(this.props.id);
    }
  }

  render() {
    return (
      <g className="path-container">
        <path
          onMouseDown={() => this.selectShape()}
          className="workspace-line line-padding"
          d={this.props.path}
          stroke="transparent"
          transform={`translate(${this.props.posX} ${this.props.posY})`}
        />
        <path
          id={this.props.id}
          ref={svgShape => (this.svgShape = svgShape)}
          className={`workspace-line${this.props.selected ? ' workspace-line-selected' : ''}`}
          d={this.props.path}
          stroke={this.props.color}
          transform={`translate(${this.props.posX} ${this.props.posY})`}
        />
      </g>
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  dispatch => ({
    actions: bindActionCreators({
      updateWorkspace,
    }, dispatch),
  })
)(Shape);
