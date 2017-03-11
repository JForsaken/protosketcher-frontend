/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

/* Actions */
import { updateWorkspace } from '../../../actions/application';

class Text extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    onLoad: PropTypes.func,
  }

  componentDidMount() {
    const { onLoad, id } = this.props;

    // if an onLoad callback has been provided
    if (onLoad) {
      onLoad(id, this.svgText);
    }
  }

  onClick() {
    if (isEmpty(this.props.application.workspace.selectedItems)
        && !this.props.application.simulation.isSimulating) {
      this.props.actions.updateWorkspace({
        selectedItems: [this.props.id],
        currentPath: null,
      });
    }
  }

  render() {
    return (
      <text
        id={this.props.id}
        ref={svgText => (this.svgText = svgText)}
        onClick={() => this.onClick()}
        className={this.props.application.workspace.selectedItems.some(e => e === this.props.id)
          ? 'workspace-text-selected' : null}
        transform={`translate(${this.props.posX} ${this.props.posY})`}
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
