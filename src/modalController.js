const modalController = (() => {
    function create() {
        const container = document.querySelector(".actions");

        const modal = document.createElement("div");
        modal.classList.add("newtodo-modal", "hidden");
        const modalContent = document.createElement("div");
        modalContent.classList.add("newtodo-modal-content");

        const titleSection = createInput("input", "text", "title-input", "Title");

        const descrSecton = createInput("input", "text", "descr-input", "Description");

        const dueDateSection = createInput("input", "date", "duedate-input", "Due Date");

        const prioritySection = createInput("select", null, "priority-input", "Priority");
        const priorityInput = prioritySection.querySelector("#priority-input");
        const options = createSelectOptions("", "Low", "Medium", "High");
        priorityInput.append(...options);

        const buttonsWrapper = document.createElement("div");
        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-todo-btn");
        saveBtn.textContent = "Save";
        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-btn");
        cancelBtn.textContent = "Cancel";
        buttonsWrapper.append(saveBtn, cancelBtn);

        modalContent.append(titleSection, descrSecton, dueDateSection, prioritySection, buttonsWrapper);

        modal.appendChild(modalContent);
        container.appendChild(modal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                hide();
            }
        })

        return modal;
    }

    function createInput(inputTag, inputType, inputId, labelText) {
        const container = document.createElement("div");

        const label = document.createElement("label");
        label.htmlFor = inputId;
        label.textContent = labelText;

        const input = document.createElement(inputTag);
        input.id = inputId;
        if (inputTag !== "select")
            input.type = inputType;

        container.append(label, input);

        return container;
    }

    function createSelectOptions(...optionValues) {
        const options = optionValues.map((optionValue) => {
            const option = document.createElement("option");
            option.value = optionValue;

            option.textContent = optionValue === "" ? "--" : optionValue;

            return option;
        })

        return options;
    }

    function show() {
        const modal = document.querySelector(".newtodo-modal");
        modal.classList.remove("hidden");
    }

    function hide() {
        const modal = document.querySelector(".newtodo-modal");
        modal.classList.add("hidden");
    }

    function getInputValues() {
        const modal = document.querySelector(".newtodo-modal");

        const titleInput = modal.querySelector("#title-input");
        const descrInput = modal.querySelector("#descr-input");
        const dueDateInput = modal.querySelector("#duedate-input");
        const priorityInput = modal.querySelector("#priority-input");

        return {
            title: titleInput.value,
            description: descrInput.value,
            dueDate: dueDateInput.value,
            priority: priorityInput.value
        }
    }

    function setInputValues(todoObj) {
        const modal = document.querySelector(".newtodo-modal");

        modal.querySelector("#title-input").value = todoObj.title;
        modal.querySelector("#descr-input").value = todoObj.description;
        modal.querySelector("#duedate-input").value = todoObj.dueDate;
        modal.querySelector("#priority-input").value = todoObj.priority;
    }

    function resetInputs() {
        const modal = document.querySelector(".newtodo-modal");

        const inputs = modal.querySelectorAll('[id$="-input"]');
        inputs.forEach((input) => input.value = "");
    }


    return { create, show, hide, getInputValues, setInputValues, resetInputs };
})();

export { modalController };