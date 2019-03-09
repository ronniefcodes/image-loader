import React, { Component } from 'react';
import './Image.scss';
import ImageTitle from '../ImageTitle';

import { getImageUrl, } from '../../lib/imgur';

class Image extends Component {
  render() {
    const {
      title,
      ...others
    } = this.props;

    console.log(this.props);
    return (
      <div className="image-container">
        {title && <ImageTitle title={title} />}
        <img
          alt=""
          src={getImageUrl(others)}
        />
      </div>
    );
  }
}

export default Image;
