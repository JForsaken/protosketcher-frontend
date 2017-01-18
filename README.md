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

## Collaborators

- Justin D'Errico
- Jonathan Rainville
- Francois Lauzier
- Gabriel Latendresse
