// function getTasksFromStorage(callback) {
//   chrome.storage.sync.get('tasks', function (data) {
//     const tasks = data.tasks || [];
//     callback(tasks);
//   });
// }

// function saveTasksToStorage(tasks, callback) {
//   chrome.storage.sync.set({ 'tasks': tasks }, callback);
// }

function getTasksFromStorage(callback) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  callback(tasks);
}

function saveTasksToStorage(tasks, callback) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  callback();
}


function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach(function (task, index) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    const taskText = document.createElement('span');
    taskText.innerText = task;
    taskContent.appendChild(taskText);
    taskItem.appendChild(taskContent);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'actions-container';

    const editButton = createButton('<i class="fas fa-pencil-alt"></i>', function () {
      editTask(index);
    });
    actionsContainer.appendChild(editButton);

    const deleteButton = createButton('<i class="fas fa-trash-alt"></i>', function () {
      deleteTask(index);
    });
    actionsContainer.appendChild(deleteButton);

    taskItem.appendChild(actionsContainer);

    taskContent.addEventListener('click', function () {
      alert(task); 
    });

    taskList.appendChild(taskItem);
  });
}

function createButton(html, onClick) {
  const button = document.createElement('button');
  button.innerHTML = html;
  button.addEventListener('click', onClick);
  return button;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const taskInput = document.getElementById('task-input');
  const task = taskInput.value.trim();

  if (task !== '') {
    getTasksFromStorage(function (tasks) {
      tasks.push(task);
      saveTasksToStorage(tasks, function () {
        renderTasks(tasks);
      });
    });

    taskInput.value = '';
  }
}

document.getElementById('task-form').addEventListener('submit', handleFormSubmission);

document.addEventListener('DOMContentLoaded', function () {
  getTasksFromStorage(function (tasks) {
    renderTasks(tasks);
  });
});

function editTask(index) {
  getTasksFromStorage(function (tasks) {
    const updatedTask = prompt('Edit Task', tasks[index]);

    if (updatedTask !== null) {
      tasks[index] = updatedTask.trim();
      saveTasksToStorage(tasks, function () {
        renderTasks(tasks);
      });
    }
  });
}

function deleteTask(index) {
  getTasksFromStorage(function (tasks) {
    tasks.splice(index, 1);
    saveTasksToStorage(tasks, function () {
      renderTasks(tasks);
    });
  });
}
