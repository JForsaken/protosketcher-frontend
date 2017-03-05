/* Node modules */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { isEmpty } from 'lodash';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import FontAwesome from 'react-fontawesome';

/* Components */
import Menu from '../../common/Menu/Menu';
import PrototypeDashboard from '../PrototypeDashboard/PrototypeDashboard';
import Workspace from '../../Workspace/Workspace';
import Simulation from '../../Simulation/Simulation';

/* Actions */
import { toggleSimulation } from '../../../actions/application';

const animationTime = 300;

class HomePage extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  toggleSimulation() {
    this.props.actions.toggleSimulation();
  }

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

    if (!isEmpty(this.props.application.prototypes)) {
      // render simulation
      if (this.props.application.simulating) {
        return (
          <div className="page-container in-simulation" key="homepage-anim">
            <div className="back-to-edit-container">
              <Link to="" className="back-to-edit" onClick={() => this.toggleSimulation()}>
                <FontAwesome name="stop" />
                <FormattedMessage id="menu.backToEdit" />
              </Link>
            </div>
            <Simulation />
          </div>
        );
      }

      // render workspace
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
  dispatch => ({
    actions: bindActionCreators({
      toggleSimulation,
    }, dispatch),
  })
)(HomePage));
