/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Actions */
import { updateWorkspace } from '../../../actions/application';

class Text extends Component {

  onClick() {
    this.props.actions.updateWorkspace({
      selectedItems: [this.props.id],
      currentPath: null,
    });
  }

  render() {
    return (
      <text
        id={this.props.id}
        className={this.props.application.workspace.selectedItems.some(e => e === this.props.id)
          ? 'workspace-text-selected' : null}
        onClick={() => this.onClick()}
        transform={`translate(${this.props.posx} ${this.props.posy})`}
        style={{ fontSize: this.props.size }}
      >
      {this.props.content}
      </text>
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
)(Text);
