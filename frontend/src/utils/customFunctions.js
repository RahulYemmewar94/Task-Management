function capitalizeFirstLetterOfEachWord(str) {
  return str
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
    .join(" "); // Join the array back into a single string
}

export { capitalizeFirstLetterOfEachWord };

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" }).slice(0, 3); // Get first 3 letters
  const year = date.getFullYear();
  return `${month} ${year}`;
};

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
