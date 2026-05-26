import { domManager } from './domManager';

const eventManager = (() => {
    function init() {
        // projects view
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

    return { bindProjectCardEvent };
})();

export { eventManager };