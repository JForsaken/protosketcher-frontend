/* Node modules */
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

export default class MenuListItem extends Component {
  static defaultProps = { isExternal: false };
  static propTypes = {
    icon: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
    link: PropTypes.string.isRequired,
    text: PropTypes.any.isRequired,
    className: PropTypes.any,
    onClick: PropTypes.any,
  };

  renderLink() {
    const { link, onClick, icon, text, isExternal, className } = this.props;
    let generatedlink = (
      <Link to={link} onClick={onClick} className={className}>
        <FontAwesome name={icon} /> {text}
      </Link>
    );

    if (isExternal) {
      generatedlink = (
        <a href={link} target="_blank" className={className}>
          <FontAwesome name={icon} /> {text}
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
