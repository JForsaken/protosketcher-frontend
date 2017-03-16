/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { filter, has, isEqual, map } from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/* Components */
import Shape from '../Workspace/Shape/Shape';
import Text from '../Workspace/Text/Text';
import Control from './Control/Control';

/* Actions */
import { getShapes, getTexts } from '../../actions/api';
import { hideElements } from '../../actions/application';

/* CONSTANTS */
import { MODAL_WIDTH, MODAL_HEIGHT, PAGE_WIDTH, PAGE_HEIGHT } from '../constants';

const animationTime = 200;

class Simulation extends Component {

  constructor(props, context) {
    super(props, context);

    const { prototypes, selectedPrototype } = this.props.application;
    let { selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];

    // the pages that still need to be fetched in order to be cached
    const pagesToFetch = filter(Object.keys(prototype.pages),
                                p => (!has(prototype.pages[p], 'shapes') &&
                                      !has(prototype.pages[p], 'texts')));

    this.svgShapes = {};
    this.isModal = props.isModal;
    // If this Simulation is a Modal, hard assign the Page
    if (this.isModal) {
      selectedPage = props.pageId;
    }
    const { shapes, texts } = prototype.pages[selectedPage];

    this.state = {
      pages: prototype.pages || null,
      currentPageId: selectedPage,
      shapes,
      texts,
      svgShapes: {},
      pagesToFetch,
      pagesWithShapesFetched: [],
      pagesWithTextsFetched: [],
      modalId: '',
    };
  }

  componentDidMount() {
    const { selectedPrototype, user } = this.props.application;

    // fetch all the needed info for the pages that aren't cached yet
    this.state.pagesToFetch.forEach((p) => {
      this.props.actions.getShapes(selectedPrototype, p, user.token);
      this.props.actions.getTexts(selectedPrototype, p, user.token);
    });

    // reset all hidden elements when the simulation first starts
    if (!this.isModal) {
      const { prototypes } = this.props.application;
      let elementsToHide = [];

      // get all the elements that start the simulation as hidden
      Object.keys(prototypes[selectedPrototype].pages).forEach((p) => {
        const page = prototypes[selectedPrototype].pages[p];
        elementsToHide = map(page.shapes, (o, k) => (!o.visible ? k : false))
          .concat(map(page.texts, (o, k) => (!o.visible ? k : false)))
          .concat(elementsToHide);
      });

      this.props.actions.hideElements(elementsToHide);
    }
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
    } else if (!isEqual(nextProps.application.selectedPage, this.props.application.selectedPage)) {
      const { prototypes, selectedPrototype, selectedPage } = nextProps.application;
      const prototype = prototypes[selectedPrototype];
      const { shapes, texts } = prototype.pages[selectedPage];

      this.svgShapes = {};
      this.setState({
        shapes,
        texts,
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

  showModal(pageId) {
    this.setState({ modalId: pageId });
  }

  checkClickBackdrop(e) {
    // If we did click the backdrop, close the modal
    if (e.target === this.container) {
      this.props.closeModal();
    }
  }

  closeModal() {
    this.setState({ modalId: '' });
  }

  renderShapes() {
    const { hiddenElements } = this.props.application.simulation;
    let posX;
    let posY;

    return (
      Object.entries(this.state.shapes)
            .filter(item => !hiddenElements.includes(item[0]))
            .map((item, i) => {
              if (this.isModal) {
                posX = (item[1].x / PAGE_WIDTH) * MODAL_WIDTH;
                posY = (item[1].y / PAGE_HEIGHT) * MODAL_HEIGHT;
              } else {
                posX = item[1].x;
                posY = item[1].y;
              }

              return (
                <Shape
                  id={item[0]}
                  onLoad={(id, svgShape) => this.shapeDidMount(id, svgShape)}
                  color={item[1].color}
                  path={item[1].path}
                  posX={posX}
                  posY={posY}
                  key={i}
                />
              );
            })
    );
  }

  renderTexts() {
    const { hiddenElements } = this.props.application.simulation;

    return (
      Object.entries(this.state.texts)
            .filter(item => !hiddenElements.includes(item[0]))
            .map((item, i) =>
              <Text
                id={item[0]}
                posX={item[1].x}
                posY={item[1].y}
                size={item[1].fontSize}
                content={item[1].content}
                key={i}
              />)
    );
  }

  renderControls() {
    const { svgShapes, shapes } = this.state;

    return (
      // only show a control if its relative shape svg has been rendered
      Object.entries(shapes).map((item, i) => svgShapes[item[0]] &&
        <Control
          id={`control-${item[0]}`}
          controls={item[1].controls || {}}
          shapeTypeId={item[1].shapeTypeId}
          color={item[1].color}
          rect={svgShapes[item[0]].getBBox()}
          posX={item[1].x}
          posY={item[1].y}
          path={item[1].path}
          key={`control-${i}`}
          onClickModal={(pageId) => this.showModal(pageId)}
        />
      )
    );
  }

  renderModal() {
    return (
      <Simulation
        isModal="true"
        pageId={this.state.modalId}
        application={this.props.application}
        api={this.props.api}
        actions={this.props.actions}
        closeModal={() => this.closeModal()}
      />
    );
  }

  renderSimulation() {
    const {
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
            <FormattedMessage id="simulation.loading" />
            <div className="spinner" />
          </div>
        </div>
      );
    }

    return (
      <div className="workspace">
        {this.state.modalId && this.renderModal()}
        <svg height="100%" width="100%">
          <filter className="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {this.renderShapes()}
          {this.renderTexts()}
          {this.renderControls()}
        </svg>
      </div>
    );
  }

  render() {
    return (
      <div
        ref={div => { this.container = div; }}
        className={`simulation-container${(this.isModal) ? ' modalSimulation' : ''}`}
        tabIndex="0"
        onKeyDown={this.onKeyDownEvent}
        onClick={(this.isModal) ? (e) => this.checkClickBackdrop(e) : ''}
      >
        <ReactCSSTransitionGroup
          transitionName="simulation"
          transitionAppear
          transitionEnter={false}
          transitionLeave={false}
          transitionAppearTimeout={animationTime}
        >
          {this.renderSimulation()}
        </ReactCSSTransitionGroup>
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
      hideElements,
    }, dispatch),
  })
)(Simulation);
