import React, { Component } from 'react';
import './App.scss';

import ImageGrid from '../ImageGrid';
import Loader from '../Loader';

import {
  getGalleryImages,
  getRemainingRequests,
  isRequestSuccessful,
} from '../../lib/imgur';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasInitialized: false,
    };
  }

  componentDidMount() {
    getGalleryImages(this.props).then(resp => {
      if (isRequestSuccessful) {
        resp.json().then(({ data, } = {}) => {
          this.setState({
            images: data,
            remainingRequests: getRemainingRequests(resp),
            hasInitialized: true,
          });
        });
      }
    });
  }

  render() {
    const {
      hasInitialized,
      images,
    } = this.state;

    return (
      <div className="app">
        {hasInitialized ? <ImageGrid images={images} /> : <Loader />}
      </div>
    );
  }
}

export default App;
