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

        handleNewTodoBtn();
        handleTodosBackBtn();
        handleEditProjectBtn();
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
        todosArr.forEach((todo) => {
            const todoCard = document.createElement("div");
            todoCard.classList.add("todo-card");
            todoCard.dataset.id = todo.id;

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

        handleEditTodoBtns(projectName);
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

            const nameInput = document.querySelector(".edit-project-name-input");
            const saveBtn = document.querySelector(".save-edit-project-btn");
            const cancelBtn = document.querySelector(".cancel-edit-project-btn");

            nameInput.value = "";

            nameInput.classList.add("hidden");
            saveBtn.classList.add("hidden");
            cancelBtn.classList.add("hidden");

            document.querySelector(".todos-title").classList.remove("hidden");
            document.querySelector(".edit-project-btn").classList.remove("hidden");
            document.querySelector(".delete-project-btn").classList.remove("hidden");

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
            modalController.hide();

            renderTodosView(projectName);
        })

        cancelBtn.addEventListener("click", () => {
            modalController.resetInputs();
            modalController.hide();
        })
    }

    function handleEditTodoBtns(projectName) {
        const editBtns = document.querySelectorAll(".edit-todo-btn");

        editBtns.forEach((editBtn) => {
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                const todoCard = editBtn.closest(".todo-card");
                const todoId = Number.parseInt(todoCard.dataset.id, 10);

                const todoObj = collectionManager.getProjectTodos(projectName)[todoId];

                editingTodoId = todoId;

                modalController.setInputValues(todoObj);
                modalController.show();
            })
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
                    storageManager.save(projectName, collectionManager.getProjectTodos(projectName));
                    renderTodosView(projectName);
                }

            })
        })
    }

    function handleDeleteProjectBtn() {
        const deleteBtn = document.querySelector(".delete-project-btn");

        deleteBtn.addEventListener("click", (e) => {
            const projectName = document.querySelector(".todos-title").textContent.trim();

            storageManager.remove(projectName);
            collectionManager.loadCollection();

            const todosView = document.querySelector(".todos-view");
            const projectsView = document.querySelector(".projects-view");

            todosView.classList.add("hidden");
            projectsView.classList.remove("hidden");

            renderProjectsView();
        })
    }

    function handleEditProjectBtn() {
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

        const editProjectBtn = document.querySelector(".edit-project-btn");
        const todosTitle = document.querySelector(".todos-title");

        const currentProjectName = todosTitle.textContent.trim();

        editProjectBtn.addEventListener("click", () => {
            todosTitle.classList.add("hidden");
            editProjectBtn.classList.add("hidden");
            document.querySelector(".delete-project-btn").classList.add("hidden");

            nameInput.classList.remove("hidden");
            saveBtn.classList.remove("hidden");
            cancelBtn.classList.remove("hidden");

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

            storageManager.save(newProjectName, collectionManager.getProjectTodos(currentProjectName));
            storageManager.remove(currentProjectName);

            nameInput.value = "";
            nameInput.classList.add("hidden");
            saveBtn.classList.add("hidden");
            cancelBtn.classList.add("hidden");

            todosTitle.classList.remove("hidden");
            editProjectBtn.classList.remove("hidden");
            document.querySelector(".delete-project-btn").classList.remove("hidden");

            collectionManager.loadCollection();
            renderTodosView(newProjectName);
        })

        cancelBtn.addEventListener("click", () => {
            nameInput.value = "";
            nameInput.classList.add("hidden");
            saveBtn.classList.add("hidden");
            cancelBtn.classList.add("hidden");

            todosTitle.classList.remove("hidden");
            editProjectBtn.classList.remove("hidden");
            document.querySelector(".delete-project-btn").classList.remove("hidden");
        })

    }

    function show(...elements) {
        elements.forEach(element => element.classList.remove("hidden"));
    }

    function hide(...elements) {
        elements.forEach(element => element.classList.add("hidden"));
    }

    function resetNewProjectForm() {
        const nameInput = document.querySelector(".project-name-input");
        const saveBtn = document.querySelector(".save-project-btn");
        const cancelBtn = document.querySelector(".cancel-btn");
        const newProjectBtn = document.querySelector(".new-project-btn");

        nameInput.value = "";
        hide(nameInput, saveBtn, cancelBtn);
        show(newProjectBtn);
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

    return { init, show, hide, toggleAppView, showNewProjectForm, saveNewProject, resetNewProjectForm }
})();

export { domManager };