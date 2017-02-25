/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Shape extends Component {
  componentDidMount() {
    this.shape.addEventListener('click', this.onShapeClick);
  }

  componentWillUnmount() {
    this.shape.removeEventListener('click', this.onShapeClick);
  }

  onShapeClick() {
    alert('hey');
  }

  render() {
    return (
      <path
        className={this.props.application.workspace.selectedItems.some(e => e === this.props.id)
          ? 'workspace-line-selected' : 'workspace-line'}
        d={this.props.path}
        stroke={this.props.color}
        id={this.props.id}
        fill="green"
        ref={ref => (this.shape = ref)}
        transform={`translate(${this.props.posx} ${this.props.posy})`}
      />
    );
  }
}

export default connect(
  ({ application }) => ({ application })
)(Shape);
