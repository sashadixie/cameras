import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import ReCAPTCHA from 'react-google-recaptcha';
import moment from 'moment';
import classnames from 'classnames';
import './style.scss';
import Header from '../Header/Header';
import Tabs from '../Tabs/Tabs';
import Spinner from '../Spinner/Spinner';
import helpers from '../shared/helpers';

const links = {
  iOS: {
    image: '/images/appstore.png',
    link: 'https://apps.apple.com/ru/app/flussonic-watcher/id1233594294',
    qr: '/images/apple.gif',
    title: 'Ссылка для iPhone',
  },
  Android: {
    title: 'Ссылка для Android',
    qr: '/images/android.gif',
    image: '/images/android.png',
    link: 'https://play.google.com/store/apps/details?id=com.flussonic.watcher',
  },
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      showModal: false,
      checked: false,
      captchaChecked: false,
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
    fetch('http://localhost:8000/api.php?function=get_tree', {
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
    // this.countdown = setInterval(this.getThumbs, 10000);
    this.setState({
      showModal: false,
      modalName: null,
      fullImage: null,
    });
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
      modalName: 'full',
    });
  }

  privacyAlert = () => {
    this.setState({
      showModal: true,
      modalName: 'privacy',
    });
  }

  renderGroup = (child) => {
    const thumbClass = classnames('thumbs', { row: !child.cams });
    return (
      <div key={child.title}>
        <div className="group-title">{child.title}</div>
        <div className={thumbClass}>
          {child.cams && child.cams.map(({
            thumb, title, player, private: isPrivate = false,
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
                  thumb, title, player, private: isPrivate = false,
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

  getMobileView = (os) => (
    <a className="download" href={links[os].link}>
      <img alt={os} src={links[os].image} />
    </a>
  );

  qrOrlinks = () => {
    const os = helpers.getMobileOperatingSystem();
    const isMobile = ['Android', 'iOS'].includes(os);
    return isMobile ? this.getMobileView(os) : (
      <div className="qr-links">
        {Object.values(links).map(((val) => {
          const { title, qr, link } = val;
          return (
            <a key={link} className="qr-item" href={link}>
              <img src={qr} alt={title} />
              <div>{title}</div>
            </a>
          );
        }))}
      </div>
    );
  }

  onCaptchaChange = (value) => {
    this.setState({
      captchaChecked: value !== null,
    });
  }

  checkbox = () => {
    const { checked } = this.state;
    this.setState({
      checked: !checked,
    });
  }

  sendLoginRequest = () => {
    const { captchaChecked, checked } = this.state;
    const { stopDateLS } = localStorage;
    const timing = !stopDateLS || moment() > moment(stopDateLS);
    console.log(timing, stopDateLS);
    const isQueryAvailable = captchaChecked && checked && timing;
    // > means later

    if (isQueryAvailable) {
      fetch('http://localhost:8000/api.php?function=get_tmp_login', {
      // mode: 'no-cors',
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            const {
              stop_date: stopDate,
              login,
              password,
              operator_id: operatorId,
            } = json;
            localStorage.stopDateLS = stopDate;
            localStorage.login = login;
            localStorage.password = password;
            localStorage.operatorId = operatorId;
          });
        }
      });
    }
    this.setState({
      requestSent: true,
    });
  }

  privacy = () => {
    const { captchaChecked, checked, requestSent } = this.state;
    const { login, password, operatorId } = localStorage;
    const isQueryAvailable = captchaChecked && checked;
    return (
      <div className="privacy-modal">
        <div className="guide">
          Эта камера приватная. Чтобы получить к ней доступ:
          <ol className="guide-list">
            <li>
              <div>
                Скачайте приложение Flussonic Watcher на телефон
              </div>
              {this.qrOrlinks()}
            </li>
            <li>Подтвердите ниже, что вы не робот, и получите настройки для входа</li>
            <li>Войдите в приложение с полученными настройками</li>
          </ol>
          Для получения полного доступа обратитесь в компанию  IP-inspector.
        </div>
        {requestSent ? (
          <div>
            <div className="settings">
              Ваши настройки для входа:
              <p>
                <span className="setting-name">Логин:</span>
                <span className="setting-value">{login}</span>
              </p>
              <p>
                <span className="setting-name">Пароль:</span>
                <span className="setting-value">{password}</span>
              </p>
              <p>
                <span className="setting-name">Оператор:</span>
                <span className="setting-value">{operatorId}</span>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="checkbox-container">
              <input type="checkbox" id="check" onChange={this.checkbox} checked={checked} />
              <label htmlFor="check">Подтвержадю, что я являюсь собственником жилплощади по адресу установки данной камеры</label> {/* eslint-disable-line */}
            </div>
            <div className="captcha">
              <ReCAPTCHA
                sitekey="6LdIXL4UAAAAAMH64I0h11fL-UWZtcJSFLPciu_E"
                onChange={this.onCaptchaChange}
              />
            </div>
            <button
              className="primary sendRequest"
              type="button"
              disabled={!isQueryAvailable}
              onClick={this.sendLoginRequest}
            >
              Получить настройки для входа
            </button>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      items, activeTab, fullImage, showModal, modalName,
    } = this.state;
    const os = helpers.getMobileOperatingSystem();
    const isMobile = ['Android', 'iOS'].includes(os);
    const privacy = modalName === 'privacy';
    const privacyStyles = privacy && !isMobile;
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
              height: !privacyStyles && '100%',
              margin: privacyStyles && '0 auto',
              width: privacyStyles && '50vw',
              position: privacyStyles && 'relative',
              left: privacyStyles && 'auto',
              right: privacyStyles && 'auto',
            },
          }}
        >
          {/* eslint-disable-next-line */}
              <img
                onClick={this.handleCloseModal}
                className={classnames('close', { privacy })}
                src="/images/clear.svg"
                alt="закрыть"
              />
          {fullImage && <iframe title="full" src={fullImage} />}
          {privacy && this.privacy()}
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
    ) : <Spinner />;
  }
}

export default App;

App.propTypes = {
  data: PropTypes.object, //eslint-disable-line
};
