// localStorageUtils.js
export const loadFromLocalStorage = (key) => {
    try {
      const serializedState = localStorage.getItem(key);
      return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (e) {
      console.error("Could not load state from localStorage", e);
      return undefined;
    }
  };
  
  export const saveToLocalStorage = (key, value) => {
    try {
      const serializedState = JSON.stringify(value);
      localStorage.setItem(key, serializedState);
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  };
  