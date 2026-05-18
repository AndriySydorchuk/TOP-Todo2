const collectionManager = (() => {
    const todoCollection = [];

    function addTodo(todo) {
        todoCollection.push(todo);
    }

    return { addTodo };
})();

export { collectionManager }