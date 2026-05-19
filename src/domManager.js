import { storageManager } from "./storageManager"
import { collectionManager } from "./collectionManager"

const domManager = (() => {
    function renderProjectsView() {
        //get project list
        //get projects view container
        //create card based on existing projects

        const projectNamesArr = collectionManager.getProjectNames();

        const projectsGridEl = document.querySelector(".projects-grid");

        projectNamesArr.forEach(projectName => {
            const card = document.createElement("div");
            card.classList.add("project-card");

            const cardTitle = document.createElement("p");
            cardTitle.classList.add("project-card-title");
            cardTitle.textContent = projectName;

            card.appendChild(cardTitle);
            projectsGridEl.appendChild(card);
        })
    }

    function renderTodosView() {

    }

    return { renderProjectsView, renderTodosView }
})();

export { domManager };