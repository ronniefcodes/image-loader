import React, { Component } from 'react';
import './ImageGrid.scss';
import Image from '../Image';

import { isVideoAsset, } from '../../lib/imgur';

class ImageGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagesLoaded: 0,
    };
  }

  render() {
    const {
      images,
    } = this.props;

    return (
      <div className="image-grid">
        {images && images.map((image, i) =>
          !isVideoAsset(image) && <Image
            key={`image--${i}`}
            {...image}
            onLoaded={this.handleImageLoaded}
          />
        )}
      </div>
    );
  }
}

export default ImageGrid;
