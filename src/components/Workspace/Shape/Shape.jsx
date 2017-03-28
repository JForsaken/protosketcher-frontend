/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

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

  constructor(props, context) {
    super(props, context);

    this.state = {
      hovered: false,
    };
  }

  componentDidMount() {
    const { onLoad, id } = this.props;

    // if an onLoad callback has been provided
    if (onLoad) {
      onLoad(id, this.svgShape);
    }
  }

  hoverShape() {
    if (!this.props.application.simulation.isSimulating) {
      this.setState({
        hovered: true,
      });
    }
  }

  selectShape(e) {
    if (!this.props.application.simulation.isSimulating) {
      this.props.monoSelect(this.props.id, e);
    }
  }

  render() {
    return (
      <g className="path-container">
        <path
          id={this.props.id}
          ref={svgShape => (this.svgShape = svgShape)}
          className={classNames({
            'workspace-line': true,
            'workspace-line-selected': this.props.selected,
            'workspace-line-hovered': this.state.hovered,
          })}
          d={this.props.path}
          stroke={this.props.color}
          transform={`translate(${this.props.posX} ${this.props.posY})`}
        />
        <path
          onMouseDown={(e) => this.selectShape(e)}
          onMouseOver={() => this.hoverShape()}
          onMouseLeave={() => this.setState({ hovered: false })}
          onTouchStart={(e) => this.selectShape(e)}
          className="workspace-line line-padding"
          d={this.props.path}
          stroke="transparent"
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
