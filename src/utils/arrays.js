export const appendDistinct = (array, arrayToAppend, identifier = null) => {
  const newArray = array || [];

  arrayToAppend.forEach(appendingItem => {
    if (!array || !array.find(item => {
      if (identifier) {
        return item[identifier] === appendingItem[identifier];
      }

      return item === appendingItem;
    })) newArray.push(appendingItem);
  });

  return newArray;
};
