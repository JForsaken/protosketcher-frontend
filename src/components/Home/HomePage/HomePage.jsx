/* Node modules */
import React, { Component } from 'react';

/* Components */
import Footer from '../../common/Footer/Footer';

export default class Home extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pages: ['Page 1', 'Page 2'],
    };
  }

  render() {
    return (
      <div className="page-container">
        Welcome to the sketch
        <Footer pages={this.state.pages} />
      </div>
    );
  }
}
