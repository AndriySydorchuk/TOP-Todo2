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
        //display projects
        const projectNamesArr = collectionManager.getProjectNames();
        const formattedProjectNames = `Projects: \n${projectNamesArr.map((name, index) => `${index + 1}. ${name}`).join("\n")}`;

        //user chooses project
        const selectedProjectName = prompt(`${formattedProjectNames}\nType name of the project in which you want to delete your todo:`);

        const selectedTodosArr = collectionManager.getProjectTodos(selectedProjectName);

        const todoIndex = prompt(
            `Project '${selectedProjectName}':
${selectedTodosArr.map((todo, index) => {
                return `${index + 1}. ${todo.title}`
            }).join("\n")}                    
Enter the id of the todo you want to delete:`
        )

        //format todoIndex
        const todoIndexFormatted = Number.parseInt(todoIndex, 10) - 1;

        const isDeleted = collectionManager.deleteTodo(todoIndexFormatted, selectedProjectName);

        if (isDeleted) {
            storageManager.saveList(selectedProjectName, collectionManager.getProjectTodos(selectedProjectName));
            alert("Todo was successfully deleted");
        }
        else {
            alert("Todo deletion failed.");
        }
    }

    function handleNewTodo() {
        //display projects
        const projectNamesArr = collectionManager.getProjectNames();
        const formattedProjectNames = `Projects: \n${projectNamesArr.map((name, index) => `${index + 1}. ${name}`).join("\n")}`;

        //user chooses project
        const selectedProjectName = prompt(`${formattedProjectNames}\nType name of the project in which you want to save your todo OR type new name to create new project and proceed:`);

        const selectedTodosArr = collectionManager.getProjectTodos(selectedProjectName);

        const title = prompt(`Project '${selectedProjectName}'\nEnter the todo title:`);
        const description = prompt(`Project '${selectedProjectName}'\nEnter the todo description:`);
        const dueDate = prompt(`Project '${selectedProjectName}'\nEnter the due date (YYYY-MM-DD):`);
        const priority = prompt(`Project '${selectedProjectName}'\nEnter the priority (Low, Medium, High):`);

        const newTodo = createTodo(title, description, dueDate, priority);
        collectionManager.addTodo(newTodo, selectedProjectName);
        storageManager.saveList(selectedProjectName, collectionManager.getProjectTodos(selectedProjectName));

        alert(
            `New Todo Created:
            Project: ${selectedProjectName}
            Title: ${newTodo.title}
            Description: ${newTodo.description}
            Due Date: ${newTodo.dueDate}
            Priority: ${newTodo.priority}`
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