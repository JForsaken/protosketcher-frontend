/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

import * as constants from '../components/constants';

/**
 * Absorbs event
 * @param  {syntheticEvent} event React synthetic event
 * @return {bool}       Event return value
 */
export default function absorbEvent(event) {
  const isPassive = event.type === constants.events.TOUCH_MOVE
    || event.type === constants.events.TOUCH_START
    || event.type === constants.events.TOUCH_END
    || event.type === constants.events.TOUCH_CANCEL;

  !isPassive && event.preventDefault && event.preventDefault();
  event.stopPropagation && event.stopPropagation();
  event.bubbles.false;

  const e = event.nativeEvent;
  !isPassive && e.preventDefault && event.preventDefault();
  e.stopPropagation && event.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;

  return false;
}
