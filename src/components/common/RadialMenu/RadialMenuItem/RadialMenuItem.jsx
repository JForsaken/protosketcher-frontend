/**
 * Item of a radial menu
 *
 * Props :
 *
 * icon: Icon to display in the item
 * color: Color of the background
 * action: Function to execute when the item is hovered
 * items: Items to display when the item is hovered
 * startAngle: Starting degree of section
 * endAngle: Ending degree of section
 */

/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */

/* Actions */


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
  }

  createSvgArc(x, y, r, startAngle, endAngle) {
    let angle0 = startAngle;
    let angle1 = endAngle;
    if (angle0 > angle1) {
      [angle0, angle1] = [angle1, angle0];
    }
    if (angle1 - angle0 > Math.PI * 2) {
      angle1 = Math.PI * 1.99999;
    }

    const largeArc = angle1 - angle0 <= Math.PI ? 0 : 1;

    return ['M', x, y,
      'L', x + Math.cos(angle0) * r, y - (Math.sin(angle0) * r),
      'A', r, r, 0, largeArc, 0, x + Math.cos(angle1) * r, y - (Math.sin(angle1) * r),
      'L', x, y,
    ].join(' ');
  }

  render() {
    return (
      <path
        className="radial-menu-item"
        d={this.createSvgArc(100, 100, 100, this.props.startAngle, this.props.endAngle)}
        fill={this.props.color}
      />
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  null
)(RadialMenuItem);
