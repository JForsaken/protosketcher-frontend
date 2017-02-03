/* Node modules */
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { injectIntl } from 'react-intl';

import { amber500, amber900 } from 'material-ui/styles/colors';
import IconPage from 'material-ui/svg-icons/av/add-to-queue';
import IconModal from 'material-ui/svg-icons/action/picture-in-picture';
import Avatar from 'material-ui/Avatar';
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';

injectTapEventPlugin();
@injectIntl

export default class AddPageMenu extends Component {
  render() {
    const buttonList = {
      items: [
        {
          primaryText: this.props.intl.messages['footer.addModalPage'],
          rightAvatar: <Avatar backgroundColor={amber500} icon={<IconModal />} />,
        },
        {
          primaryText: this.props.intl.messages['footer.addNormalPage'],
          rightAvatar: <Avatar backgroundColor={amber500} icon={<IconPage />} />,
        },
      ],
    };

    const floatingActionButtonProps = {
      backgroundColor: amber900,
    };

    return (
      <MuiThemeProvider>
        <SpeedDial
          hasBackdrop={false}
          floatingActionButtonProps={floatingActionButtonProps}
        >
          <BubbleList>
            {buttonList.items.map(
              (item, index) => (<BubbleListItem key={`buble${index}`} {...item} />)
            )}
          </BubbleList>
        </SpeedDial>
      </MuiThemeProvider>
    );
  }
}
