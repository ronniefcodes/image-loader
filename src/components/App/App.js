import React, { Component } from 'react';
import './App.scss';

import ImageGrid from '../ImageGrid';
import Loader from '../Loader';

import {
  fetchGalleryImages,
  fetchImagesByIds,
  getImagesFromResponseObject,
  getCanMakeApiRequest,
} from '../../lib/imgur';
import {
  appendDistinct,
} from '../../utils/arrays';
import {
  getPinnedImagesCookie,
  updatePinnedImagesCookie,
} from '../../utils/cookies';

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

    fetchImagesByIds(getPinnedImagesCookie(), this.props).then(images => {
      this.setState({
        images: images.map(image => {
          image.isPinned = true;
          return image;
        }),
      });
    }).finally(() => {
      this.loadGalleryPage();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      pendingImageUpdate,
      canMakeApiRequests,
    } = this.state;

    // if the page has changed, load a new gallery page
    if (canMakeApiRequests && pendingImageUpdate !== prevState.pendingImageUpdate) {
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
      getImagesFromResponseObject(resp).then(newImages => {
        if (newImages.length > 0) {
          const updatedImages = appendDistinct(images, newImages, 'id');

          if (updatedImages.length > maxImagesLoaded) updatedImages.splice(maxImagesLoaded);

          this.setState({
            images: updatedImages,
            pendingImageUpdate: false,
            canMakeApiRequests: getCanMakeApiRequest(resp),
          });
        }
      }, () => {
        this.setState({
          canMakeApiRequests: false,
        });
      });
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

  handleImagePin(id) {
    const {
      images,
    } = this.state;

    updatePinnedImagesCookie(id);

    const updatedImages = images.map(image => {
      if (image.id === id) {
        image.isPinned = !image.isPinned;
      }

      return image;
    });

    updatedImages.sort((a, b) => {
      if (a.isPinned) return -1;
      return 0;
    });

    this.setState({
      images: updatedImages,
    });
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
            onImagePin={id => this.handleImagePin(id)}
          />
          :
          <Loader />}
      </div>
    );
  }
}

export default App;
