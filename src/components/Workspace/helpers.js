export function changeColor() {
  if (this.props.application.workspace.actionValue) {
    this.props.actions.updateWorkspace({
      drawColor: this.props.application.workspace.actionValue,
    });
  }
}
