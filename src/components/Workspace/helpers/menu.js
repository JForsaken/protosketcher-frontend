/* Node modules */
import React from 'react';
import { has } from 'lodash';

/* Components */
import RadialMenu from '../../common/RadialMenu/RadialMenu';

/* Constants */
import * as constants from '../../constants';
const menuItems = [
  constants.menuItems.CHANGE_COLOR,
  constants.menuItems.ADD_TEXT,
  constants.menuItems.SELECT_AREA,
];

const selectionMenuItems = [
  constants.menuItems.DRAG_SELECTION,
  constants.menuItems.COPY_SELECTION,
  constants.menuItems.DELETE_SELECTION,
];


/**
 * Toggles the radial menu's visibility
 * @param {Boolean} state Is true if visible
 * @param {Object} point First argument of params, the point where it will be displayed
 */
export function toggleMenu(state) {
  this.menuPending = false;
  if (this.state.currentPath) {
    this.setState({
      showMenu: state,
      currentPath: null,
    });
  } else {
    this.setState({
      showMenu: state,
    });
  }
}


/**
 * Does specific action according to the action selected on the radial menu
 * @param {Object} point The point where the radial menu is displayed
 */
export function doAction(point) {
  switch (this.props.application.workspace.action) {
    case constants.menuItems.CHANGE_COLOR.action:
      this.changeColor();
      break;
    case constants.menuItems.ADD_TEXT.action:
      this.setState({
        currentMode: constants.modes.TEXT,
        showSettingsPanel: false,
      });
      break;
    case constants.menuItems.SELECT_AREA.action:
      this.multiSelect(point);
      break;
    case constants.menuItems.DELETE_SELECTION.action: {
      const mementoId = this.memento.length;
      for (const uuid of this.state.selectedItems) {
        this.deleteSvgItem(uuid, mementoId);
      }
      this.setState({
        selectedItems: [],
        showSettingsPanel: false,
      });
      break;
    }
    case constants.menuItems.DRAG_SELECTION.action: {
    // when done dragging, patch all dragged items
      const { shapes, texts, currentPageId } = this.state;

      const lastActions = [];
      this.state.selectedItems.forEach((o) => {
        const { selectedPrototype, user } = this.props.application;
        const id = this.getRealId(o);

        if (has(shapes, o)) {
          const patch = { x: shapes[o].x, y: shapes[o].y };

          // for undo
          lastActions.push(this.extractMovedElementMoment(o, shapes[o], 'shape'));

          this.props.actions.patchShape(selectedPrototype, currentPageId, id, patch, user.token);
        } else if (has(texts, o)) {
          const patch = { x: texts[o].x, y: texts[o].y };

          // for undo
          lastActions.push(this.extractMovedElementMoment(o, texts[o], 'text'));

          this.props.actions.patchText(selectedPrototype, currentPageId, id, patch, user.token);
        }
      });

      this.memento.push(lastActions);

    // Save new original positions before draging and new central point of selection
      this.centralSelectionPoint = this.getCentralPointOfSelection();
      const items = this.updateSelectionOriginalPosition(this.state.selectedItems);
      this.setState({
        shapes: items.shapes,
        texts: items.texts,
      });
      break;
    }
    case constants.menuItems.COPY_SELECTION.action: {
      // when done copying, create all new items
      const { shapes, texts, currentPageId, selectedItems } = this.state;
      let items = { shapes, texts };

      selectedItems.forEach((o) => {
        const { selectedPrototype, user } = this.props.application;

        // to be able to undo the whole copy if we undo
        this.groupCopy = {
          group: clone(selectedItems),
          mementoId: this.memento.length,
        };

      // create the elements
        if (has(shapes, o)) {
          this.props.actions.createShape(selectedPrototype, currentPageId, shapes[o], user.token);
        } else if (has(texts, o)) {
          this.props.actions.createText(selectedPrototype, currentPageId, texts[o], user.token);
        }

        items = {
          ...this.updateSelectionOriginalPosition(selectedItems, items.shapes, items.texts),
        };
      });

    // clear clipboard
      this.selectedItemsCopied = false;
      this.copiedItesmsInit = false;
      this.shapesClipboard = {};
      this.textsClipboard = {};

      this.centralSelectionPoint = this.getCentralPointOfSelection();
      this.setState({ ...items });
      break;
    }
    default:
  }
}

/**
 * Render the correct radial menu depending on the selected items
 * @return {html} The html code of the rendered radial menu
 */
export function renderRadialMenu(currentPos) {
  const length = this.state.selectedItems.length;

  // General menu when no items are selected
  if (length === 0) {
    return (
      <RadialMenu
        items={menuItems}
        offset={Math.PI / 4}
        onLoad={(svgEl) => this.radialMenuDidMount(svgEl)}
        x={currentPos.x}
        y={currentPos.y}
      />
    );
  }

  // General menu for single and multiple selection
  return (
    <RadialMenu
      items={selectionMenuItems}
      offset={Math.PI / 4}
      onLoad={(svgEl) => this.selectionRadialMenuDidMount(svgEl)}
      x={currentPos.x}
      y={currentPos.y}
    />
  );
}
