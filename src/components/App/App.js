import React, { Component } from 'react';
import './App.scss';

import ImageGrid from '../ImageGrid';
import Loader from '../Loader';

import {
  fetchGalleryImages,
  getImagesFromGalleryResponse,
  getCanMakeApiRequest,
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
    this.setState({
      hasInitialized: true,
    });

    this.loadGalleryPage();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      pendingImageUpdate,
      canMakeApiRequests,
    } = this.state;

    // if the page has changed, load a new gallery page
    if (pendingImageUpdate !== prevState.pendingImageUpdate && canMakeApiRequests.length > 0) {
      this.loadGalleryPage();
    }
  }

  loadGalleryPage() {
    const {
      maxImagesLoaded,
    } = this.props;
    const {
      images,
      currentPage,
    } = this.state;

    const params = Object.assign({}, this.props, {
      currentGalleryPage: currentPage || 0,
    });

    fetchGalleryImages(params).then(resp => {
      if (isRequestSuccessful(resp)) {
        resp.json().then(({ data, } = {}) => {
          const updatedImages = appendDistinct(images, getImagesFromGalleryResponse(data), 'id');

          if (updatedImages.length > maxImagesLoaded) updatedImages.splice(maxImagesLoaded);

          this.setState({
            images: updatedImages,
            pendingImageUpdate: false,
            canMakeApiRequests: getCanMakeApiRequest(resp),
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
