import { storageManager } from './storageManager';

const collectionManager = (() => {
    //object -> collection = {prName: todosArr, prName2: todosArr2}
    let collectionObj = storageManager.loadAll();

    function addTodo(todoObj, projectName) {
        collectionObj[projectName] = todoObj;
    }

    function deleteTodo(todoId, projectName) {
        const selectedProject = collectionObj[projectName];
        const isProjectNameValid = selectedProject !== undefined;

        if (isProjectNameValid) {
            //check if todo id is valid
            const isNumber = Number.isInteger(todoId);
            const isInRange = todoId >= 0 && todoId < selectedProject.length;

            if (isNumber && isInRange) {
                const removed = selectedProject[todoId].splice(todoId, 1);

                return removed.length > 0 ? true : false;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function getProjectTodos(projectName) {
        const todos = collectionObj[projectName];

        if (todos !== undefined) {
            return todos;
        } else {
            return [];
        }
    }

    let todoCollection = storageManager.loadList();


    return { addTodo, deleteTodo, getProjectTodos };
})();

export { collectionManager }