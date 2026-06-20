import { StateStorage } from 'zustand/middleware';

export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(name);
    } catch (e) {
      console.warn(`[safeStorage] Read failed for key "${name}":`, e);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(name, value);
    } catch (e) {
      console.warn(`[safeStorage] Write failed for key "${name}":`, e);
    }
  },
  removeItem: (name) => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(name);
    } catch (e) {
      console.warn(`[safeStorage] Remove failed for key "${name}":`, e);
    }
  }
};
