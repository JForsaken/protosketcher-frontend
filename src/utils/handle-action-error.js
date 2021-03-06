import { SHOW_ERROR } from '../actions/constants';

export default function handleActionError(dispatch, error, source) {
  return dispatch({
    type: SHOW_ERROR,
    source,
    payload: error,
  });
}
