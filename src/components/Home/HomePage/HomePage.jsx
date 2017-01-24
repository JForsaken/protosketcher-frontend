/* Node modules */
import React, { Component } from 'react';
import SaveTimer from '../SaveTimer/SaveTimer';

export default class Home extends Component {
  render() {
    return (
      <div className="page-container">
        <SaveTimer />
        Welcome to the sketch
      </div>
    );
  }
}
