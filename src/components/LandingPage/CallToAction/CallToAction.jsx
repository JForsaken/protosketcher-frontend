/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class CallToAction extends Component {
  render() {
    return (
      <div className="callToActionInactive" onClick={() => this.props.router.push('/signup')}>
        <p className="ctaInactiveText">
          <FormattedMessage id={this.props.inactiveText} />
        </p>
        <div className="callToActionHovered">
          <p className="ctaHoveredText">
            <FormattedMessage id={this.props.hoveredText} />
          </p>
        </div>
      </div>
    );
  }
}
