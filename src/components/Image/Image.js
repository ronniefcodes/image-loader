import React, { Component } from 'react';
import './Image.scss';
import ImageTitle from '../ImageTitle';

import { getImageUrl, } from '../../lib/imgur';

class Image extends Component {
  render() {
    const {
      id,
      isPinned,
      title,
      onLoadComplete,
      onLoadError,
      onPin,
    } = this.props;

    return (
      <div className="image-container">
        <button className="image__pin-button" onClick={() => onPin(id)}>{isPinned ? '-' : '+'}</button>
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
