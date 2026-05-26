const storageManager = (() => {
    function get(key) {
        return localStorage.getItem(key);
    }

    function save(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    function load(key) {
        const list = localStorage.getItem(key);

        if (!list) return [];

        return JSON.parse(list);
    }

    function loadAll() {
        const allStorage = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = JSON.parse(localStorage.getItem(key));

            allStorage[key] = value;
        }

        return allStorage;
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    return { get, save, remove, load, loadAll };
})();

export { storageManager };