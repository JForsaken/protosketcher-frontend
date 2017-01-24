/* Node modules */
import React, { Component } from 'react';
import SaveTimer from '../SaveTimer/SaveTimer';

/* Components */
import Menu from '../../common/Menu/Menu';
import Footer from '../../common/Footer/Footer';

export default class Home extends Component {
  render() {
    return (
      <div className="page-container">
        <Menu />
        <SaveTimer />
        <Footer />
      </div>
    );
  }
}
