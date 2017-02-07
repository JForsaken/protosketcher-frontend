import iconPalette from '../../assets/images/icons/palette.png';
import iconSelect from '../../assets/images/icons/select-area.svg';
import iconText from '../../assets/images/icons/text-fields.png';

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
    color: '#F44336',
    icon: iconPalette,
    items: [
      {
        actionValue: '#F44336',
        color: '#F44336',
      },
      {
        actionValue: '#2196F3',
        color: '#2196F3',
      },
      {
        actionValue: '#4CAF50',
        color: '#4CAF50',
      },
      {
        actionValue: '#000000',
        color: '#000000',
      },
    ],
  },
  ADD_TEXT: {
    action: 'addText',
    color: '#4CAF50',
    icon: iconText,
    items: [],
  },
  SELECT_AREA: {
    action: 'selectArea',
    color: '#2196F3',
    flex: 2,
    icon: iconSelect,
    items: [],
  },
};
