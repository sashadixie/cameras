import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = props.data;
  }

  render() {
    return (
      <header className="header-container">
        <div className="header-flex">
          <img className="logo" src="/images/plexanovo.png" alt="logo" />
        </div>
      </header>
    );
  }
}

export default Header;

Header.propTypes = {
  data: PropTypes.object, //eslint-disable-line
};
