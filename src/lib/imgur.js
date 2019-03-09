const _API_SETTINGS = {
  baseUrl: 'https://api.imgur.com',
  galleryName: 'user',
};

// make fetch request
const getFetchRequest = (endpointUrl, params) => {
  return fetch(`${params.baseUrl}${endpointUrl}`, {
    method: params.httpMethod || 'GET',
    headers: {
      "Authorization": `Client-ID ${params.apiClientId}`,
    },
  });
};

// get image objects from a given gallery (defaults to top)
export const fetchGalleryImages = (params) => {
  const settings = Object.assign({}, _API_SETTINGS, params);

  return getFetchRequest(`/3/gallery/${settings.galleryName}/${settings.currentGalleryPage || 0}`, settings);
};

// get image objects from an array of ids
export const fetchImagesByIds = (ids, params) => {
  const settings = Object.assign({}, _API_SETTINGS, params);

  const promises = ids.map(id => {
    const promise = new Promise((resolve, reject) => {
      getFetchRequest(`/3/image/${id}`, settings).then(resp => {
        getImageFromResponseObject(resp).then(newImage => {
          resolve(newImage);
        });
      });
    });

    return promise;
  });

  return Promise.all(promises);
};

// get image from api response
export const getImageFromResponseObject = (resp) => {
  const promise = new Promise((resolve, reject) => {
    if (resp.status !== 200) {
      reject();
    }

    // convert response object to json in order to get data array
    resp.json().then(({ data, } = {}) => {
      // get primary image asset from data array without video objects
      const image = getPrimaryImageAsset(data);

      if (isVideoAsset(image)) reject();

      resolve(image);
    });
  });

  return promise;
};

// get images from gallery response without videos
export const getImagesFromResponseObject = (resp) => {
  const promise = new Promise((resolve, reject) => {
    if (resp.status !== 200) {
      reject();
    }

    // convert response object to json in order to get data array
    resp.json().then(({ data, } = {}) => {
      // get primary image asset from data array without video objects
      const images = data.map(image => {
        return getPrimaryImageAsset(image);
      }).filter(image => {
        return !isVideoAsset(image);
      });

      resolve(images);
    });
  });

  return promise;
};

// determine whether or not the user is able to make a request with the imgur api
export const getCanMakeApiRequest = (response) => {
  return response.headers.get('x-rateLimit-userLimit') > 0 &&
    response.headers.get('x-rateLimit-clientremaining') > 0;
};

// get image asset from objects
export const getPrimaryImageAsset = (object) => {
  const asset = !object.images ? object : object.images[0];

  return asset;
};

// get image url from image objects
export const getImageUrl = (object) => {
  return getPrimaryImageAsset(object).link;
};

// determine whether or not object is a video
export const isVideoAsset = (object) => {
  return getPrimaryImageAsset(object).type.indexOf('video') !== -1;
};
