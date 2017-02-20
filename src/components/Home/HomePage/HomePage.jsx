/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/* Components */
import Menu from '../../common/Menu/Menu';
import PrototypeDashboard from '../PrototypeDashboard/PrototypeDashboard';
import Workspace from '../../Workspace/Workspace';

const animationTime = 300;

class HomePage extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  renderSwitch() {
    const router = this.props.router;

    // render prototype dashboard
    if (!this.props.application.selectedPrototype) {
      return (
        <div key="dashboard-anim">
          <PrototypeDashboard />
        </div>
      );
    }

    // render workspace
    if (this.props.application.prototypes) {
      return (
        <div className="page-container" key="homepage-anim">
          <Menu router={router} />
          <Workspace />
        </div>
      );
    }

    // TODO: show loading maybe instead of nothing
    return null;
  }

  render() {
    /* if no prototype is currently selected,
     * we show the prototype dashboard
     */
    return (
      <ReactCSSTransitionGroup
        transitionName="homepage-dashboard"
        transitionEnterTimeout={animationTime}
        transitionLeaveTimeout={animationTime}
      >
        {this.renderSwitch()}
      </ReactCSSTransitionGroup>
    );
  }
}
export default (connect(
  ({ application }) => ({ application }),
)(HomePage));
