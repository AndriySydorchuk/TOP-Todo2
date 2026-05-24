const storageManager = (() => {
    function saveList(name, list) {
        localStorage.setItem(name, JSON.stringify(list));
    }

    function loadList(name) {
        const list = localStorage.getItem(name);

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

    function removeList(key) {
        localStorage.removeItem(key);
    }

    return { saveList, removeList, loadList, loadAll };
})();

export { storageManager };