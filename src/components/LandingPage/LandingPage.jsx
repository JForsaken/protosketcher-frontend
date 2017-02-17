/* Node modules */
import React, { Component } from 'react';

/* Components */
import LandingMenu from './LandingMenu/LandingMenu';
import Slideshow from './Slideshow/Slideshow';

export default class LandingPage extends Component {
  render() {
    return (
      <div className="landing-page">
        <LandingMenu />
        <div className="container page-container">
          <div className="slideshow">
            <h1>Protosketcher</h1>
          </div>
          <Slideshow />
        </div>
      </div>
    );
  }
}
