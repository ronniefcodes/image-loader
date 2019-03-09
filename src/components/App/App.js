import React, { Component } from 'react';
import './App.scss';

import ImageGrid from '../ImageGrid';
import Loader from '../Loader';

import {
  fetchGalleryImages,
  getImagesFromGalleryResponse,
  getRemainingRequests,
  isRequestSuccessful,
} from '../../lib/imgur';
import {
  appendDistinct,
} from '../../utils/arrays';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasInitialized: false,
      images: [],
      pendingImageUpdate: true,
      currentPage: 0,
    };
  }

  componentDidMount() {
    this.loadGalleryPage();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      pendingImageUpdate,
      remainingRequests,
    } = this.state;

    // if the page has changed, load a new gallery page
    if (pendingImageUpdate !== prevState.pendingImageUpdate && remainingRequests.length > 0) {
      this.loadGalleryPage();
    }
  }

  loadGalleryPage() {
    const {
      images,
      currentPage,
    } = this.state;

    const params = Object.assign({}, this.props, {
      currentGalleryPage: currentPage || 0,
    });

    fetchGalleryImages(params).then(resp => {
      if (isRequestSuccessful) {
        resp.json().then(({ data, } = {}) => {
          this.setState({
            images: appendDistinct(images, getImagesFromGalleryResponse(data), 'id'),
            pendingImageUpdate: false,
            remainingRequests: getRemainingRequests(resp),
            hasInitialized: true,
          });
        });
      }
    });
  }

  handleLoadComplete() {
    const {
      maxImagesLoaded,
    } = this.props;
    const {
      images,
      currentPage,
    } = this.state;

    // if additional images are meant to be loaded, increment current page
    if (images.length < maxImagesLoaded) {
      this.setState({
        pendingImageUpdate: true,
        currentPage: currentPage + 1,
      });
    }
  }

  render() {
    const {
      hasInitialized,
      images,
      pendingImageUpdate,
    } = this.state;

    return (
      <div className="app">
        {hasInitialized ?
          <ImageGrid
            images={images}
            pendingImageUpdate={pendingImageUpdate}
            onLoadComplete={() => this.handleLoadComplete()}
          />
          :
          <Loader />}
      </div>
    );
  }
}

export default App;
