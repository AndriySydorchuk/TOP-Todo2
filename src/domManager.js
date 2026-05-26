import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"
import { createTodo } from './todo';
import { modalController } from './modalController';
import { stateManager } from './stateManager';

const domManager = (() => {
    function init() {
        // projects view
        createProjectForm(
            "top-container",
            "project-name-input",
            "save-project-btn",
            "cancel-btn"
        )
        renderProjectsView();

        // todos view
        modalController.create();
        createProjectForm(
            "todos-header-actions",
            "edit-project-name-input",
            "save-edit-project-btn",
            "cancel-edit-project-btn"
        )
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

    function showNewProjectForm() {
        const newProjectBtn = document.querySelector(".new-project-btn");

        const nameInput = document.querySelector(".project-name-input");
        const saveBtn = document.querySelector(".save-project-btn");
        const cancelBtn = document.querySelector(".cancel-btn");

        hide(newProjectBtn);
        show(nameInput, saveBtn, cancelBtn);

        nameInput.focus();
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

    function saveNewProject() {
        const nameInput = document.querySelector(".project-name-input");

        const existingProjectNames = collectionManager.getProjectNames();
        const newProjectName = nameInput.value.trim();

        if (!newProjectName) return;

        if (existingProjectNames.includes(newProjectName)) return;

        storageManager.save(newProjectName, []);

        resetNewProjectForm();
        renderProjectsView();
    }

    function saveProjectEdit() {
        const nameInput = document.querySelector(".edit-project-name-input");

        const existingProjectNames = collectionManager.getProjectNames();
        const newProjectName = nameInput.value.trim();

        if (!newProjectName) return

        if (existingProjectNames.includes(newProjectName)) return;

        storageManager.save(newProjectName, collectionManager.getProjectTodos(stateManager.getCurrentProject()));
        storageManager.remove(stateManager.getCurrentProject());

        stateManager.setCurrentProject(newProjectName);

        resetEditProjectForm();

        collectionManager.loadCollection();
        renderTodosView(newProjectName);
    }

    function deleteProject() {
        const projectName = stateManager.getCurrentProject();

        storageManager.remove(projectName);
        stateManager.setCurrentProject(null);
        collectionManager.loadCollection();

        toggleAppView();
        renderProjectsView();
    }

    // TODOS VIEW

    function renderTodosView() {
        const projectName = stateManager.getCurrentProject();

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

    function expandTodoCard(todoCard) {
        const projectName = stateManager.getCurrentProject();
        const projectTodos = collectionManager.getProjectTodos(projectName);

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

    function saveTodo() {
        const newTodoValues = modalController.getInputValues();

        if (
            newTodoValues.title === "" ||
            newTodoValues.priority === "" ||
            newTodoValues.dueDate === ""
        ) return;

        const projectName = stateManager.getCurrentProject();

        const todo = createTodo(
            newTodoValues.title,
            newTodoValues.description,
            newTodoValues.dueDate,
            newTodoValues.priority
        )

        if (stateManager.getEditingTodoId() !== null) {
            collectionManager.updateTodo(projectName, stateManager.getEditingTodoId(), todo);
            stateManager.setEditingTodoId(null);
        } else {
            collectionManager.addTodo(todo, projectName);
        }

        storageManager.save(projectName, collectionManager.getProjectTodos(projectName));

        modalController.resetInputs();
        hide(modalController.getModal());

        renderTodosView(projectName);
    }

    function editTodo(todoCard) {
        const projectName = stateManager.getCurrentProject();

        const todoId = Number.parseInt(todoCard.dataset.id, 10);

        const todoObj = collectionManager.getProjectTodos(projectName)[todoId];

        stateManager.setEditingTodoId(todoId);

        modalController.setInputValues(todoObj);
        show(modalController.getModal());
    }

    function deleteTodo(todoCard) {
        const projectName = stateManager.getCurrentProject();

        const todoToDeleteId = Number.parseInt(todoCard.dataset.id, 10);

        const isDeleted = collectionManager.deleteTodo(todoToDeleteId, projectName);

        if (isDeleted) {
            storageManager.save(projectName, collectionManager.getProjectTodos(projectName));
            renderTodosView(projectName);
        }
    }

    function openProject() {
        domManager.toggleAppView();
        domManager.resetNewProjectForm();
        renderTodosView(stateManager.getCurrentProject());
    }

    function returnToProjectsView() {
        toggleAppView();
        resetEditProjectForm();
        renderProjectsView();
    }

    // HELPERS
    function show(...elements) {
        elements.forEach(element => element.classList.remove("hidden"));
    }

    function hide(...elements) {
        elements.forEach(element => element.classList.add("hidden"));
    }

    function toggleAppView() {
        const projectsView = document.querySelector(".projects-view");
        const todosView = document.querySelector(".todos-view");

        projectsView.classList.toggle("hidden");
        todosView.classList.toggle("hidden");
    }

    function createProjectForm(
        containerClassName,
        nameInputClassName,
        saveBtnClassName,
        cancelBtnClassName
    ) {
        const container = document.querySelector(`.${containerClassName}`);

        const nameInput = document.createElement("input");
        nameInput.classList.add(nameInputClassName, "hidden");
        nameInput.placeholder = "Type new project name";

        const saveBtn = document.createElement("button");
        saveBtn.classList.add(saveBtnClassName, "hidden");
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add(cancelBtnClassName, "hidden");
        cancelBtn.textContent = "Cancel";

        container.append(nameInput, saveBtn, cancelBtn);
    }

    return {
        init,

        showNewProjectForm,
        resetNewProjectForm,

        showEditProjectForm,
        resetEditProjectForm,

        saveNewProject,
        saveProjectEdit,
        deleteProject,

        expandTodoCard,

        saveTodo,
        editTodo,
        deleteTodo,

        openProject,
        returnToProjectsView,

        show,
        hide,
        toggleAppView,
    }
})();

export { domManager };