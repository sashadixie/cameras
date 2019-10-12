import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = props.data;
  }

  componentDidMount() {
    fetch('http://localhost:8000', {
      // mode: 'no-cors',
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          console.log(json); // eslint-disable-line
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="app-container">
          <div className="content">
            hello
          </div>
        </div>
      </div>
    );
  }
}

export default App;

App.propTypes = {
  data: PropTypes.object, //eslint-disable-line
};
