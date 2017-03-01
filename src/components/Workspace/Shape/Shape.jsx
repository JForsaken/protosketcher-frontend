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
  }

  componentDidMount() {
    const { onLoad, id } = this.props;

    // if an onLoad callback has been provided
    if (onLoad) {
      onLoad(id, this.svgShape);
    }
  }

  onClick() {
    this.props.actions.updateWorkspace({
      selectedItems: [this.props.id],
    });
  }

  render() {
    return (
      <path
        onClick={() => this.onClick()}
        ref={svgShape => (this.svgShape = svgShape)}
        className={this.props.application.workspace.selectedItems.some(e => e === this.props.id)
          ? 'workspace-line-selected' : 'workspace-line'}
        d={this.props.path}
        stroke={this.props.color}
        id={this.props.id}
        transform={`translate(${this.props.posX} ${this.props.posY})`}
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
