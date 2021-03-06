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
  };

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

  selectText(e) {
    if (!this.props.application.simulation.isSimulating) {
      this.props.monoSelect(this.props.id, e);
    }
  }

  hoverText() {
    if (!this.props.application.simulation.isSimulating) {
      this.setState({
        hovered: true,
      });
    }
  }

  render() {
    return (
      <text
        id={this.props.id}
        ref={svgText => (this.svgText = svgText)}
        onMouseDown={(e) => this.selectText(e)}
        onMouseOver={() => this.hoverText()}
        onMouseLeave={() => this.setState({ hovered: false })}
        onTouchStart={(e) => this.selectText(e)}
        className={classNames({
          'workspace-text': true,
          'workspace-text-selected': this.props.selected,
          'workspace-text-affected': this.props.affected,
          'workspace-text-hovered': this.state.hovered,
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
  }),
  null,
  {
    withRef: true,
  }
)(Text);
