function createTodo(title, description, dueDate, priority) {
    return {
        id: crypto.randomUUID(),
        title,
        description,
        dueDate,
        priority
    }
}

export { createTodo }