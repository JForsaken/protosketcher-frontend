/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };
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
    let classNames = 'workspace-text';
    if (this.props.selected) {
      classNames += ' workspace-text-selected';
    }
    if (this.state.hovered) {
      classNames += ' workspace-text-hovered';
    }

    return (
      <text
        id={this.props.id}
        ref={svgText => (this.svgText = svgText)}
        onMouseDown={() => this.selectText()}
        onTouchStart={() => this.selectText()}
        className={classNames}
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
