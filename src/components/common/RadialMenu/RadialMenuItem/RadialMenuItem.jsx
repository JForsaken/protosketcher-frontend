/**
 * Item of a radial menu
 *
 * Props :
 *
 * icon: Icon to display in the item
 * color: Color of the background
 * action: Function to execute when the item is hovered
 * items: Items to display when the item is hovered <RadialMenuItem>
 * flex: Flex property applied to menu generation || 1
 */

/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Components */

/* Actions */
import { updateWorkspace } from '../../../../actions/application';


class RadialMenuItem extends Component {

  constructor(props, context) {
    super(props, context);

    // Default params
    this.state = {
      selected: false,
      selectedIndex: -1,
    };

    // Functions
    this.createSvgArc = this.createSvgArc.bind(this);
    this.createCSSTransform = this.createCSSTransform.bind(this);
    this.onMovingEvent = this.onMovingEvent.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.application.workspace.action === this.props.action) {
      this.setState({ selected: true });
    } else {
      this.setState({ selected: false });
    }
  }

  onMovingEvent() {
    if (this.props.action !== this.props.application.workspace.action) {
      this.props.actions.updateWorkspace({ action: this.props.action });
    }
  }

  createSvgArc(x, y, r, startAngle, endAngle) {
    const angle0 = startAngle;
    const angle1 = endAngle;

    const largeArc = angle1 - angle0 <= Math.PI ? 0 : 1;

    return ['M', x, y,
      'L', x + Math.cos(angle0) * r, y - (Math.sin(angle0) * r),
      'A', r, r, 0, largeArc, 0, x + Math.cos(angle1) * r, y - (Math.sin(angle1) * r),
      'L', x, y,
    ].join(' ');
  }

  createCSSTransform() {
    const angleStop = this.props.endAngle > this.props.startAngle
      ? this.props.endAngle : 2 * Math.PI + this.props.endAngle;
    const angleOffset = this.props.startAngle + (angleStop - this.props.startAngle) / 2;
    const x = Math.cos(angleOffset) * 65 + 80;
    const y = Math.sin(angleOffset) * -65 + 75;
    return { transform: `translate(${x}px,${y}px)`,
    };
  }

  render() {
    return (
      <g className="radial-menu-item">
        <path
          className={this.state.selected ? 'hover' : `action-${this.props.action}`}
          d={this.createSvgArc(100, 100, 100, this.props.startAngle, this.props.endAngle)}
          fill={this.props.color}
          onMouseMove={this.onMovingEvent}
          onTouchMove={this.onMovingEvent}
        />
        <image
          xlinkHref={this.props.icon}
          style={this.createCSSTransform()}
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
)(RadialMenuItem);
