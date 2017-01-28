# Protosketch Frontend :art: :triangular_ruler:

The standalone React-Redux frontend platform for the Protosketch project.

## Installation

Follow the installation steps in the backend repository, except for the database and **.env** file part.

## Development

```bash
$ npm start
```
**Protosketch** will then run at [http://localhost:3001](http://localhost:3001).

## Deployment

Run this command to build the project:

```bash
$ npm run build
```

Then the website will be built in the **/dist** folder. Simply copy that folder and paste it to where you where to host the site.

## I18n support

All messages in this website are localized and rendered using `react-intl@2.0`.

There is also a [babel plugin](https://github.com/yahoo/babel-plugin-react-intl) to extract all the default messages into `./_translations/src` to be provided to translators.

```bash
$ npm run build:i18n
```

You can also run a script to extract all those translations as key-value.

```bash
$ npm run build:i18n:langs
```

## Context-Menu

A plugin was added to handle custom context menus
The documentation is here: https://github.com/vkbansal/react-contextmenu

To use the context menu, just import:

```bash
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
```

After, just setup your trigger and the menu:

```bash
<ContextMenuTrigger id="some_unique_identifier">
  <div className="well">Right click to see the menu</div>
</ContextMenuTrigger>

<ContextMenu id="some_unique_identifier">
  <MenuItem data={"some_data"} onClick={this.handleClick}>
    ContextMenu Item 1
  </MenuItem>
  <MenuItem data={"some_data"} onClick={this.handleClick}>
    ContextMenu Item 2
  </MenuItem>
  <MenuItem divider />
  <MenuItem data={"some_data"} onClick={this.handleClick}>
    ContextMenu Item 3
  </MenuItem>
</ContextMenu>
```

## Popup

A plugin was added to handle custom popups (alerts, prompts, etc.)
The documentation is here: https://github.com/minutemailer/react-popup

To use the popup, just import:

```bash
import Popup from 'react-popup';
```

There are multiple ways to use the popup. The easiest being:

```bash
Popup.alert('Hello, look at me');
```

But, you can also customize the features:

```bash
Popup.create({
  title: 'I have a title',
  content: 'Hello, look at me',
  className: 'alert',
  buttons: {
      right: ['ok']
  }
});
```

Look at the [doc](https://github.com/minutemailer/react-popup) to check all the features.

## Collaborators

- Justin D'Errico
- Jonathan Rainville
- Francois Lauzier
- Gabriel Latendresse
