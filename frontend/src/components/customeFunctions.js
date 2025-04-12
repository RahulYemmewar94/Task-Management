export const storeDataToLocalStorage = (key, data) => {
  try {
    const serializedValue = JSON.stringify(data);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getDataFromLocalStorage = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return undefined;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Error getting data from localStorage:", error);
    return undefined;
  }
};
