import iconPalette from '../../assets/images/icons/palette.png';
import iconSelect from '../../assets/images/icons/select-area.svg';
import iconText from '../../assets/images/icons/text-fields.png';

import { red500, blue500, green500, black } from 'material-ui/styles/colors';

/* Sizes */
export const TOP_MENU_HEIGHT = 50;
export const LEFT_MENU_WIDTH = 0;
export const RADIAL_MENU_SIZE = 150;
export const PAGE_WIDTH = 1024;
export const PAGE_HEIGHT = 768;
export const MODAL_WIDTH = 512;
export const MODAL_HEIGHT = 256;
export const PORTRAIT_WIDTH = 320;
export const PORTRAIT_HEIGHT = 480;
export const PORTRAIT_MODAL_WIDTH = 300;
export const PORTRAIT_MODAL_HEIGHT = 200;


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
};

/* Workspace paths */
export const paths = {
  SEGMENT_LENGTH: 10,
  MIN_PATH_LENGTH: 3,
  TEXT_OFFSET_Y: 27,
  TEXT_DEFAULT_SIZE: 24,
};


/* Menu Items */
export const menuItems = {
  CHANGE_COLOR: {
    action: 'changeColor',
    color: red500,
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
  },
};


/* Keycodes */
export const keys = {
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  ENTER: 'Enter',
  C: 'c',
  D: 'd',
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
