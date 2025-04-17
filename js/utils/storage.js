// Storage utility service
export class StorageService {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error storing ${key}:`, error);
        }
    }

    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error retrieving ${key}:`, error);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}