/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Text extends Component {

  render() {
    return (
      <text
        id={this.props.id}
        transform={`translate(${this.props.posx} ${this.props.posy})`}
        style={{ fontSize: this.props.size }}
      >
      {this.props.content}
      </text>
    );
  }
}

export default connect(
  ({ application }) => ({ application })
)(Text);
