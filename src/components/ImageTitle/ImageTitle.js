import React, { Component } from 'react';
import './ImageTitle.scss';

class ImageTitle extends Component {
  render() {
    const {
      title,
    } = this.props;

    return (
      <h2 className="image__title">{title}</h2>
    );
  }
}

export default ImageTitle;
