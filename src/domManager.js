import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"
import { createTodo } from './todo';
import { modalController } from './modalController';

const domManager = (() => {
    function init() {
        handleNewProjectBtn();
        renderProjectsView();

        handleNewTodoBtn();
        handleTodosBackBtn();
    }

    // PROJECTS VIEW

    function renderProjectsView() {
        //update projects list
        collectionManager.init();
        const projectNamesArr = collectionManager.getProjectNames();

        const projectsGridElement = document.querySelector(".projects-grid");
        //clear previous content
        projectsGridElement.innerHTML = "";

        //create card for each project
        projectNamesArr.forEach(projectName => {
            const card = document.createElement("div");
            card.classList.add("project-card");
            card.textContent = projectName;

            projectsGridElement.appendChild(card);
        })

        handleProjectCardClick();
    }

    function handleNewProjectBtn() {
        const newProjectBtn = document.querySelector(".new-project-btn");
        const container = document.querySelector(".top-container");

        const nameInput = document.createElement("input");
        nameInput.classList.add("project-name-input", "hidden");
        nameInput.placeholder = "Type new project name";

        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-project-btn", "hidden");
        saveBtn.textContent = "Save";

        container.append(nameInput, saveBtn);

        newProjectBtn.addEventListener("click", () => {
            newProjectBtn.classList.add("hidden");

            nameInput.classList.remove("hidden");
            saveBtn.classList.remove("hidden");

            nameInput.focus();
        })

        saveBtn.addEventListener("click", () => {
            const existingProjectNames = collectionManager.getProjectNames();
            const newProjectName = nameInput.value.trim();

            if (!newProjectName) {
                alert("Project name cannot be empty");
                return;
            }

            if (existingProjectNames.includes(newProjectName)) {
                alert(`There's already project named '${newProjectName}'`);
                return;
            }

            storageManager.saveList(newProjectName, []);

            nameInput.value = "";
            nameInput.classList.add("hidden");
            saveBtn.classList.add("hidden");

            newProjectBtn.classList.remove("hidden");

            renderProjectsView();
        })
    }

    function handleProjectCardClick() {
        const projectCards = document.querySelectorAll(".project-card");

        projectCards.forEach((projectCard) => {
            projectCard.addEventListener("click", () => {
                const projectView = document.querySelector(".projects-view");
                const todosView = document.querySelector(".todos-view");

                projectView.classList.add("hidden");
                todosView.classList.remove("hidden");

                renderTodosView(projectCard.textContent);
            })
        })
    }

    // TODOS VIEW

    function renderTodosView(projectName) {
        const todosViewTitle = document.querySelector(".todos-title");
        todosViewTitle.textContent = projectName;

        const todosContainer = document.querySelector(".todos-container");
        todosContainer.innerHTML = "";

        handleDeleteProjectBtn();

        //create cards
        const todosArr = collectionManager.getProjectTodos(projectName);
        todosArr.forEach((todo, index) => {
            const todoCard = document.createElement("div");
            todoCard.classList.add("todo-card");
            todoCard.dataset.id = index;

            const todoTitle = document.createElement("p");
            todoTitle.classList.add("todo-card-title");
            todoTitle.textContent = todo.title;

            //create delete todo btn
            const deleteTodoBtn = document.createElement("button");
            deleteTodoBtn.textContent = "Delete";
            deleteTodoBtn.classList.add("delete-todo-btn");
            todoTitle.appendChild(deleteTodoBtn);

            todoCard.appendChild(todoTitle);
            todosContainer.appendChild(todoCard);
        })

        handleDeleteTodoBtns(projectName);
        handleTodoCardExpand(projectName);
    }

    function handleTodoCardExpand(projectName) {
        const projectTodosArr = collectionManager.getProjectTodos(projectName);

        const todoCards = document.querySelectorAll(".todo-card");
        todoCards.forEach((todoCard, index) => {
            todoCard.addEventListener("click", () => {
                const todoCardTitle = todoCard.firstElementChild;

                const todoObj = projectTodosArr[index];

                todoCard.innerHTML = "";

                //create descr paragraph and so on
                const todoDescr = document.createElement("p");
                todoDescr.textContent = `Description: ${todoObj.description}`;

                const todoDueDate = document.createElement("p");
                todoDueDate.textContent = `Due Date: ${todoObj.dueDate}`;

                const todoPriority = document.createElement("p");
                todoPriority.textContent = `Priority: ${todoObj.priority}`;

                todoCard.append(todoCardTitle, todoDescr, todoDueDate, todoPriority);
            })
        })
    }

    function handleTodosBackBtn() {
        const backBtn = document.querySelector(".todos-view .back-btn");
        backBtn.addEventListener("click", () => {
            const projectsView = document.querySelector(".projects-view");
            const todosView = document.querySelector(".todos-view");

            projectsView.classList.remove("hidden");
            todosView.classList.add("hidden");
            renderProjectsView();
        })
    }

    function handleNewTodoBtn() {
        const newTodoBtn = document.querySelector(".new-todo-btn");

        const modal = modalController.create();
        const saveBtn = modal.querySelector(".save-todo-btn");
        const cancelBtn = modal.querySelector(".cancel-btn");

        newTodoBtn.addEventListener("click", () => {
            modalController.show();
        })

        saveBtn.addEventListener("click", () => {
            const newTodoValues = modalController.getInputValues();

            if (newTodoValues.title === "" || newTodoValues.priority === "") {
                alert("Title and priority fields cannot be empty");
                return;
            }

            const projectName = document.querySelector(".todos-title").textContent.trim();

            const newTodo = createTodo(newTodoValues.title, newTodoValues.descr, newTodoValues.dueDate, newTodoValues.priority);
            collectionManager.addTodo(newTodo, projectName);
            storageManager.saveList(projectName, collectionManager.getProjectTodos(projectName));

            modalController.resetInputs();
            modalController.hide();

            renderTodosView(projectName);
        })

        cancelBtn.addEventListener("click", () => {
            modalController.resetInputs();
            modalController.hide();
        })
    }

    function handleDeleteTodoBtns(projectName) {
        const deleteBtns = document.querySelectorAll(".delete-todo-btn");
        deleteBtns.forEach((deleteBtn) => {
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                const todoCard = deleteBtn.closest(".todo-card");

                const todoToDeleteId = Number.parseInt(todoCard.dataset.id, 10);

                const isDeleted = collectionManager.deleteTodo(todoToDeleteId, projectName);

                if (isDeleted) {
                    storageManager.saveList(projectName, collectionManager.getProjectTodos(projectName));
                    alert("Todo was successfully deleted");
                    renderTodosView(projectName);
                }
                else {
                    alert("Todo deletion failed.");
                }

            })
        })
    }

    function handleDeleteProjectBtn() {
        const deleteBtn = document.querySelector(".delete-project-btn");

        deleteBtn.addEventListener("click", (e) => {
            const projectName = document.querySelector(".todos-title").textContent.trim();

            storageManager.removeList(projectName);
            collectionManager.init();

            const todosView = document.querySelector(".todos-view");
            const projectsView = document.querySelector(".projects-view");

            todosView.classList.add("hidden");
            projectsView.classList.remove("hidden");

            renderProjectsView();
        })
    }

    return { init }
})();

export { domManager };