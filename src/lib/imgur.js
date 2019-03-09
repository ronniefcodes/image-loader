const _API_SETTINGS = {
  baseUrl: 'https://api.imgur.com',
  galleryName: 'user',
};

// get image objects from a given gallery (defaults to top)
export const fetchGalleryImages = (params) => {
  const settings = Object.assign({}, _API_SETTINGS, params);

  return fetch(`${settings.baseUrl}/3/gallery/${settings.galleryName}/${settings.currentGalleryPage || 0}`, {
    method: 'GET',
    headers: {
      "Authorization": `Client-ID ${params.apiClientId}`,
    },
  });
};

// get images from gallery response without videos
export const getImagesFromGalleryResponse = (images) => {
  console.log(images);
  if (!images) return [];

  return images.filter(image => {
    return !isVideoAsset(image);
  });
};

// return whether or not an api response was marked successful
export const isRequestSuccessful = (response) => {
  return response.status === 200;
};

// determine whether or not the user is able to make a request with the imgur api
export const getCanMakeApiRequest = (response) => {
  return response.headers.get('x-rateLimit-userLimit') > 0 &&
    response.headers.get('x-rateLimit-clientremaining') > 0;
};

// get image url from image objects
export const getImageUrl = (object) => {
  if (!object.images) return object.link;

  return object.images[0].link;
}

// determine whether or not object is a video
export const isVideoAsset = (object) => {
  if (!object.images) return false;

  return object.images[0].type.indexOf('video') !== -1;
}
