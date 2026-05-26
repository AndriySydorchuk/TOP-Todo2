import { domManager } from './domManager';

const eventManager = (() => {
    function init() {
        // projects view
        bindNewProjectForm();
        bindProjectCardEvent();
    }

    function bindProjectCardEvent() {
        const projectsGrid = document.querySelector(".projects-grid");

        projectsGrid.addEventListener("click", (e) => {
            const projectCard = e.target.closest(".project-card");

            if (!projectCard) return;

            const projectName = projectCard.textContent;

            domManager.openProject(projectName);
        })
    }

    function bindNewProjectForm() {
        const newProjectBtn = document.querySelector(".new-project-btn");
        const saveBtn = document.querySelector(".save-project-btn");
        const cancelBtn = document.querySelector(".cancel-btn");

        newProjectBtn.addEventListener("click", () => {
            domManager.showNewProjectForm();
        })

        saveBtn.addEventListener("click", () => {
            domManager.saveNewProject();
        })

        cancelBtn.addEventListener("click", () => {
            domManager.resetNewProjectForm();
        })
    }

    return { init };
})();

export { eventManager };