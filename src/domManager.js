import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"

const domManager = (() => {
    function init() {
        renderProjectsView();
    }

    function renderProjectsView() {
        //get project list
        //get projects view container
        //create card based on existing projects

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
            todoTitle.classList.add("todo-title");
            todoTitle.textContent = todo.title;

            todoCard.appendChild(todoTitle);
            todosContainer.appendChild(todoCard);
        })

        handleTodosBackBtn();
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

    return { init }
})();

export { domManager };