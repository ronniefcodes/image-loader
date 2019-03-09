const _API_SETTINGS = {
  baseUrl: 'https://api.imgur.com',
  galleryName: 'top',
};

// geet image objects from a given gallery (defaults to top)
export const getGalleryImages = (params) => {
  const settings = Object.assign({}, _API_SETTINGS, params);

  return fetch(`${settings.baseUrl}/3/gallery/${settings.galleryName}/${settings.currentGalleryPage || 0}`, {
    method: 'GET',
    headers: {
      "Authorization": `Client-ID ${params.apiClientId}`,
    },
  });
};

// return whether or not an api response was marked successful
export const isRequestSuccessful = (response) => {
  return response.success && response.status === 200;
};

// get header value for remaining available requests
export const getRemainingRequests = (response) => {
  return response.headers.get('x-ratelimit-clientremaining');
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
