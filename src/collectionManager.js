import { storageManager } from './storageManager';

const collectionManager = (() => {
    let todoCollection = storageManager.loadList();

    function addTodo(todo) {
        todoCollection.push(todo);
    }

    function deleteTodo(todoIndex) {
        const formattedIndex = parseInt(todoIndex, 10) - 1;
        const removed = todoCollection.splice(formattedIndex, 1);

        return removed.length > 1;
    }

    function getAllTodos() {
        return todoCollection;
    }

    return { addTodo, deleteTodo, getAllTodos };
})();

export { collectionManager }