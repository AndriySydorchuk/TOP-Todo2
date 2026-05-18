import { createTodo } from './todo';
import { collectionManager } from './collectionManager';

const AppController = (() => {
    const getUserAction = () => {
        return prompt(
            `Menu:
    'new' - create a new todo.
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
                console.log("New Todo Created:", todo);
                break;
            case "list":
                const list = collectionManager.getAllTodos();
                console.log("Todo List:", list);
                break;
            case "exit":
                console.log("Exiting the application. Goodbye!");
                break;
            default:
                console.log("Invalid action. Please choose 'new', 'list', or 'exit'.");
        }
    }

    return { getUserAction, handleUserAction }
})();

export { AppController }