let memoryStorage: Record<string, string> = {};

export default {
    clear() {
        if (localStorage) {
            localStorage.clear();
            return;
        }

        memoryStorage = {};
    },

    del(key: string) {
        if (localStorage) {
            localStorage.removeItem(key);
            return;
        }

        delete memoryStorage[key];
    },

    get(key: string): string | null {
        if (localStorage) {
            return localStorage.getItem(key);
        }

        if (key in memoryStorage) {
            return memoryStorage[key];
        }

        return null;
    },

    set(key: string, value: string) {
        if (localStorage) {
            localStorage.setItem(key, value);
            return;
        }

        memoryStorage[key] = value;
    },
};
