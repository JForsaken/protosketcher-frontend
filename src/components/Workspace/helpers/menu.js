/* Node modules */
import { has } from 'lodash';

/* Constants */
import * as constants from '../../constants';


/**
 * Toggles the radial menu's visibility
 * @param {Boolean} state Is true if visible
 * @param {Object} point First argument of params, the point where it will be displayed
 */
export function toggleMenu(state, ...params) {
  let menu = null;
  menu = this.state.selectedItems.length > 0 ? this.selectionRadialMenuEl : this.radialMenuEl;
  let point;
  if (params.length) {
    point = params[0];
  } else {
    point = {
      x: this.props.application.workspace.currentPos.x,
      y: this.props.application.workspace.currentPos.y,
    };
  }

  if (state) {
    menu.style.left = point.x - constants.RADIAL_MENU_SIZE;
    menu.style.top = point.y - constants.RADIAL_MENU_SIZE;
  } else {
    menu.style.left = -9999;
  }
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
      });
      break;
    case constants.menuItems.SELECT_AREA.action:
      this.multiSelect(point);
      break;
    case constants.menuItems.DELETE_SELECTION.action:
      for (const uuid of this.state.selectedItems) {
        this.deleteSvgItem(uuid);
      }
      this.setState({
        selectedItems: [],
      });
      break;
    case constants.menuItems.DRAG_SELECTION.action: {
    // when done dragging, patch all dragged items
      const { shapes, texts, currentPageId } = this.state;
      this.state.selectedItems.forEach((o) => {
        const { selectedPrototype, user } = this.props.application;
        const id = this.getRealId(o);

        if (has(shapes, o)) {
          const patch = { x: shapes[o].x, y: shapes[o].y };
          this.props.actions.patchShape(selectedPrototype, currentPageId, id, patch, user.token);
        } else if (has(texts, o)) {
          const patch = { x: texts[o].x, y: texts[o].y };
          this.props.actions.patchText(selectedPrototype, currentPageId, id, patch, user.token);
        }
      });

    // Save new original positions before draging
      const items = this.updateSelectionOriginalPosition(this.state.selectedItems);
      this.setState({
        shapes: items.shapes,
        texts: items.texts,
      });
      break;
    }
    case constants.menuItems.COPY_SELECTION.action: {
    // when done copying, create all new items
      const { shapes, texts, currentPageId } = this.state;
      this.state.selectedItems.forEach((o) => {
        const { selectedPrototype, user } = this.props.application;

      // create the elements
        if (has(shapes, o)) {
          this.props.actions.createShape(selectedPrototype, currentPageId, shapes[o], user.token);
        } else if (has(texts, o)) {
          this.props.actions.createText(selectedPrototype, currentPageId, texts[o], user.token);
        }
      });

    // clear clipboard
      this.selectedItemsCopied = false;
      this.copiedItesmsInit = false;
      this.clipboard = [];
      break;
    }
    default:
  }
}
