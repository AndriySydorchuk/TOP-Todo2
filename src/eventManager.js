import { domManager } from './domManager';

const eventManager = (() => {
    function init() {
        // projects view
        bindNewProjectForm();
        bindProjectCardEvent();

        // todos view
        bindTodoActions();
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

    function bindTodoActions() {
        const todosContainer = document.querySelector(".todos-container");

        todosContainer.addEventListener("click", (e) => {
            const editBtn = e.target.closest(".edit-todo-btn");
            const deleteBtn = e.target.closest(".delete-todo-btn");
            const todoCard = editBtn.closest(".todo-card");

            if (!todoCard) return;

            if (editBtn) {
                domManager.editTodo(todoCard);
                return;
            }

            if (deleteBtn) {
                domManager.deleteTodo(todoCard);
                return;
            }

        })
    }

    return { init };
})();

export { eventManager };