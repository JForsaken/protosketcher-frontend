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
          onClick: this.props.addPage,
        },
        {
          primaryText: this.props.intl.messages['footer.addNormalPage'],
          rightAvatar: <Avatar backgroundColor={amber500} icon={<IconPage />} />,
          onClick: this.props.addPage,
        },
      ],
    };

    const floatingActionButtonProps = {
      backgroundColor: amber900,
    };

    return (
      <MuiThemeProvider>
        <SpeedDial
          floatingActionButtonProps={floatingActionButtonProps}
          positionV="inline"
          positionH="right"
          className="addPageMenu"
          classNameBackdrop="addPageBackdrop"
        >
          <BubbleList
            direction="up"
          >
            {buttonList.items.map(
              (item, index) => (<BubbleListItem key={`bubble${index}`} {...item} />)
            )}
          </BubbleList>
        </SpeedDial>
      </MuiThemeProvider>
    );
  }
}
