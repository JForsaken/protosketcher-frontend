# Protosketch Frontend :art: :triangular_ruler:

The standalone React-Redux frontend platform for the Protosketch project.

## Installation

Follow the installation steps in the backend repository, except for the database and **.env** file part.

## Development

```bash
$ npm run dev
```
**Protosketcher** will then run at [http://localhost:3001](http://localhost:3001).

You will see the react-redux state inspector on your right.
To move it around, use `Ctrl+F2`.
To toggle it, use `Ctrl+H`.

## Deployment

Run this command to build the project:

```bash
$ npm run build
```

Then the website will be built in the **/dist** folder. Simply copy that folder and paste it to where you where to host the site.

For automatic deployment, you can run this command :

```bash
$ npm run deploy
```

:warning: You must edit the variables in the secrets.yml file. To avoid pushing the secret config, run this line :

```bash
$ git update-index --assume-unchanged secrets.yml
```

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

Look at the [doc](https://github.com/minutemailer/react-popup) to check all the features.

## Collaborators

- Justin D'Errico
- Jonathan Rainville
- Francois Lauzier
- Gabriel Latendresse
