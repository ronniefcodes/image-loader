import React, { Component } from 'react';
import './ImageTitle.scss';

class ImageTitle extends Component {
  render() {
    const { imageTitle, } = this.props;

    return (
      <h2 className="image__title">{imageTitle}</h2>
    );
  }
}

export default ImageTitle;
