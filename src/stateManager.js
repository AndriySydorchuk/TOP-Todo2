const stateManager = (() => {
    let editingTodoId = null;
    let currentProject = null;

    function setEditingTodoId(id) {
        editingTodoId = id;
    }

    function getEditingTodoId() {
        return editingTodoId;
    }

    function setCurrentProject(projectName) {
        currentProject = projectName;
    }

    function getCurrentProject() {
        return currentProject;
    }

    return {
        setEditingTodoId,
        getEditingTodoId,
        setCurrentProject,
        getCurrentProject,
    };
})();

export { stateManager };