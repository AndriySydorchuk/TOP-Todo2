import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"

const domManager = (() => {
    function init() {
        handleNewProjectBtn();
        renderProjectsView();

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

                renderTodosView(projectCard);
            })
        })
    }

    // TODOS VIEW

    function renderTodosView(projectCard) {
        const projectName = projectCard.textContent;

        const todosViewTitle = document.querySelector(".todos-title");
        todosViewTitle.textContent = projectName;

        const todosContainer = document.querySelector(".todos-container");
        todosContainer.innerHTML = "";

        const todosArr = collectionManager.getProjectTodos(projectName);
        todosArr.forEach(todo => {
            const todoCard = document.createElement("div");
            todoCard.classList.add("todo-card");

            const todoTitle = document.createElement("p");
            todoTitle.classList.add("todo-card-title");
            todoTitle.textContent = todo.title;

            todoCard.appendChild(todoTitle);
            todosContainer.appendChild(todoCard);
        })

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

    return { init }
})();

export { domManager };