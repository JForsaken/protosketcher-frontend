import iconPalette from '../../assets/images/icons/palette.svg';
import iconSelect from '../../assets/images/icons/select-area.svg';
import iconText from '../../assets/images/icons/text-fields.svg';
import dragSelection from '../../assets/images/icons/drag-selection.svg';
import copySelection from '../../assets/images/icons/copy-selection.svg';
import deleteSelection from '../../assets/images/icons/delete-selection.svg';

import { red500, blue500, green500, pink500, black } from 'material-ui/styles/colors';

/* Sizes */
export const TOP_MENU_HEIGHT = 50;
export const LEFT_MENU_WIDTH = 256;
export const RADIAL_MENU_SIZE = 150;

/* Events */
export const events = {
  MOUSE_LEAVE: 'mouseleave',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  MOUSE_MOVE: 'moudemove',
  TOUCH_START: 'touchstart',
  TOUCH_END: 'touchend',
  TOUCH_MOVE: 'touchmove',
  TOUCH_CANCEL: 'touchcancel',
  CONTEXT_MENU: 'contextmenu',
};

/* Workspace Modes */
export const modes = {
  TEXT: 'text',
  CREATE_CONTROL: 'createControl',
};

/* Workspace paths */
export const paths = {
  SEGMENT_LENGTH: 4,
  MIN_PATH_LENGTH: 3,
  TEXT_OFFSET_Y: 27,
  TEXT_DEFAULT_SIZE: 24,
};

/* Copy-Paste repositioning */
export const COPY_PASTE_OFFSET = 20;

/* Menu Items */
export const menuItems = {
  CHANGE_COLOR: {
    action: 'changeColor',
    color: pink500,
    icon: iconPalette,
    items: [
      {
        actionValue: red500,
        color: red500,
      },
      {
        actionValue: blue500,
        color: blue500,
      },
      {
        actionValue: green500,
        color: green500,
      },
      {
        actionValue: black,
        color: black,
      },
    ],
  },
  ADD_TEXT: {
    action: 'addText',
    color: green500,
    icon: iconText,
    items: [],
  },
  SELECT_AREA: {
    action: 'selectArea',
    color: blue500,
    flex: 2,
    icon: iconSelect,
    items: [],
    closeMenuOnLeave: true,
  },
  DRAG_SELECTION: {
    action: 'dragSelection',
    color: blue500,
    flex: 2,
    icon: dragSelection,
    items: [],
    closeMenuOnLeave: true,
  },
  COPY_SELECTION: {
    action: 'copySelection',
    color: green500,
    icon: copySelection,
    items: [],
    closeMenuOnLeave: true,
  },
  DELETE_SELECTION: {
    action: 'deleteSelection',
    color: red500,
    icon: deleteSelection,
    items: [],
  },
};


/* Keycodes */
export const keys = {
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  ENTER: 'Enter',
  C: 'c',
  Y: 'y',
  V: 'v',
  Z: 'z',
  MOUSE_LEFT: 1,
  MOUSE_RIGHT: 3,
};

/* Action Types */
export const actionTypes = {
  CHANGE_PAGE: 'changePage',
  SHOW: 'show',
  HIDE: 'hide',
};

/* Action Types */
export const pageTypes = {
  MODAL: 'modal',
  PAGE: 'page',
};

/* Landing page */
export const landingPage = {
  PARALLAX: {
    strength: 400,
  },
};
