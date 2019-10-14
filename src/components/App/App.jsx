import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import classnames from 'classnames';
import './style.scss';
import Header from '../Header/Header';
import Tabs from '../Tabs/Tabs';
import helpers from '../shared/helpers';

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
    // this.countdown = setInterval(this.getThumbs, 10000);
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
          const items = Object.values(json);
          const { activeTab } = this.state;
          this.setState({
            items,
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

  renderGroup = (child) => {
    const thumbClass = classnames('thumbs', { row: !child.cams });
    return (
      <div key={child.title}>
        <div className="group-title">{child.title}</div>
        <div className={thumbClass}>
          {child.cams && child.cams.map(({
            thumb, title, player, isPrivate = false,
          }, idx) => {
            const onClickFunction = isPrivate ? this.privacyAlert : this.openFull;
            return (
              <div className="thumb" key={idx} onClick={() => onClickFunction(player)} role="button" tabIndex="-1">  {/* eslint-disable-line */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video src={thumb} alt={idx} />
                <div className="title">{title}</div>
              </div>
            );
          })}
          {!child.cams && child.children && Object.values(child.children).map((c) => (
            <div key={c.title}>
              <div className="group-title withMargin">{c.title}</div>
              <div className="thumbs">
                {c.cams && c.cams.map(({
                  thumb, title, player, isPrivate = false,
                }, idx) => {
                  const onClickFunction = isPrivate
                    ? this.privacyAlert : this.openFull;
                  return (
                    <div className="thumb" key={idx} onClick={() => onClickFunction(player)} role="button" tabIndex="-1">  {/* eslint-disable-line */}
                      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                      <video src={thumb} alt={idx} />
                      <div className="title">{title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  getMobileView = (os) => {
    const links = {
      iOS: {
        image: '/images/appstore.png',
        link: 'https://apps.apple.com/ru/app/flussonic-watcher/id1233594294',
      },
      Android: {
        image: '/images/android.png',
        link: 'https://play.google.com/store/apps/details?id=com.flussonic.watcher',
      },
    };
    return (
      <a className="download" href={links[os].link}>
        <img alt={os} src={links[os].image} />
      </a>
    );
  }

  render() {
    const {
      items, activeTab, fullImage, showModal,
    } = this.state;
    const os = helpers.getMobileOperatingSystem();
    const isMobile = ['Android', 'iOS'].includes(os);
    return items !== null ? (
      <div>
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
        <div className="app-container">
          <div className="content">
            <Header />
            <main className="wrapper container">
              {isMobile ? this.getMobileView(os) : null}
              <Tabs tabs={items.map((i) => i.title)} activeTab={activeTab} select={this.select} />
              <div>
                {Object.values(items[activeTab].children).map((child) => this.renderGroup(child))}
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
