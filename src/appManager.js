import { createTodo } from './todo';
import { collectionManager } from './collectionManager';
import { storageManager } from './storageManager';

const AppManager = (() => {
    const init = () => {
        if (localStorage.getItem("default") === null) {
            storageManager.saveList("default", []);
        }
    }

    const getUserAction = () => {
        return prompt(
            `Menu:
    'new' - create a new todo.
    'delete' - delete a todo.
    'list' - list all todos.
    'exit' - exit the application.
            
What would you like to do?`);
    }

    const handleUserAction = (action) => {
        switch (action) {
            case "new":
                handleNewTodo();
                break;
            case "list":
                handleListDisplay();
                break;
            case "delete":
                handleDeleteAction();
                break;
            case "exit":
                alert("Exiting the application. Goodbye!");
                break;
            default:
                alert("Invalid action.");
        }
    }

    function handleDeleteAction() {
        const todoIndex = prompt(
            `Todo List:
${storageManager.loadList().map((todo, index) => {
                return `${index + 1}. ${todo.title}`
            }).join("\n")}                    
Enter the id of the todo you want to delete:`
        )

        const isDeleted = collectionManager.deleteTodo(todoIndex);

        if (isDeleted) {
            storageManager.saveList(collectionManager.getAllTodos());
            alert("Todo was successfully deleted");
        }
        else {
            alert("Todo deletion failed.");
        }
    }

    function handleNewTodo() {
        const title = prompt("Enter the todo title:");
        const description = prompt("Enter the todo description:");
        const dueDate = prompt("Enter the due date (YYYY-MM-DD):");
        const priority = prompt("Enter the priority (Low, Medium, High):");

        const todo = createTodo(title, description, dueDate, priority);
        collectionManager.addTodo(todo);
        storageManager.saveList(collectionManager.getAllTodos());

        alert(
            `New Todo Created:
            Title: ${todo.title}
            Description: ${todo.description}
            Due Date: ${todo.dueDate}
            Priority: ${todo.priority}`
        );
    }


    return { init, getUserAction, handleUserAction }
})();

function handleListDisplay() {
    const projectNamesArr = collectionManager.getProjectNames();
    const formattedProjectNames = `Projects: \n${projectNamesArr.map((name, index) => `${index + 1}. ${name}`).join("\n")}`;

    const selectedProjectName = prompt(`${formattedProjectNames}\nType name of the project to see its todos:`);
    const selectedTodosArr = collectionManager.getProjectTodos(selectedProjectName);

    if (selectedTodosArr.length === 0) {
        alert(`Project '${selectedProjectName}' does not have any todos.`);
    } else {
        alert(`Project '${selectedProjectName}':\n${selectedTodosArr.map((todo, index) => {
            return `${index + 1}. ${todo.title}\n${todo.description}\n${todo.dueDate}\n${todo.priority}`
        }).join("\n\n")}`)
    }
}

export { AppManager }