import React from 'react';
import { render, } from 'react-dom';
import App from '../components/App';

const renderApp = (props, elementId = 'react-root') => {
  render(<App {...props} />, document.getElementById(elementId));
};

export default renderApp;
