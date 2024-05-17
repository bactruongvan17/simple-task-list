class Task {
    constructor(id, name, done) {
        this.id = id;
        this.name = name;
        this.done = done;
    }
}

class TaskStorage {
    static tasks = []

    static getLists() {
        const data = localStorage.getItem('tasks');
        if (data) {
            this.tasks = JSON.parse(data);
        }

        return this.tasks;
    }

    static getById(id) {
        return this.tasks.find(t => t.id === id);
    }

    static save(task) {
        this.tasks.push(task);
        console.log(this.tasks);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    static update(task) {
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex === -1) {
            return;
        }

        this.tasks[taskIndex] = task;
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    static delete(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            return;
        }
        
        this.tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

getListTasks();

const elBtnAdd = document.getElementById('btn-add');
elBtnAdd.addEventListener('click', addTask);
const elForm = document.getElementById('form-add-task');
elForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

function renderTasks() {
    checkToRenderNoTaskYet();

    const root = document.getElementById('data-tasks');
    root.innerHTML = ""

    const sortedTasks = [...TaskStorage.tasks].sort((a, b) => b.id - a.id);

    for (const task of sortedTasks) {
        const elItem = renderTaskItem(task);
        root.appendChild(elItem);
    }
}

function renderTaskItem(task) {
    const el = document.createElement("div");
    el.classList.add('item');
    el.classList.add(`task-${task.id}`);
    if (task.done) {
        el.classList.add('done');
    }
    el.setAttribute('data-id', `${task.id}`);

    const elGroupNameCheckbox = document.createElement("div");
    elGroupNameCheckbox.classList.add("group-name");
    elGroupNameCheckbox.onclick = () => toggleDoneTask(task.id);

    const elCheckbox = document.createElement("input");
    elCheckbox.setAttribute('type', 'checkbox');
    elCheckbox.setAttribute('value', task.id);
    if (task.done) {
        elCheckbox.setAttribute('checked', 'checked');
    }

    const elTaskName = document.createElement("span");
    elTaskName.classList.add('name');
    elTaskName.textContent = task.name;

    elGroupNameCheckbox.appendChild(elCheckbox);
    elGroupNameCheckbox.appendChild(elTaskName);

    const elInput = document.createElement('input');
    elInput.setAttribute('type', 'text');
    elInput.classList.add('input-edit');
    elInput.style.display = 'none';
    elInput.value = task.name;

    const elTaskActions = document.createElement("div");
    elTaskActions.classList.add("action");

    const elBtnEdit = document.createElement("span");
    elBtnEdit.classList.add("btn-edit");
    elBtnEdit.textContent = "Edit";
    elBtnEdit.onclick = () => showEditTaskForm(task.id);

    const elBtnDel = document.createElement("span");
    elBtnDel.classList.add("btn-del");
    elBtnDel.textContent = "Delete";
    elBtnDel.onclick = () => deleteTask(task.id);

    elTaskActions.appendChild(elBtnEdit);
    elTaskActions.appendChild(elBtnDel);

    el.appendChild(elInput);
    el.appendChild(elGroupNameCheckbox);
    el.appendChild(elTaskActions);

    return el;
}

function checkToRenderNoTaskYet() {
    const el = document.getElementsByClassName('no-tasks')[0];
    if (!TaskStorage.tasks.length) {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }

}

function getListTasks() {
    TaskStorage.getLists();
    renderTasks();
}

function addTask() {
    const elInput = document.getElementById('input-task');
    const input = elInput.value.trim();

    if (!input) {
        return;
    } 

    const newTask = new Task(
        (new Date).getTime(),
        input,
        false,
    );
    TaskStorage.save(newTask);

    elInput.value = ""

    // update DOM
    const root = document.getElementById('data-tasks');
    const newElItem = renderTaskItem(newTask)
    root.insertBefore(newElItem, root.firstChild);

    checkToRenderNoTaskYet();
}

function showEditTaskForm(id) {
    const elTaskName = document.querySelector(`.task-${id} .group-name`);
    elTaskName.style.display = 'none';

    const elInput = document.querySelector(`.task-${id} .input-edit`);
    elInput.style.display = 'block';
    elInput.focus();

    const elBtnEdit = document.querySelector(`.task-${id} .btn-edit`);
    elBtnEdit.textContent = 'Save';
    elBtnEdit.onclick = () => editTask(id);
}

function editTask(id) {
    const task = TaskStorage.tasks.find(tsk => tsk.id === id);
    if (!task) {
        return;
    }

    // Update DOM
    const elInput = document.querySelector(`.task-${id} .input-edit`);
    const input = elInput.value.trim();
    if (!input) {
        return;
    }
    elInput.style.display = 'none';
   
    const elTaskName = document.querySelector(`.task-${id} span.name`);
    elTaskName.textContent = input;

    document.querySelector(`.task-${id} .group-name`).style.display = 'block';

    const elBtnEdit = document.querySelector(`.task-${id} .btn-edit`);
    elBtnEdit.textContent = 'Edit';
    elBtnEdit.onclick = () => showEditTaskForm(id);

    // persistent
    task.name = input;
    TaskStorage.update(task);
}

function deleteTask(id) {
    // persistent
    TaskStorage.delete(id);
    
    // update DOM
    const root = document.getElementById('data-tasks');
    const el = document.getElementsByClassName(`task-${id}`)[0];
    root.removeChild(el);

    checkToRenderNoTaskYet();
}

function toggleDoneTask(id) {
    const task = TaskStorage.getById(id);
    if (!task) {
        return;
    }

    task.done = !task.done;
    TaskStorage.update(task);

    // update DOM
    const el = document.getElementsByClassName(`task-${id}`)[0];
    const elInputCheckbox = document.querySelector(`.task-${id} .group-name input[type="checkbox"]`);
    if (task.done) {
        el.classList.add('done');
        elInputCheckbox.setAttribute('checked', 'checked');
    } else {
        el.classList.remove('done');
        elInputCheckbox.removeAttribute('checked');
    }
    console.log(elInputCheckbox);
} 