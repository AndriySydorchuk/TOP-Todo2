const collectionManager = (() => {
    const todoCollection = [];

    function addTodo(todo) {
        todoCollection.push(todo);
    }

    function getAllTodos() {
        return todoCollection;
    }

    return { addTodo, getAllTodos };
})();

export { collectionManager }