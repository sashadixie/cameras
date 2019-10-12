import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import Header from '../Header/Header';
import Tabs from '../Tabs/Tabs';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:8000/api.php', {
      // mode: 'no-cors',
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          const items = json;
          const groupedItems = items.reduce((rv, x) => {
            (rv[x.folder_parent_name] = rv[x.folder_parent_name] || []).push(x); // eslint-disable-line
            return rv;
          }, {});
          console.log(groupedItems);
          this.setState({
            items: groupedItems,
            activeTab: 0,
          });
        });
      }
    });
  }

  select = (e, idx) => {
    const activeTab = idx;
    this.setState({
      activeTab,
    });
  }

  openFull = (src) => {
    this.setState({
      fullImage: src,
    });
  }

  privacyAlert = () => {
    alert('this is private'); // eslint-disable-line
  }

  render() {
    const { items, activeTab, fullImage } = this.state;
    console.log(items);
    return items !== null ? (
      <div>
        <div className="app-container">
          <div className="content">
            <Header />
            <main className="wrapper">
              <div className="full-container">
                {fullImage && <iframe title="full" src={fullImage} />}
              </div>
              <Tabs tabs={Object.keys(items)} activeTab={activeTab} select={this.select} />
              <div className="thumbs">
                {/* eslint-disable-next-line */}
                {Object.values(items)[activeTab].map(({ thumb, title, player, isPrivate = false }, idx) => {
                  const onClickFunction = isPrivate ? this.privacyAlert : this.openFull;
                  return (
                  <div className="thumb" key={idx} onClick={() => onClickFunction(player)} role="button" tabIndex="-1">  {/* eslint-disable-line */}
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video src={thumb} alt={idx} />
                    <div className="title">{title}</div>
                  </div>
                  );
                })}
              </div>

            </main>
          </div>
        </div>
      </div>
    ) : null;
  }
}

export default App;

App.propTypes = {
  data: PropTypes.object, //eslint-disable-line
};
