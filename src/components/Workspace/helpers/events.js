/* Node modules */
import { isEmpty, clone, has } from 'lodash';

/* Utils */
import absorbEvent from '../../../utils/events.js';

/* Constants */
import * as constants from '../../constants';
const MAX_TOUCH_DISTANCE = 15;


/**
 * On starting event
 * @param {Object} e event
 */
export function onStartingEvent(e) {
  absorbEvent(e);

  // Add text if there was one being created
  if (this.state.currentMode === constants.modes.TEXT) {
    this.createText();
  }

  const point = this.getPointFromEvent(e, constants.events.TOUCH_START);
  this.props.actions.updateWorkspace({
    currentPos: {
      x: point.x,
      y: point.y,
    },
  });

  // Right mouse press
  if (e.type === constants.events.MOUSE_DOWN
      && e.nativeEvent.which === constants.keys.MOUSE_RIGHT) {
    this.toggleMenu(true);
  }

  // Left mouse press
  else {
    // Set timer for menu
    this.touchTimer = setTimeout(() => this.toggleMenu(true), 500);

    this.menuPending = true;

    // Start drawing
    this.setState({
      previousPoint: point,
      currentPath: {
        pathString: '',
        position: point,
      },
    });
  }
}


/**
 * On ending event
 * @param {Object} e event
 */
export function onEndingEvent(e) {
  absorbEvent(e);

  // Add text if there was one being created
  if (this.state.currentMode === constants.modes.TEXT) {
    this.createText();
  }

  const point = this.getPointFromEvent(e, constants.events.TOUCH_END);

  // Finish drawing by adding last point
  if (this.state.currentPath && this.state.currentPath.pathString
      && isEmpty(this.state.selectedItems)) {
    this.createShape(point);
  }

  if (!(e.type === constants.events.MOUSE_LEAVE
        && e.target.classList.contains('workspace-container'))) {
    this.toggleMenu(false);
    this.props.actions.updateWorkspace({ action: null });
  }

  // stops short touches from firing the event
  if (this.touchTimer) {
    clearTimeout(this.touchTimer);
  }
  if (!this.selectionDirty && !this.props.application.workspace.action) {
    this.setState({
      selectedItems: [],
    });
  }
  this.selectionDirty = false;


  this.doAction(point);
  this.setState({
    selectingRect: null,
  });
}


/**
 * On moving event
 * @param {Object} e event
 */
export function onMovingEvent(e) {
  absorbEvent(e);

  // Get event position
  let pointer = e;
  if (e.type === constants.events.TOUCH_MOVE) {
    pointer = e.changedTouches.item(0);

    // HACK : The touchmove event is not fired on the svg : we have to handle it here
    const el = document.elementFromPoint(pointer.clientX, pointer.clientY);
    if (el.nodeName === 'path' && el.className) {
      const classes = el.className.baseVal.split('-');
      if (classes[0] === 'action') {
        // Move on a menu item
        if (classes.length === 2 && classes[1] !== this.props.application.workspace.action) {
          this.props.actions.updateWorkspace({
            action: classes[1],
            actionValue: null,
          });
        }

        // Move on a sub-menu item
        else if (classes.length > 2
                 && classes[2] !== this.props.application.workspace.actionValue) {
          this.props.actions.updateWorkspace({
            action: classes[1],
            actionValue: classes[2],
          });
        }
      } else if (classes[0] === 'hover') {
        this.props.actions.updateWorkspace({
          actionValue: null,
        });
      }
    }

    // Move in the center of the menu
    else if (el.nodeName === 'circle' && this.props.application.workspace.action) {
      this.props.actions.updateWorkspace({ action: null });
    }
  }

  const point = {
    x: pointer.clientX - constants.LEFT_MENU_WIDTH,
    y: pointer.clientY - constants.TOP_MENU_HEIGHT,
  };

  const { currentPos } = this.props.application.workspace;
  // Determine if we draw or wait for the menu
  if (this.menuPending === true) {
    let deltaX = 0;
    let deltaY = 0;

    deltaX = Math.abs(point.x - currentPos.x);
    deltaY = Math.abs(point.y - currentPos.y);

    // Add error margin for small moves
    if (deltaX > MAX_TOUCH_DISTANCE || deltaY > MAX_TOUCH_DISTANCE) {
      // stops move (draw action) from firing the event
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
      }

      // Clear selection
      this.setState({
        selectedItems: [],
      });

      this.menuPending = false;

      // Add initial point
      this.computeSvgPath(this.state.previousPoint, 'M');
    }
  }
  const { action } = this.props.application.workspace;

  // If we are doing a multi selection
  if (action === constants.menuItems.SELECT_AREA.action) {
    // Selecting
    this.setState({
      selectingRect: {
        x: currentPos.x,
        y: currentPos.y,
        width: point.x - currentPos.x,
        height: point.y - currentPos.y,
      },
    });
  }

  // If we are dragging items
  else if (action === constants.menuItems.DRAG_SELECTION.action) {
    const translation = {
      x: point.x - this.centralSelectionPoint.x,
      y: point.y - this.centralSelectionPoint.y,
    };
    this.dragItems(translation);
  }

  // If we are dragging a copy
  else if (action === constants.menuItems.COPY_SELECTION.action) {
    if (this.selectedItemsCopied === false) {
      this.copySelectedItems();
    } else if (this.copiedItesmsInit === false) {
      this.copiedItesmsInit = this.state.selectedItems.every(id => {
        const svgPool = {
          ...this.svgShapes,
          ...this.svgTexts,
        };
        const itemsPool = {
          ...this.state.shapes,
          ...this.state.texts,
        };
        return has(svgPool, id) && has(itemsPool, id);
      });
      if (this.copiedItesmsInit) {
        const items = this.updateSelectionOriginalPosition(this.state.selectedItems);
        this.setState({
          shapes: items.shapes,
          texts: items.texts,
        });
        this.centralSelectionPoint = this.getCentralPointOfSelection();
      }
    } else {
      const translation = {
        x: point.x - this.centralSelectionPoint.x,
        y: point.y - this.centralSelectionPoint.y,
      };
      this.dragItems(translation);
    }
  }

  // If we are drawing
  else if (!this.menuPending && this.state.currentPath && this.state.currentPath.pathString) {
    if (this.arePointsFeedable(point)) {
      this.computeSvgPath(point, 'L');
      this.setState({
        previousPoint: point,
      });
    }
  }
}


/**
 * On key down event
 * @param {Object} e event
 */
export function onKeyDownEvent(e) {
  if (e.key === constants.keys.DELETE || e.key === constants.keys.BACKSPACE) {
    this.state.selectedItems.forEach(o => this.deleteSvgItem(o));
    this.setState({
      selectedItems: [],
    });
  } else if (e.key === constants.keys.ENTER) {
    this.createText();
  } else if (e.key === constants.keys.C && e.ctrlKey === true) {
    this.clipboard = clone(this.state.selectedItems);
  } else if (e.key === constants.keys.V && e.ctrlKey === true) {
    this.pasteClipboard();
    this.clipboard = [];
  }
}

/**
 * Gives the position of an event
 * @param {Object} e event
 * @param {String} type The type of the event
 * @returns {Object} The position of the event
 */
export function getPointFromEvent(e, type) {
  let pointer = e;
  if (e.type === type) {
    pointer = e.changedTouches.item(0);
  }
  const point = {
    x: pointer.clientX - constants.LEFT_MENU_WIDTH,
    y: pointer.clientY - constants.TOP_MENU_HEIGHT,
  };
  return point;
}
