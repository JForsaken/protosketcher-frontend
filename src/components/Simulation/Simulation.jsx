/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Components */
import Footer from '../common/Footer/Footer';
import Shape from './Shape/Shape';

class Simulation extends Component {

  constructor(props, context) {
    super(props, context);

    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];
    const { shapes, texts } = prototype.pages[selectedPage];

    this.state = {
      pages: prototype.pages || null,
      currentPageId: selectedPage,
      shapes,
      texts,
    };
  }

  renderSimulation() {
    console.log('my state', this.state);
    if (this.state.shapes && this.state.texts) {
      return (
        <div
          id="workspace"
        >
          <svg height="100%" width="100%">
            <filter id="dropshadow" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {
              Object.entries(this.state.shapes).map((item, i) =>
                <Shape
                  id={item[0]}
                  simulating
                  color={item[1].color}
                  path={item[1].path}
                  posx={item[1].x}
                  posy={item[1].y}
                  key={i}
                />)
            }
          </svg>
        </div>
      );
    }

    return (
      <div>
        <div className="backdrop"></div>
        <div className="loading">
          <span>Loading workspace</span>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        id="workspace-container"
        ref={div => div && div.focus()}
        className="workspace-container"
        tabIndex="0"
        onKeyDown={this.onKeyDownEvent}
      >
        {this.renderSimulation()}
        <Footer pages={this.state.pages || {}} selectedPage={this.state.currentPageId || ''} />
      </div>
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
)(Simulation);
