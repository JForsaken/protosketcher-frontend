import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Menu from './common/Menu/Menu';
import Footer from './common/Footer/Footer';
import DisplayError from './common/DisplayErrors/DisplayError';

class Application extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  constructor(props, context) {
    super(props, context);

    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.state = {
      isMenuActive: false,
    };
  }

  componentWillReceiveProps(newProps) {
    // Redirect to the login page if the /me call failed (invalid or expired token)
    if (!newProps.api.login.user.id && !newProps.api.login.pending) {
      this.props.history.push('/login');
    }
  }

  handleMenuClick(evt) {
    evt.preventDefault();
    this.setState({ isMenuActive: !this.state.isMenuActive });
  }

  render() {
    const { isMenuActive } = this.state;
    const activeClass = isMenuActive ? 'active' : '';
    return (
      <div id="layout" className={activeClass}>
        <a
          href="#menu" id="menuLink"
          className={classnames('menu-link', activeClass)}
          onClick={this.handleMenuClick}
        >
          <span></span>
        </a>

        <Menu activeClass={activeClass} />

        <div id="main">
          <DisplayError />
          {/* this will render the child routes */}
          {this.props.children}
        </div>
        {
          this.props.children.props.route.path === '/' ? null : <Footer />
        }
      </div>
    );
  }
}

export default (connect(
  ({ api }) => ({ api }),
  null
  )(Application));
