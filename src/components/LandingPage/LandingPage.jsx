/* Node modules */
import React, { Component } from 'react';

/* Components */
import LandingMenu from './LandingMenu/LandingMenu';

export default class LandingPage extends Component {
  render() {
    return (
      <div className="landing-page">
        <LandingMenu />

        <div className="container">
          <h1>Protosketcher</h1>
        </div>
      </div>
    );
  }
}
