/* Node modules */
import React, { Component } from 'react';
import SaveTimer from '../SaveTimer/SaveTimer';

/* Components */
import Menu from '../../common/Menu/Menu';
import Footer from '../../common/Footer/Footer';
import PrototypeDashboard from '../PrototypeDashboard/PrototypeDashboard';
import Workspace from '../../Workspace/Workspace';

export default class Home extends Component {
  render() {
    return (
      <div>
        <PrototypeDashboard />
      </div>
    );

    return (
      <div className="page-container">
        <Menu />
        <PrototypeDashboard />
        <SaveTimer />
        <Workspace />
        <Footer />
      </div>
    );
  }
}
