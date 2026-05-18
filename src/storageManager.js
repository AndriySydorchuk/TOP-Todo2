const storageManager = (() => {
    function saveList(list) {
        localStorage.setItem("list", JSON.stringify(list));
    }

    function loadList() {
        const list = localStorage.getItem("list");

        if (!list) return [];

        return JSON.parse(list);
    }

    return { saveList, loadList };
})();

export { storageManager };