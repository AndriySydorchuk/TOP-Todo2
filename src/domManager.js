import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"

const domManager = (() => {
    function init() {
        renderProjectsView();
        handleNewProjectBtn();
    }

    function renderProjectsView() {
        //get project list
        //get projects view container
        //create card based on existing projects

        collectionManager.init();

        const projectNamesArr = collectionManager.getProjectNames();

        const projectsGridEl = document.querySelector(".projects-grid");
        projectsGridEl.innerHTML = "";

        projectNamesArr.forEach(projectName => {
            const card = document.createElement("div");
            card.classList.add("project-card");

            const cardTitle = document.createElement("p");
            cardTitle.classList.add("project-card-title");
            cardTitle.textContent = projectName;

            card.appendChild(cardTitle);
            projectsGridEl.appendChild(card);
        })

        handleProjectCardClick();
    }

    function renderTodosView(projectCard) {
        const projectName = projectCard.firstElementChild.textContent;

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

        handleTodosBackBtn();
    }

    function handleTodoCardExpand(projectName) {
        const projectTodosArr = collectionManager.getProjectTodos(projectName);

        const todoCards = document.querySelectorAll(".todo-card");
        todoCards.forEach(todoCard => {
            todoCard.addEventListener("click", () => {
                const todoCardTitle = todoCard.firstElementChild;

                const todoObj = projectTodosArr.find((todo) => todo.title === todoCardTitle.textContent);

                //check if already present or clear
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

    function handleProjectCardClick() {
        //grab all project cards
        //put click event listener on each card
        //on click - hide projects view, display it's todos view

        const projectCards = document.querySelectorAll(".project-card");

        projectCards.forEach((projectCard) => {
            projectCard.addEventListener("click", (e) => {
                const projectView = document.querySelector(".projects-view");
                const todosView = document.querySelector(".todos-view");

                projectView.classList.add("hidden");
                todosView.classList.remove("hidden");

                renderTodosView(projectCard);
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

    function handleNewProjectBtn() {
        const newProjectBtn = document.querySelector(".new-project-btn");
        newProjectBtn.addEventListener("click", () => {
            //hide new project btn
            newProjectBtn.classList.add("hidden");

            //clear container
            const container = document.querySelector(".top-container");

            while (container.children.length > 1) {
                container.lastElementChild.remove();
            }

            //create input element and save btn
            const projectNameInput = document.createElement("input");
            projectNameInput.placeholder = "Type new project name";

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "Save";

            saveBtn.addEventListener("click", () => {
                //check if new project name doesn't exist

                storageManager.saveList(projectNameInput.value, []);

                projectNameInput.remove();
                saveBtn.remove();

                newProjectBtn.classList.remove("hidden");

                renderProjectsView();
            })

            container.append(projectNameInput, saveBtn);
        })
    }

    return { init }
})();

export { domManager };