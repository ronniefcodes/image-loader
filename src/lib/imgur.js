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

// get image asset from objects
const getPrimaryImageAsset = (object) => {
  const asset = !object.images ? object : object.images[0];

  return asset;
};

// determine whether or not object is a video
const isVideoAsset = (object) => {
  return object.type.indexOf('video') !== -1;
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
        getImagesFromResponseObject(resp).then(newImages => {
          resolve(newImages[0]);
        });
      });
    });

    return promise;
  });

  return Promise.all(promises);
};

// get images from gallery response without videos
export const getImagesFromResponseObject = (resp) => {
  const promise = new Promise((resolve, reject) => {
    if (resp.status !== 200) {
      reject();
    }

    // convert response object to json in order to get data array
    resp.json().then(({ data, } = {}) => {
      let images = Array.isArray(data) ? data : [ data ];

      // get primary image asset from data array without video objects
      images = images.map(image => {
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
