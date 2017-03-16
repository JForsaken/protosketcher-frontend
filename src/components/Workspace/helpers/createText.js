import uuidV1 from 'uuid/v1';

import * as constants from '../../constants';

export function createText() {
  const value = this.textEdit.value;

  // Only create a text if it is not empty
  if (value) {
    const uuid = uuidV1();
    const { currentPos } = this.props.application.workspace;

    const text = {
      content: value,
      x: currentPos.x,
      y: currentPos.y + constants.paths.TEXT_OFFSET_Y,
      fontSize: this.state.fontSize,
      uuid,
    };

    this.setState({
      currentPath: null,
      previousPoint: null,
      currentMode: null,
      texts: {
        ...this.state.texts,
        [uuid]: text,
      },
    });

    this.props.actions.createText(this.props.application.selectedPrototype,
      this.state.currentPageId, text, this.props.application.user.token);
  }

  else {
    this.setState({
      currentPath: null,
      previousPoint: null,
      currentMode: null,
    });
  }
}
