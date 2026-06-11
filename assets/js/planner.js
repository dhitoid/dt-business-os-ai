/*
========================================
DT BUSINESS OS AI
PLANNER MODULE V1
========================================
*/

const Planner = (() => {

/*
========================================
LOAD TASKS
========================================
*/

async function loadTasks() {

const container =
document.getElementById(
"taskList"
);

if (!container) return;

let tasks =
await Storage.getTasks();

tasks.sort((a,b)=>{

return new Date(
a.dueDate || 0
) -
new Date(
b.dueDate || 0
);

});

renderTasks(tasks);

}

/*
========================================
OVERDUE
========================================
*/

function isOverdue(task){

if(
task.completed
) return false;

if(
!task.dueDate
) return false;

const today =
new Date()
.toISOString()
.split("T")[0];

return task.dueDate < today;

}

/*
========================================
PRIORITY COLOR
========================================
*/

function getPriority(priority){

switch(priority){

case "Urgent":
return "🔴";

case "High":
return "🟠";

case "Medium":
return "🟡";

default:
return "🟢";

}

}

/*
========================================
RENDER
========================================
*/

function renderTasks(tasks){

const container =
document.getElementById(
"taskList"
);

if(!container)
return;

if(!tasks.length){

container.innerHTML =

`
<div class="list-card">

<h3>
Belum ada task
</h3>

<p>
Tambahkan task baru
untuk memulai planner.
</p>

</div>
`;

return;

}

container.innerHTML =

tasks.map(task=>{

const overdue =
isOverdue(task);

return `

<div class="list-card">

<div
style="
display:flex;
justify-content:space-between;
align-items:center;
gap:10px;
">

<div>

<h3>

${task.completed ? "✅" : ""}

${task.title}

</h3>

<p>

${getPriority(
task.priority
)}

${task.priority || "Low"}

</p>

<p>

📅
${task.dueDate || "-"}

</p>

${
overdue
?

`<p style="color:red">
⚠️ Terlambat
</p>`

:

""
}

</div>

<input
type="checkbox"
${task.completed?"checked":""}
onclick="
Planner.toggleTask(
'${task.id}'
)
">

</div>

<div
style="
display:flex;
gap:8px;
margin-top:10px;
flex-wrap:wrap;
">

<button
onclick="
Planner.editTask(
'${task.id}'
)
">

Edit

</button>

<button
onclick="
Planner.deleteTask(
'${task.id}'
)
">

Hapus

</button>

</div>

</div>

`;

}).join("");

}

/*
========================================
ADD TASK
========================================
*/

function openAddTask(){

const html =

`

<form id="taskForm">

<input
type="text"
id="taskTitle"
placeholder="Nama Task"
required>

<input
type="date"
id="taskDate">

<select
id="taskPriority">

<option>
Low
</option>

<option>
Medium
</option>

<option>
High
</option>

<option>
Urgent
</option>

</select>

<button
type="submit">

Simpan Task

</button>

</form>

`;

App.openModal(
"Tambah Task",
html
);

setTimeout(()=>{

document
.getElementById(
"taskForm"
)
.addEventListener(
"submit",
saveTask
);

},100);

}

/*
========================================
SAVE
========================================
*/

async function saveTask(e){

e.preventDefault();

const task = {

id:
crypto.randomUUID(),

title:
document.getElementById(
"taskTitle"
).value,

dueDate:
document.getElementById(
"taskDate"
).value,

priority:
document.getElementById(
"taskPriority"
).value,

completed:false,

createdAt:
new Date()
.toISOString()

};

const validation =
Validator.validateTask(
task
);

if(
!validation.valid
){

App.showToast(
validation.message
);

return;
}

await Storage.saveTask(
task
);

App.closeModal();

App.showToast(
"Task berhasil dibuat"
);

loadTasks();

App.updateStats();

}

/*
========================================
EDIT
========================================
*/

async function editTask(id){

const task =
await Storage.get(
"tasks",
id
);

if(!task)
return;

const html =

`

<form id="editTaskForm">

<input
type="text"
id="editTaskTitle"
value="${task.title}"
required>

<input
type="date"
id="editTaskDate"
value="${task.dueDate||""}">

<select
id="editTaskPriority">

<option
${task.priority==="Low"?"selected":""}>
Low
</option>

<option
${task.priority==="Medium"?"selected":""}>
Medium
</option>

<option
${task.priority==="High"?"selected":""}>
High
</option>

<option
${task.priority==="Urgent"?"selected":""}>
Urgent
</option>

</select>

<button
type="submit">

Update Task

</button>

</form>

`;

App.openModal(
"Edit Task",
html
);

setTimeout(()=>{

document
.getElementById(
"editTaskForm"
)
.addEventListener(
"submit",

async(e)=>{

e.preventDefault();

task.title =
document.getElementById(
"editTaskTitle"
).value;

task.dueDate =
document.getElementById(
"editTaskDate"
).value;

task.priority =
document.getElementById(
"editTaskPriority"
).value;

const validation =
Validator.validateTask(
task
);

if(
!validation.valid
){

App.showToast(
validation.message
);

return;
}

await Storage.saveTask(
task
);

App.closeModal();

App.showToast(
"Task diperbarui"
);

loadTasks();

App.updateStats();

}

);

},100);

}

/*
========================================
DELETE
========================================
*/

async function deleteTask(id){

if(
!confirm(
"Hapus task ini?"
)
) return;

await Storage.remove(
"tasks",
id
);

App.showToast(
"Task dihapus"
);

loadTasks();

App.updateStats();

}

/*
========================================
TOGGLE
========================================
*/

async function toggleTask(id){

const task =
await Storage.get(
"tasks",
id
);

if(!task)
return;

task.completed =
!task.completed;

const validation =
Validator.validateTask(
task
);

if(
!validation.valid
){

App.showToast(
validation.message
);

return;
}

await Storage.saveTask(
task
);

loadTasks();

}

/*
========================================
INIT
========================================
*/

async function init(){

await loadTasks();

document
.getElementById(
"newTask"
)
?.addEventListener(
"click",
openAddTask
);

document
.getElementById(
"addTaskBtn"
)
?.addEventListener(
"click",
openAddTask
);

}

/*
========================================
PUBLIC
========================================
*/

return {

init,

loadTasks,

openAddTask,

editTask,

deleteTask,

toggleTask

};

})();

/*
========================================
AUTO START
========================================
*/

document.addEventListener(
"DOMContentLoaded",
()=>{

setTimeout(()=>{

Planner.init();

},600);

}
);
