let tasks = [];

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

    for (const task of tasks) {
        const elItem = renderTaskItem(task);
        root.appendChild(elItem);
    }
}

function renderTaskItem(task) {
    const el = document.createElement("div");
    el.classList.add('item');
    el.classList.add(`task-${task.id}`);
    el.setAttribute('data-id', `${task.id}`);

    const elTaskName = document.createElement("span");
    elTaskName.classList.add('name');
    elTaskName.textContent = task.name;

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
    el.appendChild(elTaskName);
    el.appendChild(elTaskActions);

    return el;
}

function checkToRenderNoTaskYet() {
    const el = document.getElementsByClassName('no-tasks')[0];
    if (!tasks.length) {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }

}

function getListTasks() {
    tasks = [
        { id: 1, name: 'Build a Task app in 2021', done: false },
        { id: 2, name: 'Subscribe to Tyler Potts', done: false },
        { id: 3, name: 'Like the video!', done: true },
        { id: 4, name: 'Watch anime!', done: false },
        { id: 5, name: 'Learning English', done: true },
    ];

    renderTasks();
}

function addTask() {
    const elInput = document.getElementsById('input-task')[0];
    const input = elInput.value.trim();

    if (!input) {
        return;
    } 

    const newTask = {
        id: (new Date()).getTime(),
        name: input,
        done: false,
    };
    tasks.push(newTask);

    elInput.value = ""

    // update DOM
    const root = document.getElementById('data-tasks');
    const newElItem = renderTaskItem(newTask)
    root.insertBefore(newElItem, root.firstChild);

    checkToRenderNoTaskYet();
}

function showEditTaskForm(id) {
    const elTaskName = document.querySelector(`.task-${id} span.name`);
    elTaskName.style.display = 'none';

    const elInput = document.querySelector(`.task-${id} .input-edit`);
    elInput.style.display = 'block';
    elInput.focus();

    const elBtnEdit = document.querySelector(`.task-${id} .btn-edit`);
    elBtnEdit.textContent = 'Save';
    elBtnEdit.onclick = () => editTask(id);
}

function editTask(id) {
    const task = tasks.find(tsk => tsk.id === id);
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
    elTaskName.style.display = 'block';

    const elBtnEdit = document.querySelector(`.task-${id} .btn-edit`);
    elBtnEdit.textContent = 'Edit';
    elBtnEdit.onclick = () => showEditTaskForm(id);

    // persistent
    task.name = input;
    console.log(task);
}

function deleteTask(id) {
    const taskIndex = tasks.findIndex(tsk => tsk.id === id);
    console.log(id, taskIndex);
    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);

    // update DOM
    const root = document.getElementById('data-tasks');
    const el = document.getElementsByClassName(`task-${id}`)[0];
    root.removeChild(el);

    checkToRenderNoTaskYet();
}