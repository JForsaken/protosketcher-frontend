/* Node modules */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { filter, has, isEqual } from 'lodash';

/* Components */
import Footer from '../common/Footer/Footer';
import Shape from '../Workspace/Shape/Shape';
import Control from './Control/Control';

/* Actions */
import { getShapes, getTexts } from '../../actions/api';

class Simulation extends Component {

  constructor(props, context) {
    super(props, context);

    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];
    const { shapes, texts } = prototype.pages[selectedPage];

    // the pages that still need to be fetched in order to be cached
    const pagesToFetch = filter(Object.keys(prototype.pages),
                                p => (!has(prototype.pages[p], 'shapes') &&
                                      !has(prototype.pages[p], 'texts')));

    this.state = {
      pages: prototype.pages || null,
      currentPageId: selectedPage,
      shapes,
      texts,
      pagesToFetch,
    };
  }

  componentDidMount() {
    const { selectedPrototype, user } = this.props.application;

    // fetch all the needed info for the pages that aren't cached yet
    this.state.pagesToFetch.forEach((p) => {
      this.props.actions.getShapes(selectedPrototype, p, user.token);
      this.props.actions.getTexts(selectedPrototype, p, user.token);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { prototypes, selectedPrototype } = this.props.application;
    const prototype = prototypes[selectedPrototype];

    console.log('will receive', nextProps);
    if (!isEqual(prototype.pages, nextProps.application.prototypes[selectedPrototype].pages)) {
      console.log('changement', nextProps);
    }
  }

  renderSimulation() {
    console.log(this.state.shapes, this.state.texts);
    if (this.state.shapes && this.state.texts) {
      console.log('size', Object.keys(this.state.shapes));
      return (
        <div id="workspace">
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
                  color={item[1].color}
                  path={item[1].path}
                  posx={item[1].x}
                  posy={item[1].y}
                  key={i}
                />)
            }
          </svg>
          {
            Object.entries(this.state.shapes).map((item, i) =>
              <Control
                id={item[0]}
                controls={item[1].controls || []}
                shapeTypeId={item[1].shapeTypeId}
                color={item[1].color}
                // TODO: must find a way to get ref instead of document.getElementById
                rect={document.getElementById(item[0]).getBBox()}
                posx={item[1].x}
                posy={item[1].y}
                key={i}
              />)
        }
        </div>
      );
    }

    return (
      <div>
        <div className="backdrop"></div>
        <div className="loading">
          <span>Loading simulation</span>
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
  dispatch => ({
    actions: bindActionCreators({
      getShapes,
      getTexts,
    }, dispatch),
  })
)(Simulation);
