import { createTodo } from './todo';
import { collectionManager } from './collectionManager';
import { storageManager } from './storageManager';

const AppManager = (() => {
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
                const list = storageManager.loadList();
                alert(`Todo List:
${list.map((todo, index) => {
                    return `${index + 1}. ${todo.title}`
                }).join("\n")}`);
                console.log("Todo List:", list);
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


    return { getUserAction, handleUserAction }
})();

export { AppManager }