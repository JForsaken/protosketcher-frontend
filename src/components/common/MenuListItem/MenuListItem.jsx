/* Node modules */
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class MenuListItem extends Component {
  static defaultProps = { isExternal: false };
  static propTypes = {
    icon: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
    link: PropTypes.string.isRequired,
    text: PropTypes.any.isRequired,
    onClick: PropTypes.any,
  };

  renderLink() {
    const { link, onClick, icon, text, isExternal } = this.props;
    let generatedlink = (
      <Link to={link} onClick={onClick}>
        <i className={icon} /> {text}
      </Link>
    );

    if (isExternal) {
      generatedlink = (
        <a href={link} target="_blank">
          <i className={icon} /> {text}
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
