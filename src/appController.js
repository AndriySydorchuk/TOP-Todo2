import { createTodo } from './todo';
import { collectionManager } from './collectionManager';

const AppController = (() => {
    const getUserAction = () => {
        return prompt("Menu: \nType 'new' to create a new todo. \n\nWhat would you like to do?");
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
        }
    }

    return { getUserAction, handleUserAction }
})();

export { AppController }