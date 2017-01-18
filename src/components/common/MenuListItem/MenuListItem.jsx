/* Node modules */
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class MenuListItem extends Component {
  static defaultProps = { isExternal: false };
  static propTypes = {
    icon: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
    link: PropTypes.string.isRequired,
    query: PropTypes.object,
    text: PropTypes.any.isRequired,
    onClick: PropTypes.any,
  };

  renderLink() {
    const { link, query, onClick, icon, text, isExternal } = this.props;
    let generatedlink = (
      <Link to={link} query={query} onClick={onClick}>
        <i className={icon}></i> {text}
      </Link>
    );

    if (isExternal) {
      generatedlink = (
        <a href={link} target="_blank">
          <i className={icon}></i> {text}
        </a>
      );
    }

    return generatedlink;
  }

  render() {
    return (
      <li>
        {this.renderLink()}
      </li>
    );
  }
}
