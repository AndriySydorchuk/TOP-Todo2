import { domManager } from './domManager';
import { modalController } from './modalController';

const eventManager = (() => {
    function init() {
        // projects view
        bindNewProjectForm();
        bindProjectCardEvent();

        // todos view
        bindTodoCardActions();
        bindTodoViewActions();
        bindModal();
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

    function bindTodoCardActions() {
        const todosContainer = document.querySelector(".todos-container");

        todosContainer.addEventListener("click", (e) => {
            const editBtn = e.target.closest(".edit-todo-btn");
            const deleteBtn = e.target.closest(".delete-todo-btn");
            const todoCard = e.target.closest(".todo-card");

            if (editBtn) {
                domManager.editTodo(todoCard);
                return;
            }

            if (deleteBtn) {
                domManager.deleteTodo(todoCard);
                return;
            }

            if (todoCard) {
                domManager.expandTodoCard(todoCard);
                return;
            }
        })
    }

    function bindTodoViewActions() {
        const actionsContainer = document.querySelector(".actions");

        actionsContainer.addEventListener("click", (e) => {
            const goBackBtn = e.target.closest(".back-btn");

            if (goBackBtn) {
                domManager.returnToProjectsView();
                return;
            }
        })
    }

    function bindModal() {
        const newTodoBtn = document.querySelector(".new-todo-btn");

        const modal = modalController.getModal();
        const modalContent = document.querySelector(".newtodo-modal-content");

        newTodoBtn.addEventListener("click", () => {
            domManager.show(modal);
        })

        modal.addEventListener("click", (e) => {
            if (e.target === modal) domManager.hide(modal)
        })

        modalContent.addEventListener("click", (e) => {
            const saveBtn = e.target.closest(".save-todo-btn");
            const cancelBtn = e.target.closest(".cancel-btn");

            if (saveBtn) {
                domManager.saveTodo();
                return;
            }

            if (cancelBtn) {
                modalController.resetInputs();
                domManager.hide(modal);
            }
        })

    }

    return { init };
})();

export { eventManager };