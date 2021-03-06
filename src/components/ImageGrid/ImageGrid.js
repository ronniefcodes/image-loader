import React, { Component } from 'react';
import './ImageGrid.scss';
import Image from '../Image';

class ImageGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagesLoaded: 0,
      imagesLoadedWithError: 0,
    };
  }

  handleImageLoaded(id) {
    const {
      imagesLoaded,
    } = this.state;

    this.setState({
      imagesLoaded: imagesLoaded + 1,
    });
  }

  handleImageError() {
    const {
      imagesLoadedWithError,
    } = this.state;

    this.setState({
      imagesLoadedWithError: imagesLoadedWithError + 1,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      images,
      pendingImageUpdate,
      onLoadComplete,
    } = this.props;

    const {
      imagesLoaded,
      imagesLoadedWithError,
    } = this.state;

    // if there isn't a pending image array update
    if (!pendingImageUpdate) {
      const totalLoaded = imagesLoaded + imagesLoadedWithError;

      // check to see if the total loaded images matches array
      if (totalLoaded === images.length) {
        if (onLoadComplete) onLoadComplete();
      }
    }
  }

  render() {
    const {
      images,
      onImagePin,
    } = this.props;

    return (
      <div className="image-grid">
        {images && images.map(image =>
          <Image
            key={`image--${image.id}`}
            {...image}
            onLoadComplete={() => this.handleImageLoaded()}
            onLoadError={() => this.handleImageError()}
            onPin={id => onImagePin && onImagePin(id)}
          />
        )}
      </div>
    );
  }
}

export default ImageGrid;
