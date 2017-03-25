/* Node modules */
import React, { Component, PropTypes } from 'react';

/* Components */
import Menu from '../common/Menu/Menu';
import Slideshow from './Slideshow/Slideshow';
import Content from './Content/Content';


export default class LandingPage extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="landing-page">
        <Menu router={this.props.router} />
        <div className="container page-container">
          <Slideshow />
          <Content />
        </div>
      </div>
    );
  }
}
