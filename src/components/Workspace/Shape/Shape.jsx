/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

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

  onClick() {
    if (isEmpty(this.props.application.workspace.selectedItems)
      && !this.props.application.isSimulation) {
      this.props.actions.updateWorkspace({
        selectedItems: [this.props.id],
        currentPath: null,
      });
    }
  }

  render() {
    return (
      <path
        id={this.props.id}
        ref={svgShape => (this.svgShape = svgShape)}
        onClick={() => this.onClick()}
        className={this.props.application.workspace.selectedItems.some(e => e === this.props.id)
          ? 'workspace-line-selected' : 'workspace-line'}
        d={this.props.path}
        stroke={this.props.color}
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
