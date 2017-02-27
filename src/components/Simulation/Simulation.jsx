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

    this.svgShapes = {};

    this.state = {
      pages: prototype.pages || null,
      currentPageId: selectedPage,
      shapes,
      texts,
      svgShapes: {},
      pagesToFetch,
      pagesWithShapesFetched: [],
      pagesWithTextsFetched: [],
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
    const { pagesWithShapesFetched, pagesWithTextsFetched } = this.state;

    // when the shapes were fetched for a certain page
    if (!isEqual(this.props.api.getShapes, nextProps.api.getShapes)) {
      this.setState({
        pagesWithShapesFetched: [...pagesWithShapesFetched, nextProps.api.getShapes.requestedPage],
      });
    // when the texts were fetched for a certain page
    } else if (!isEqual(this.props.api.getTexts, nextProps.api.getTexts)) {
      this.setState({
        pagesWithTextsFetched: [...pagesWithTextsFetched, nextProps.api.getTexts.requestedPage],
      });
    }
  }

  shapeDidMount(id, shapeSvg) {
    // intermediate container to prevent unnecessary renders
    this.svgShapes = { ...this.svgShapes, [id]: shapeSvg };

    // when all the svgs have been rendered
    if (Object.keys(this.svgShapes).length === Object.keys(this.state.shapes).length) {
      this.setState({ svgShapes: this.svgShapes });
    }
  }

  renderControls() {
    const { svgShapes, shapes } = this.state;

    return (
      // only show a control if its relative shape svg has been rendered
      Object.entries(shapes).map((item, i) => svgShapes[item[0]] &&
        <Control
          id={`control-${item[0]}`}
          controls={item[1].controls || []}
          shapeTypeId={item[1].shapeTypeId}
          color={item[1].color}
          rect={svgShapes[item[0]].getBBox()}
          posX={item[1].x}
          posY={item[1].y}
          key={`control-${i}`}
        />
      )
    );
  }

  renderSimulation() {
    const {
      shapes,
      pagesToFetch,
      pagesWithShapesFetched,
      pagesWithTextsFetched,
    } = this.state;

    // the loading is over when the pages to fetch have their shapes and texts
    if (!pagesToFetch.every(p => (pagesWithShapesFetched.includes(p) &&
                                  pagesWithTextsFetched.includes(p)))) {
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
            Object.entries(shapes).map((item, i) =>
              <Shape
                id={item[0]}
                onLoad={(id, svgShape) => this.shapeDidMount(id, svgShape)}
                color={item[1].color}
                path={item[1].path}
                posX={item[1].x}
                posY={item[1].y}
                key={i}
              />)
          }
        </svg>
        {this.renderControls()}
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
  ({ application, api }) => ({ application, api }),
  dispatch => ({
    actions: bindActionCreators({
      getShapes,
      getTexts,
    }, dispatch),
  })
)(Simulation);
