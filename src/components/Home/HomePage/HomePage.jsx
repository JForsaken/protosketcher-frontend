/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/* Components */
import Menu from '../../common/Menu/Menu';
import Footer from '../../common/Footer/Footer';
import PrototypeDashboard from '../PrototypeDashboard/PrototypeDashboard';
import Workspace from '../../Workspace/Workspace';

const animationTime = 300;

class HomePage extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };
  render() {
    /* if no prototype is currently selected,
     * we show the prototype dashboard
    */
    const router = this.props.router;
    return (
      <ReactCSSTransitionGroup
        transitionName="homepage-dashboard"
        transitionEnterTimeout={animationTime}
        transitionLeaveTimeout={animationTime}
      >
        {this.props.application.selectedPrototype ?
          <div className="page-container" key="homepage-anim">
            <Menu router={router} />
            <Workspace />
            <Footer />
          </div> :
          <div key="dashboard-anim">
            <PrototypeDashboard />
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
export default (connect(
  ({ application }) => ({ application }),
)(HomePage));
