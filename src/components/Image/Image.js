import React, { Component } from 'react';
import './Image.scss';
import ImageTitle from '../ImageTitle';

import { getImageUrl, } from '../../lib/imgur';

class Image extends Component {
  render() {
    const {
      id,
      title,
      onLoadComplete,
      onLoadError,
    } = this.props;

    return (
      <div className="image-container">
        {title && <ImageTitle title={title} />}
        <img
          alt={title}
          src={getImageUrl(this.props)}
          onLoad={() => {
            if (onLoadComplete) onLoadComplete(id);
          }}
          onError={() => {
            if (onLoadError) onLoadError(id);
          }}
        />
      </div>
    );
  }
}

export default Image;
