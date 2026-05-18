import { createTodo } from './todo';
import { collectionManager } from './collectionManager';

const AppController = (() => {
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
                const title = prompt("Enter the todo title:");
                const description = prompt("Enter the todo description:");
                const dueDate = prompt("Enter the due date (YYYY-MM-DD):");
                const priority = prompt("Enter the priority (Low, Medium, High):");

                const todo = createTodo(title, description, dueDate, priority);
                collectionManager.addTodo(todo);

                //check if really creating
                console.log("New Todo Created:", todo);
                break;
            case "list":
                const list = collectionManager.getAllTodos();
                console.log("Todo List:", list);
                break;
            case "delete":
                handleDeleteAction();
                break;
            case "exit":
                console.log("Exiting the application. Goodbye!");
                break;
            default:
                console.log("Invalid action. Please choose 'new', 'list', or 'exit'.");
        }
    }

    function handleDeleteAction() {
        const todoIndex = prompt(
            `Todo List:
${collectionManager.getAllTodos().map((todo, index) => {
                return `${index + 1}. ${todo.title}`
            }).join("\n")}                    
Enter the id of the todo you want to delete:`
        )

        const isDeleted = collectionManager.deleteTodo(todoIndex);

        if (isDeleted)
            console.log("Todo was successfully deleted");
        else
            console.log("Todo deletion failed.");
    }


    return { getUserAction, handleUserAction }
})();

export { AppController }