import iconPalette from '../../assets/images/icons/palette.png';
import iconSelect from '../../assets/images/icons/select-area.svg';
import iconText from '../../assets/images/icons/text-fields.png';

import { red500, blue500, green500, black } from 'material-ui/styles/colors';

/* Sizes */
export const TOP_MENU_HEIGHT = 50;
export const LEFT_MENU_WIDTH = 0;

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
  CONTEXT_MENU: 'contextmenu',
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
export const keycodes = {
  DEL_KEY: 46,
  C_KEY: 67,
  D_KEY: 68,
};
