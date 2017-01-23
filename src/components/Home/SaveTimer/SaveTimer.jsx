/* Node modules */
import React, { Component } from 'react';
import { isEqual, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* Actions */
import { save } from '../../../actions/api';

class SaveTimer extends Component {
  constructor(props) {
    super(props);

    this.infoTimeAlive = 1000;
    this.timeBetweenSaves = 10000;
    this.save = this.save.bind(this);
    this.hideInfo = this.hideInfo.bind(this);

    const savingInterval = setInterval(this.save, this.timeBetweenSaves);

    this.state = {
      savingInterval,
      isShowing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { saving } = nextProps.api;

    if (!isEqual(this.props.api.saving, saving)) {
      // if the last save was successful
      if (isEmpty(saving.error)) {
        const displayedInfoTimer = setTimeout(this.hideInfo, this.infoTimeAlive);

        this.setState({
          displayedInfoTimer,
          isShowing: true,
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.savingInterval);
    clearTimeout(this.state.displayedInfoTimer);
  }

  save() {
    this.props.actions.save();
  }

  hideInfo() {
    this.setState({ isShowing: false });
  }

  render() {
    return (
      <div>
        {this.state.isShowing && <p>Saving...</p>}
      </div>
    );
  }
}

export default connect(
  ({ api }) => ({ api }),
  dispatch => ({
    actions: bindActionCreators({
      save,
    }, dispatch),
  })
)(SaveTimer);
