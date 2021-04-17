let memoryStorage: Record<string, string> = {};

/**
 * This is a simple wrapper around localStorage. If localStorage is not available it falls
 * back to using a simple in-memory store.
 */
export default {
    clear() {
        if (globalThis.localStorage) {
            globalThis.localStorage.clear();
            return;
        }

        memoryStorage = {};
    },

    del(key: string) {
        if (globalThis.localStorage) {
            globalThis.localStorage.removeItem(key);
            return;
        }

        delete memoryStorage[key];
    },

    get(key: string): string | null {
        if (globalThis.localStorage) {
            return globalThis.localStorage.getItem(key);
        }

        if (key in memoryStorage) {
            return memoryStorage[key];
        }

        return null;
    },

    set(key: string, value: string) {
        if (globalThis.localStorage) {
            globalThis.localStorage.setItem(key, value);
            return;
        }

        memoryStorage[key] = value;
    },
};
