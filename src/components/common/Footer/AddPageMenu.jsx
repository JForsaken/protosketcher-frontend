/* Node modules */
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { injectIntl } from 'react-intl';

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
          rightAvatar: <Avatar icon={<IconModal />} />,
          onClick: () => { this.props.addModalPage(); },
          className: 'smallButton',
        },
        {
          primaryText: this.props.intl.messages['footer.addNormalPage'],
          rightAvatar: <Avatar icon={<IconPage />} />,
          onClick: () => { this.props.addNormalPage('normal'); },
          className: 'smallButton',
        },
      ],
    };

    return (
      <MuiThemeProvider>
        <SpeedDial
          positionV="inline"
          positionH="right"
          className="addPageMenu"
          classNameBackdrop="addPageBackdrop"
          styleButtonWrap={{
            right: '22px', // To adjust to the changes made in CSS to the size
          }}
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
