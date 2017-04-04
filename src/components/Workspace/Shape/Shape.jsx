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
    // if the bounding box width or height is 0, its a straight line
    let type = 'curve';
    if (this.svgShape) {
      const boundingBox = this.svgShape.getBBox();
      if (boundingBox.width === 0 || boundingBox.height === 0) {
        type = 'line';
      }
    }

    let classes = `workspace-${type}`;

    // add conditional css classes depending on line or curve
    if (this.props.selected) {
      classes += ` workspace-${type}-selected`;
    }
    if (this.state.hovered) {
      classes += ` workspace-${type}-hovered`;
    }
    if (this.props.affected) {
      classes += ` workspace-${type}-affected`;
    }

    return (
      <g className="path-container">
        <path
          id={this.props.id}
          ref={svgShape => (this.svgShape = svgShape)}
          className={classes}
          d={this.props.path}
          stroke={this.props.color}
          transform={`translate(${this.props.posX} ${this.props.posY})`}
        />
        <path
          onMouseDown={(e) => this.selectShape(e)}
          onMouseOver={() => this.hoverShape()}
          onMouseLeave={() => this.setState({ hovered: false })}
          onTouchStart={(e) => this.selectShape(e)}
          className={`workspace-${type} ${type}-padding`}
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
  }),
  null,
  {
    withRef: true,
  }
)(Shape);
