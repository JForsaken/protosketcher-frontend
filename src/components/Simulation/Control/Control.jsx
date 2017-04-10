/* Node modules */
import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { isEmpty, forEach, intersection } from 'lodash';
import { bindActionCreators } from 'redux';

/* Actions */
import {
  selectPage,
  showElements,
  hideElements } from '../../../actions/application';

/* CONSTANTS */
import { actionTypes, pageTypes } from '../../constants';

class Control extends Component {
  static propTypes = {
    controls: PropTypes.object.isRequired,
    shapeTypeId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
  };

  componentWillMount() {
    this.extractControlData();
  }

  onButtonClick() {
    // select the page
    if (!isEmpty(this.affectedPages)) {
      if (this.affectedPages[0].type === pageTypes.MODAL) {
        this.props.onClickModal(this.affectedPages[0].pageId);
      } else {
        this.props.actions.selectPage(this.affectedPages[0].pageId);
      }
    }

    // show the elements
    if (!isEmpty(this.elementsToShow)) {
      this.props.actions.showElements(this.elementsToShow);
    }

    // hide the elements
    if (!isEmpty(this.elementsToHide)) {
      this.props.actions.hideElements([
        ...this.props.application.simulation.hiddenElements,
        ...this.elementsToHide,
      ]);
    }
  }

  getControl() {
    let control = null;
    const { posX, posY } = this.props;

    // the position where the control should be placed
    // Width and height need to be hardcoded, because without the ref, we can't get them
    // and the ref is never available on first render
    const width = 500;
    const height = 50;
    const padding = 10;
    const x = posX;
    const y = posY;

    const controlStyle = {
      left: x,
      top: y,
      width,
      height,
      padding,
    };

    switch (this.shapeType) {
      case 'button':
        control = (
          <path
            id={this.props.id}
            className="simulation-control simulation-btn"
            ref={svgShape => (this.svgShape = svgShape)}
            onClick={() => this.onButtonClick()}
            d={this.props.path}
            stroke="transparent"
            fill="transparent"
            transform={`translate(${posX} ${posY})`}
          />
        );
        break;

      case 'textbox':
        control = (
          <foreignObject>
            <FormControl
              type="text"
              className="simulation-control simulation-textbox"
              style={controlStyle}
            />
          </foreignObject>
        );
        break;

      case 'line':
        break;

      default:
        break;
    }

    return control;
  }

  extractControlData() {
    const { shapeTypes } = this.props.api.getShapeTypes;
    const { actionTypes: types } = this.props.api.getActionTypes;
    // in order to have the pageTypes already mapped as { id: value }
    const allPageTypes = this.props.api.getPageTypes.pageTypes;
    const { pages } = this.props.application.prototypes[this.props.application.selectedPrototype];

    const affectedPages = [];
    let toShow = [];
    let toHide = [];

    let pageTypeId;

    forEach(this.props.controls, (control) => {
      switch (types[control.actionTypeId]) {
        case actionTypes.CHANGE_PAGE:
          // Check which type of page
          pageTypeId = pages[control.affectedPageId].pageTypeId;
          if (allPageTypes[pageTypeId] === pageTypes.MODAL) {
            affectedPages.push({ pageId: control.affectedPageId, type: pageTypes.MODAL });
          } else {
            affectedPages.push({ pageId: control.affectedPageId, type: pageTypes.PAGE });
          }
          break;
        case actionTypes.SHOW:
          toShow = toShow.concat(control.affectedShapeIds, control.affectedTextIds);
          break;
        case actionTypes.HIDE:
          toHide = toHide.concat(control.affectedShapeIds, control.affectedTextIds);
          break;
        default: break;
      }
      return true;
    });

    // ids found in both toShow and toHide
    const intersect = intersection(toShow, toHide);

    // extracted data
    this.affectedPages = affectedPages;
    this.shapeType = shapeTypes[this.props.shapeTypeId];
    this.elementsToShow = toShow.filter(o => !intersect.includes(o));
    this.elementsToHide = toHide.filter(o => !intersect.includes(o));
  }

  render() {
    return this.getControl();
  }
}

export default connect(
  ({ application, api }) => ({ application, api }),
  dispatch => ({
    actions: bindActionCreators({
      selectPage,
      showElements,
      hideElements,
    }, dispatch),
  })
)(Control);
