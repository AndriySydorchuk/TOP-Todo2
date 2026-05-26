import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"
import { createTodo } from './todo';
import { modalController } from './modalController';

const domManager = (() => {
    let editingTodoId = null;

    function init() {
        // projects view
        createNewProjectForm();
        renderProjectsView();

        // todos view
        modalController.create();
        createEditProjectForm();
        handleDeleteProjectBtn();
    }

    // PROJECTS VIEW

    function renderProjectsView() {
        //update projects list
        collectionManager.loadCollection();
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
    }

    function createNewProjectForm() {
        const newProjectBtn = document.querySelector(".new-project-btn");
        const container = document.querySelector(".top-container");

        const nameInput = document.createElement("input");
        nameInput.classList.add("project-name-input", "hidden");
        nameInput.placeholder = "Type new project name";

        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-project-btn", "hidden");
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-btn", "hidden");
        cancelBtn.textContent = "Cancel";

        container.append(nameInput, saveBtn, cancelBtn);
    }

    function showNewProjectForm() {
        const newProjectBtn = document.querySelector(".new-project-btn");

        const nameInput = document.querySelector(".project-name-input");
        const saveBtn = document.querySelector(".save-project-btn");
        const cancelBtn = document.querySelector(".cancel-btn");

        hide(newProjectBtn);
        show(nameInput, saveBtn, cancelBtn);

        nameInput.focus();
    }

    function showEditProjectForm() {
        const todosTitle = document.querySelector(".todos-title");
        const deleteBtn = document.querySelector(".delete-project-btn");
        const nameInput = document.querySelector(".edit-project-name-input");
        const editBtn = document.querySelector(".edit-project-btn");
        const saveBtn = document.querySelector(".save-edit-project-btn");
        const cancelBtn = document.querySelector(".cancel-edit-project-btn");

        hide(todosTitle, editBtn, deleteBtn);
        show(nameInput, saveBtn, cancelBtn);

        nameInput.focus();

    }

    function saveNewProject() {
        const nameInput = document.querySelector("project-name-input");

        const existingProjectNames = collectionManager.getProjectNames();
        const newProjectName = nameInput.value.trim();

        if (!newProjectName) return;

        if (existingProjectNames.includes(newProjectName)) return;

        storageManager.save(newProjectName, []);

        resetNewProjectForm();
        renderProjectsView();
    }

    // TODOS VIEW

    function renderTodosView(projectName) {
        const todosViewTitle = document.querySelector(".todos-title");
        todosViewTitle.textContent = projectName;

        const todosContainer = document.querySelector(".todos-container");
        todosContainer.innerHTML = "";

        //create cards
        const todosArr = collectionManager.getProjectTodos(projectName);
        todosArr.forEach((todo, index) => {
            const todoCard = document.createElement("div");
            todoCard.classList.add("todo-card");
            todoCard.dataset.id = index;

            const todoHeader = document.createElement("div");
            todoHeader.classList.add("todo-card-header");

            const todoActions = document.createElement("div");
            todoActions.classList.add("todo-card-actions");

            const todoTitle = document.createElement("p");
            todoTitle.classList.add("todo-card-title");
            todoTitle.textContent = todo.title;

            //create edit todo btn
            const editTodoBtn = document.createElement("button");
            editTodoBtn.textContent = "Edit";
            editTodoBtn.classList.add("edit-todo-btn");

            //create delete todo btn
            const deleteTodoBtn = document.createElement("button");
            deleteTodoBtn.textContent = "Delete";
            deleteTodoBtn.classList.add("delete-todo-btn");

            todoActions.append(editTodoBtn, deleteTodoBtn);
            todoHeader.append(todoTitle, todoActions);
            todoCard.appendChild(todoHeader);
            todosContainer.appendChild(todoCard);
        })
    }

    function getCurrentProjectName() {
        const projectsViewTitle = document.querySelector(".todos-title");

        return projectsViewTitle.textContent.trim();
    }

    function expandTodoCard(todoCard) {
        const projectTodos = collectionManager.getProjectTodos(getCurrentProjectName());

        const todoCardTitle = todoCard.firstElementChild;

        const todoIndex = Number.parseInt(todoCard.dataset.id, 10);
        const todoObj = projectTodos[todoIndex];

        if (todoCard.classList.contains("expanded")) {
            todoCard.classList.remove("expanded");

            todoCard.innerHTML = "";

            todoCard.appendChild(todoCardTitle);
            return;
        }

        todoCard.classList.add("expanded");

        todoCard.innerHTML = "";

        //create descr paragraph and so on
        const todoDescr = document.createElement("p");
        todoDescr.textContent = `Description: ${todoObj.description}`;

        const todoDueDate = document.createElement("p");
        todoDueDate.textContent = `Due Date: ${todoObj.dueDate}`;

        const todoPriority = document.createElement("p");
        todoPriority.textContent = `Priority: ${todoObj.priority}`;

        todoCard.append(todoCardTitle, todoDescr, todoDueDate, todoPriority);
    }

    function returnToProjectsView() {
        toggleAppView();
        resetEditProjectForm();
        renderProjectsView();
    }

    function saveTodo() {
        const newTodoValues = modalController.getInputValues();

        if (
            newTodoValues.title === "" ||
            newTodoValues.priority === "" ||
            newTodoValues.dueDate === ""
        ) return;

        const projectName = getCurrentProjectName();

        const todo = createTodo(
            newTodoValues.title,
            newTodoValues.description,
            newTodoValues.dueDate,
            newTodoValues.priority
        )

        if (editingTodoId !== null) {
            collectionManager.updateTodo(projectName, editingTodoId, todo);
            editingTodoId = null;
        } else {
            collectionManager.addTodo(todo, projectName);
        }

        storageManager.save(projectName, collectionManager.getProjectTodos(projectName));

        modalController.resetInputs();
        hide(modalController.getModal());

        renderTodosView(projectName);
    }

    function editTodo(todoCard) {
        const projectName = getCurrentProjectName();

        const todoId = Number.parseInt(todoCard.dataset.id, 10);

        const todoObj = collectionManager.getProjectTodos(projectName)[todoId];

        editingTodoId = todoId;

        modalController.setInputValues(todoObj);
        show(modalController.getModal());
    }

    function deleteTodo(todoCard) {
        const projectName = getCurrentProjectName();

        const todoToDeleteId = Number.parseInt(todoCard.dataset.id, 10);

        const isDeleted = collectionManager.deleteTodo(todoToDeleteId, projectName);

        if (isDeleted) {
            storageManager.save(projectName, collectionManager.getProjectTodos(projectName));
            renderTodosView(projectName);
        }
    }

    function handleDeleteProjectBtn() {
        const deleteBtn = document.querySelector(".delete-project-btn");

        deleteBtn.addEventListener("click", (e) => {
            const projectName = getCurrentProjectName();

            storageManager.remove(projectName);
            collectionManager.loadCollection();

            const todosView = document.querySelector(".todos-view");
            const projectsView = document.querySelector(".projects-view");

            todosView.classList.add("hidden");
            projectsView.classList.remove("hidden");

            renderProjectsView();
        })
    }

    function createEditProjectForm() {
        const container = document.querySelector(".todos-header-actions");

        const nameInput = document.createElement("input");
        nameInput.classList.add("edit-project-name-input", "hidden");
        nameInput.placeholder = "Type new project name";

        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-edit-project-btn", "hidden");
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-edit-project-btn", "hidden");
        cancelBtn.textContent = "Cancel";

        container.append(nameInput, saveBtn, cancelBtn);
    }

    function saveProjectEdit() {
        const nameInput = document.querySelector(".edit-project-name-input");

        const existingProjectNames = collectionManager.getProjectNames();
        const newProjectName = nameInput.value.trim();

        if (!newProjectName) return

        if (existingProjectNames.includes(newProjectName)) return;

        storageManager.save(newProjectName, collectionManager.getProjectTodos(getCurrentProjectName()));
        storageManager.remove(getCurrentProjectName());

        resetEditProjectForm();

        collectionManager.loadCollection();
        renderTodosView(newProjectName);
    }

    function resetEditProjectForm() {
        const todosTitle = document.querySelector(".todos-title");
        const nameInput = document.querySelector(".edit-project-name-input");
        const saveBtn = document.querySelector(".save-edit-project-btn");
        const cancelBtn = document.querySelector(".cancel-edit-project-btn");
        const editBtn = document.querySelector(".edit-project-btn");
        const deleteBtn = document.querySelector(".delete-project-btn");

        nameInput.value = "";

        hide(nameInput, saveBtn, cancelBtn);
        show(todosTitle, editBtn, deleteBtn);
    }

    function show(...elements) {
        elements.forEach(element => element.classList.remove("hidden"));
    }

    function hide(...elements) {
        elements.forEach(element => element.classList.add("hidden"));
    }

    function resetNewProjectForm() {
        const newProjectBtn = document.querySelector(".new-project-btn");
        const nameInput = document.querySelector(".project-name-input");
        const saveBtn = document.querySelector(".save-project-btn");
        const cancelBtn = document.querySelector(".cancel-btn");

        nameInput.value = "";
        hide(nameInput, saveBtn, cancelBtn);
        show(newProjectBtn);
    }

    function resetEditProjectForm() {
        const nameInput = document.querySelector(".edit-project-name-input");
        const saveBtn = document.querySelector(".save-edit-project-btn");
        const cancelBtn = document.querySelector(".cancel-edit-project-btn");

        const todosTitle = document.querySelector(".todos-title");
        const editProjectBtn = document.querySelector(".edit-project-btn");
        const deleteProjectBtn = document.querySelector(".delete-project-btn");

        nameInput.value = "";

        hide(nameInput, saveBtn, cancelBtn);
        show(todosTitle, editProjectBtn, deleteProjectBtn);
    }

    function toggleAppView() {
        const projectsView = document.querySelector(".projects-view");
        const todosView = document.querySelector(".todos-view");

        projectsView.classList.toggle("hidden");
        todosView.classList.toggle("hidden");
    }

    function openProject(projectName) {
        domManager.toggleAppView();
        domManager.resetNewProjectForm();
        renderTodosView(projectName);
    }

    return { init, show, hide, toggleAppView, showNewProjectForm, showEditProjectForm, saveNewProject, resetNewProjectForm, resetEditProjectForm, openProject, saveTodo, editTodo, deleteTodo, expandTodoCard, returnToProjectsView, saveProjectEdit }
})();

export { domManager };