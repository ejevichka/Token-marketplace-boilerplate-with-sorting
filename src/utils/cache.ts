// utils/cache.ts
const cache = {
    get: (key: string): Set<string> | undefined => {
      if (typeof window !== 'undefined') {
        const value = sessionStorage.getItem(key);
        return value ? new Set(JSON.parse(value)) : undefined;
      }
    },
    set: (key: string, value: Set<string>) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(Array.from(value)));
      }
    },
    remove: (key: string) => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    },
  };
  
  export default cache;
  