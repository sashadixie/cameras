import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './style.scss';
import Header from '../Header/Header';
import Tabs from '../Tabs/Tabs';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      showModal: false,
    };
  }

  componentDidMount() {
    this.getThumbs(true);
    this.countdown = setInterval(this.getThumbs, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  getThumbs = (isInitial = false) => {
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
          const { activeTab } = this.state;
          this.setState({
            items: groupedItems,
            activeTab: isInitial ? 0 : activeTab,
          });
        });
      }
    });
  }

  handleCloseModal = () => {
    this.countdown = setInterval(this.getThumbs, 10000);
    this.setState({ showModal: false });
  }

  select = (e, idx) => {
    const activeTab = idx;
    this.setState({
      activeTab,
    });
  }

  openFull = (src) => {
    clearInterval(this.countdown);
    this.setState({
      fullImage: src,
      showModal: true,
    });
  }

  privacyAlert = () => {
    alert('this is private'); // eslint-disable-line
  }

  render() {
    const {
      items, activeTab, fullImage, showModal,
    } = this.state;
    return items !== null ? (
      <div>
        <div className="app-container">
          <div className="content">
            <Modal
              isOpen={showModal}
              onRequestClose={this.handleCloseModal}
              contentLabel="Видео с камеры"
              style={{
                overlay: {
                  backgroundColor: '#000000ba',
                  zIndex: 9,
                },
                content: {
                  padding: '0',
                  overflow: 'hidden',
                },
              }}
            >
              {/* eslint-disable-next-line */}
              <img
                onClick={this.handleCloseModal}
                className="close"
                src="/images/clear.svg"
                alt="закрыть"
              />
              {fullImage && <iframe title="full" src={fullImage} />}
            </Modal>
            <Header />
            <main className="wrapper">
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
