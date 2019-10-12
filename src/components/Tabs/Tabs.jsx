import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

const Tabs = ({ tabs, activeTab, select }) => (
  <div className="tabs-container">
    {tabs.map((item, idx) => {
      const className = classnames('tab', { active: activeTab === idx });
      return (
        <button
          onClick={(e) => select(e, idx)}
          className={className}
          type="button"
          key={idx} // eslint-disable-line
        >
          {item}
        </button>
      );
    })}
  </div>
);

export default Tabs;

Tabs.propTypes = {
  tabs: PropTypes.array, //eslint-disable-line
  activeTab: PropTypes.number,
  select: PropTypes.func,
};
