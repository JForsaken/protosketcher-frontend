/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SaveTimer from '../SaveTimer/SaveTimer';

/* Components */
import Menu from '../../common/Menu/Menu';
import Footer from '../../common/Footer/Footer';
import PrototypeDashboard from '../PrototypeDashboard/PrototypeDashboard';
import Workspace from '../../Workspace/Workspace';

class HomePage extends Component {
  render() {
    /* if no prototype is currently selected,
     * we show the prototype dashboard
    */
    if (!this.props.application.prototype) {
      return (
        <div>
          <PrototypeDashboard />
        </div>
      );
    }

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

export default (connect(
  ({ application }) => ({ application }),
)(HomePage));
