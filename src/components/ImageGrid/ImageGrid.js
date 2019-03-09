import React, { Component } from 'react';
import './ImageGrid.scss';
import Image from '../Image';

class ImageGrid extends Component {
  render() {
    const {
      images,
    } = this.props;

    return (
      <div className="image-grid">
        {images && images.map(image => <Image {...image} />)}
      </div>
    );
  }
}

export default ImageGrid;
