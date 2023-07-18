const taskInput = document.getElementById("task_input");
const taskForm = document.getElementById("task_form");
const tasksContainer = document.getElementById("tasks_container");
const warning = document.getElementById("warning")

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  taskList.map((task) => {
    createTask(task);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = taskInput.value;
  
  if (inputValue === "") {
    warning.style.display = "block"
    return;
  }
  warning.style.display = "none"

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isComplete: false,
  };
  taskList.push(task);

  createTask(task);

  taskInput.value = "";
});

function createTask(task) {
  const task_element = document.createElement("div");
  task_element.setAttribute("id", task.id);
  task_element.classList.add("task");

  const taskDetailsContainer = document.createElement("div");
  taskDetailsContainer.classList.add("taskDetailsContainer");
  task_element.append(taskDetailsContainer);

  const task_checkBox = document.createElement("input");
  task_checkBox.type = "checkbox";
  task_checkBox.classList.add("checkBox");

  if (task.isComplete) {
    task_checkBox.checked = true;
  }

  task_checkBox.id = "checkBox";
  task_element.appendChild(task_checkBox);

  const task_detail = document.createElement("input");
  task_detail.type = "text";
  task_detail.classList.add("task_detail");
  if (task.isComplete) {
    task_detail.classList.add("completed");
  }
  task_detail.setAttribute("readonly", "readonly");
  task_detail.setAttribute("value", task.name);
  task_element.appendChild(task_detail);

  taskDetailsContainer.appendChild(task_checkBox);
  taskDetailsContainer.appendChild(task_detail);

  const taskControls = document.createElement("div");
  taskControls.classList.add("task_controls");
  task_element.appendChild(taskControls);
  

  const editButton = document.createElement("button");
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular");
  editIcon.classList.add("fa-pen-to-square");
  editButton.append(editIcon);

  const deleteButton = document.createElement("button");
  const delIcon = document.createElement("i");
  delIcon.classList.add("fa-solid");
  delIcon.classList.add("fa-trash");
  deleteButton.append(delIcon);

  save();

  function disableTheTask() {
    if (task.isComplete) {
      task_checkBox.checked = false;
      task_detail.classList.remove("completed");
      // task_detail.disabled = false;
      editButton.disabled = !task.isComplete;
      task.isComplete = false;
      save();
    } else {
      editButton.disabled = !task.isComplete;
      task_checkBox.checked = true;
      // task_detail.disabled = true;
      task_detail.classList.add("completed");
      task.isComplete = true;
      save();
    }
  }

  taskDetailsContainer.addEventListener("click", () => {
    disableTheTask()
  });
  

  editButton.addEventListener("click", function (e) {
    if (task.isComplete) {
      return;
    }
    
    task_detail.removeAttribute("readonly");
    task_detail.style.backgroundColor = "#2D4356";
    task_detail.focus();

    task_detail.addEventListener("change", (e) => {
      task.name = e.target.value;
    });
    task_detail.addEventListener('click',(e)=>{
      if(!task_detail.readOnly){
        e.stopPropagation()
      }
    })

    task_detail.addEventListener("blur", () => {
      task_detail.setAttribute("readonly", "readonly");
      task_detail.style.background = "none";
      save();
    });
  });

  save();

  deleteButton.addEventListener("click", (e) => {
    const taskId = deleteButton.parentElement.parentElement.id;
    taskList = taskList.filter((t) => t.id != parseInt(taskId));
    save();
    document.getElementById(taskId).remove();
  });

  taskControls.appendChild(editButton);
  taskControls.appendChild(deleteButton);
  tasksContainer.append(task_element);
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}
