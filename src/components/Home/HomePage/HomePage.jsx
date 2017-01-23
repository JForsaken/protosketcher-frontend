/* Node modules */
import React, { Component } from 'react';
import SaveTimer from '../SaveTimer/SaveTimer';

/* Components */
import Menu from '../../common/Menu/Menu';
import Footer from '../../common/Footer/Footer';
import Workspace from '../../Workspace/Workspace';

export default class Home extends Component {
  render() {
    return (
      <div className="page-container">
        <Menu />
        <SaveTimer />
        <Workspace />
        <Footer />
      </div>
    );
  }
}
