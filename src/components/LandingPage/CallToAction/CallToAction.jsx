/* Node modules */
import React, { Component } from 'react';

export default class CallToAction extends Component {
  render() {
    return (
      <div className="callToActionInactive" onClick={() => this.props.router.push('/signup')}>
        <p className="ctaInactiveText">{this.props.inactiveText}</p>
        <div className="callToActionHovered">
          <p className="ctaHoveredText">{this.props.hoveredText}</p>
        </div>
      </div>
    );
  }
}
