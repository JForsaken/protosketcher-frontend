/* Node modules */
import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { FormattedMessage } from 'react-intl';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  handleToggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const style = {
      position: 'absolute',
      overflow: 'visible',
    };
    return (
      <div>
        <Drawer open={this.state.isOpen} containerStyle={style}>
          <Button
            className="drawer-toggle vertical-text"
            onClick={() => this.handleToggle()}
          >
            <FontAwesome name="caret-down" />
            <FormattedMessage id="sidemenu.toggle" />
          </Button>
        </Drawer>
      </div>
    );
  }
}
