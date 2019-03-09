import Cookies from 'js-cookie';

export const updatePinnedImagesCookie = (id) => {
  const cookie = getPinnedImagesCookie();

  const idIndex = cookie.indexOf(id);

  if (idIndex === -1) cookie.push(id);
  else cookie.splice(idIndex, 1);

  setPinnedImagesCookie(cookie);
};

export const getPinnedImagesCookie = () => {
  const cookie = Cookies.get('pinned_images');

  return cookie ? JSON.parse(cookie) : [];
};

export const setPinnedImagesCookie = (value) => {
  Cookies.set('pinned_images', value);
};
