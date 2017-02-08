/* Node modules */
import React, { Component } from 'react';

export default class Shape extends Component {

  render() {
    return (
      <path
        className="workspace-line"
        d={this.props.path}
        stroke={this.props.color}
      />
    );
  }
}
