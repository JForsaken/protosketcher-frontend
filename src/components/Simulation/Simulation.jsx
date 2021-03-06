/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { filter, has, isEqual, size } from 'lodash';

/* Components */
import Shape from '../Workspace/Shape/Shape';
import Text from '../Workspace/Text/Text';
import Control from './Control/Control';

/* Actions */
import { getShapes, getTexts } from '../../actions/api';
import { hideElements } from '../../actions/application';

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

    this.isModal = props.isModal;
    // If this Simulation is a Modal, hard assign the Page
    if (this.isModal) {
      selectedPage = props.pageId;
    }
    const { shapes, texts } = prototype.pages[selectedPage];

    this.itemsList = {};

    this.state = {
      pages: prototype.pages || null,
      currentPageId: selectedPage,
      shapes,
      texts,
      pagesToFetch,
      pagesWithShapesFetched: [],
      pagesWithTextsFetched: [],
      modalId: '',
      refsLoaded: false,
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
        const shapes = page.shapes || {};
        const texts = page.texts || {};

        elementsToHide = Object.keys(shapes).filter(o => !shapes[o].visible)
                               .concat(Object.keys(texts).filter(o => !texts[o].visible))
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

      // If modal is opened and we change the page, close the modal
      if (this.state.modalId) {
        this.closeModal();
      }

      if (prototype) {
        const { shapes, texts } = prototype.pages[selectedPage];

        this.itemsList = {};

        this.setState({
          shapes,
          texts,
          refsLoaded: false,
        });
      }
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

  shapeDidLoad() {
    // All refs are needed to show controls, so we wait to have them all to set state
    if (size(this.itemsList) >= size(this.state.shapes) && !this.state.refsLoaded) {
      this.setState({ refsLoaded: true });
    }
  }

  renderShapes() {
    const { hiddenElements } = this.props.application.simulation;

    return (
      Object.entries(this.state.shapes)
            .filter(item => !hiddenElements.includes(item[0]))
            .map((item, i) => (
              <Shape
                id={item[0]}
                ref={(shape) => {
                  this.itemsList[item[0]] = shape;
                  this.shapeDidLoad();
                }}
                color={item[1].color}
                path={item[1].path}
                posX={item[1].x}
                posY={item[1].y}
                key={i}
              />
            )
          )
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
                ref={(text) => { this.itemsList[item[0]] = text; }}
                posX={item[1].x}
                posY={item[1].y}
                size={item[1].fontSize}
                content={item[1].content}
                key={i}
              />)
    );
  }

  renderControls() {
    const { shapes } = this.state;

    return (
      // only show a control if its relative shape svg has been rendered
      Object.entries(shapes).map((item) => {
        if (this.itemsList[item[0]]) {
          const component = this.itemsList[item[0]].getWrappedInstance();
          let element;
          // Check if component is Shape or Text
          if (component.svgShape) {
            element = component.svgShape;
          } else {
            element = component.svgText;
          }
          return (
            <Control
              id={`control-${item[0]}`}
              controls={item[1].controls || {}}
              shapeTypeId={item[1].shapeTypeId}
              color={item[1].color}
              posX={item[1].x}
              posY={item[1].y}
              path={item[1].path}
              key={`control-${item[0]}`}
              rect={element.getBBox()}
              onClickModal={(pageId) => this.showModal(pageId)}
            />
          );
        }
        return null;
      })
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

    const { prototypes, selectedPrototype, selectedPage } = this.props.application;
    const prototype = prototypes[selectedPrototype];
    let prototypeType = '';
    if (prototype && prototype.pages && selectedPage) {
      const { pageTypeId } = prototype.pages[selectedPage];
      const { pageTypes: allPageTypes } = this.props.api.getPageTypes;

      if (allPageTypes) {
        this.pageType = allPageTypes[pageTypeId];
        this.isMobile = prototype.isMobile;
      }
      prototypeType = (this.isMobile) ? 'mobile' : 'desktop';
    }


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
      <div className={`workspace workspace-${this.pageType} ${prototypeType}`}>
        {this.state.modalId && this.renderModal()}
        <svg height="100%" width="100%">
          <filter className="dropshadowAlpha" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {this.renderShapes()}
          {this.renderTexts()}
          {this.state.refsLoaded && this.renderControls()}
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
        {this.renderSimulation()}
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
