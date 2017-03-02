/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

/**
 * Absorbs event
 * @param  {syntheticEvent} event React synthetic event
 * @return {bool}       Event return value
 */
export default function absorbEvent(event) {
  event.preventDefault && event.preventDefault();
  event.stopPropagation && event.stopPropagation();
  event.bubbles.false;

  const e = event.nativeEvent;
  e.preventDefault && event.preventDefault();
  e.stopPropagation && event.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;

  return false;
}
