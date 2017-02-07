/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateWorkspace } from '../../../actions/application';

class Shape extends Component {

  render() {
    return (
      <path
        className={this.props.application.workspace.selectedItems.some(e => e === this.props.id)
          ? 'workspace-line-selected' : 'workspace-line'}
        d={this.props.path}
        stroke={this.props.color}
        id={this.props.id}
        transform={`translate(${this.props.posx} ${this.props.posy})`}
      />
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
