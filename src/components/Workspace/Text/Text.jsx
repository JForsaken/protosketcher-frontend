/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

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

  selectText() {
    if (!this.props.application.simulation.isSimulating) {
      this.props.monoSelect(this.props.id);
    }
  }

  render() {
    return (
      <text
        id={this.props.id}
        ref={svgText => (this.svgText = svgText)}
        onMouseDown={() => this.selectText()}
        onTouchStart={() => this.selectText()}
        className={classNames({
          'workspace-text': true,
          'workspace-text-selected': this.props.selected,
        })}
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
