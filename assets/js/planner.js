/*
========================================
DT BUSINESS OS AI
PLANNER MODULE V1
========================================
*/

const Planner = (() => {

/*
========================================
SMART POMODORO ENGINE
V1.1.5
========================================
*/

let pomodoroTimer = null;

let pomodoroMode = "work";

let remainingTime = 1500;

let completedPomodoroToday =

parseInt(

localStorage.getItem(
"pomodoroToday"
)

|| 0

);

/*
========================================
TIME FORMAT
========================================
*/

function formatTime(
seconds
){

const minutes =
Math.floor(
seconds / 60
);

const secs =
seconds % 60;

return `${minutes}:${String(
secs
).padStart(
2,
"0"
)}`;

}

/*
========================================
UPDATE UI
========================================
*/

function updatePomodoroUI(){

const timer =
document.getElementById(
"pomodoroTime"
);

if(timer){

timer.textContent =
formatTime(
remainingTime
);

}

const mode =
document.getElementById(
"pomodoroMode"
);

if(mode){

mode.textContent =

pomodoroMode === "work"

?

"🍅 Fokus"

:

"☕ Istirahat";

}

}

/*
========================================
PLAY ALARM
========================================
*/

function playAlarm(){

try{

const audio =
new Audio(
"assets/alarm.mp3"
);

audio.play();

}catch(err){

console.log(err);

}

}

/*
========================================
VIBRATION
========================================
*/

function vibrateAlarm(){

if(
navigator.vibrate
){

navigator.vibrate(

[
300,
200,
300,
200,
300
]

);

}

}

/*
========================================
PWA NOTIFICATION
========================================
*/

async function sendNotification(

title,
body

){

try{

if(

Notification.permission

===

"granted"

){

new Notification(

title,

{
body,
icon:"icon-192.png"
}

);

}

}catch(err){

console.log(err);

}

}

/*
========================================
REQUEST NOTIFICATION
========================================
*/

async function requestNotification(){

try{

if(

"Notification"

in window

){

await Notification
.requestPermission();

}

}catch(err){

console.log(err);

}

}

/*
========================================
START POMODORO
========================================
*/

function startPomodoro(){

clearInterval(
pomodoroTimer
);

pomodoroTimer =

setInterval(()=>{

remainingTime--;

updatePomodoroUI();

if(
remainingTime <= 0
){

finishPomodoro();

}

},1000);

App.toast(

"Pomodoro dimulai",

"success"

);

}

/*
========================================
PAUSE POMODORO
========================================
*/

function pausePomodoro(){

clearInterval(
pomodoroTimer
);

App.toast(

"Pomodoro dijeda",

"info"

);

}

/*
========================================
RESET POMODORO
========================================
*/

function resetPomodoro(){

clearInterval(
pomodoroTimer
);

pomodoroMode =
"work";

remainingTime =
1500;

updatePomodoroUI();

}

/*
========================================
FINISH POMODORO
========================================
*/

function finishPomodoro(){

clearInterval(
pomodoroTimer
);

playAlarm();

vibrateAlarm();

if(
pomodoroMode === "work"
){

completedPomodoroToday++;

localStorage.setItem(

"pomodoroToday",

completedPomodoroToday

);

sendNotification(

"Pomodoro Selesai",

"Saatnya istirahat 5 menit"

);

App.toast(

"Fokus selesai ☕",

"success"

);

pomodoroMode =
"break";

remainingTime =
300;

}else{

sendNotification(

"Istirahat Selesai",

"Mulai fokus kembali"

);

App.toast(

"Istirahat selesai 🍅",

"success"

);

pomodoroMode =
"work";

remainingTime =
1500;

}

updatePomodoroUI();

startPomodoro();

}

/*
========================================
FOCUS SESSION
========================================
*/

async function addFocusSession(
id
){

const task =
await Storage.get(
"tasks",
id
);

if(!task)
return;

task.focusSessions =

(
task.focusSessions
|| 0
)

+ 1;

await Storage.saveTask(
task
);

await Storage.logActivity(

"focus",

"planner",

`Focus Session ${task.title}`

);

App.toast(

"Focus dicatat",

"success"

);

loadTasks();

}

/*
========================================
PRODUCTIVITY SCORE
========================================
*/

async function getProductivityScore(){

const tasks =
await Storage.getTasks();

if(
tasks.length === 0
)
return 0;

const completed =

tasks.filter(
task=>

task.completed

).length;

return Math.round(

(
completed

/

tasks.length

)

*100

);

}

/*
========================================
TASK ANALYTICS
========================================
*/

async function getTaskAnalytics(){

const tasks =
await Storage.getTasks();

return {

total:
tasks.length,

completed:

tasks.filter(
t=>t.completed
).length,

overdue:

tasks.filter(
t=>
isOverdue(t)
).length,

highPriority:

tasks.filter(
t=>

t.priority ===
"High"

||

t.priority ===
"Urgent"

).length,

focusSessions:

tasks.reduce(

(sum,item)=>

sum +

(
item.focusSessions
|| 0
),

0

)

};

});

/*
========================================
REPEAT TASK ENGINE
========================================
*/

function getNextRepeatDate(
date,
repeat
){

if(
!date
||
repeat === "none"
)
return "";

const next =
new Date(date);

switch(
repeat
){

case "daily":

next.setDate(
next.getDate() + 1
);

break;

case "weekly":

next.setDate(
next.getDate() + 7
);

break;

case "monthly":

next.setMonth(
next.getMonth() + 1
);

break;

}

return next
.toISOString()
.split("T")[0];

}

/*
========================================
OVERDUE
========================================
*/

function isOverdue(
task
){

if(
task.completed
)
return false;

if(
!task.dueDate
)
return false;

const today =
new Date()
.toISOString()
.split("T")[0];

return (
task.dueDate < today
);

}

/*
========================================
PRIORITY ICON
========================================
*/

function getPriorityIcon(
priority
){

switch(
priority
){

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
TASK SUMMARY
========================================
*/

function renderTaskSummary(
tasks
){

const el =
document.getElementById(
"taskSummary"
);

if(!el)
return;

const total =
tasks.length;

const completed =

tasks.filter(
t=>t.completed
).length;

const overdue =

tasks.filter(
t=>
isOverdue(t)
).length;

const focus =

tasks.reduce(

(sum,item)=>

sum +

(
item.focusSessions
|| 0
),

0

);

el.innerHTML =

`

<div
class="summary-grid">

<div
class="summary-card">

📋 ${total}

</div>

<div
class="summary-card">

✅ ${completed}

</div>

<div
class="summary-card">

🚨 ${overdue}

</div>

<div
class="summary-card">

🍅 ${focus}

</div>

</div>

`;

}

/*
========================================
SMART SORT
========================================
*/

function sortTasks(
tasks
){

return tasks.sort(
(a,b)=>{

if(
a.completed
!==

b.completed
){

return a.completed
? 1
: -1;

}

const priorityRank = {

Urgent:4,
High:3,
Medium:2,
Low:1

};

const p1 =

priorityRank[
a.priority
]

|| 0;

const p2 =

priorityRank[
b.priority
]

|| 0;

if(
p1 !== p2
){

return p2 - p1;

}

return new Date(
a.dueDate || 0
)

-

new Date(
b.dueDate || 0
);

}
);

}

/*
========================================
POMODORO WIDGET
========================================
*/

function renderPomodoroWidget(){

const target =
document.getElementById(
"pomodoroWidget"
);

if(!target)
return;

target.innerHTML =

`

<div
class="pomodoro-card">

<h3>

🍅 Smart Pomodoro

</h3>

<p
id="pomodoroMode">

🍅 Fokus

</p>

<h1
id="pomodoroTime">

25:00

</h1>

<div
style="
display:flex;
gap:10px;
flex-wrap:wrap;
">

<button
onclick="
Planner.startPomodoro()
">

Start

</button>

<button
onclick="
Planner.pausePomodoro()
">

Pause

</button>

<button
onclick="
Planner.resetPomodoro()
">

Reset

</button>

</div>

<div
style="
margin-top:10px;
">

<p>

🏆 Hari Ini:

<span
id="pomodoroToday">

${completedPomodoroToday}

</span>

Sesi

</p>

</div>

</div>

`;

updatePomodoroUI();

}

/*
========================================
UPDATE POMODORO STATS
========================================
*/

function updatePomodoroStats(){

const el =
document.getElementById(
"pomodoroToday"
);

if(el){

el.textContent =

completedPomodoroToday;

}

}

/*
========================================
FOCUS GOAL
========================================
*/

function getDailyFocusGoal(){

return parseInt(

localStorage.getItem(
"dailyFocusGoal"
)

|| 8

);

}

function setDailyFocusGoal(
value
){

localStorage.setItem(

"dailyFocusGoal",

value

);

}

/*
========================================
FOCUS PROGRESS
========================================
*/

function getFocusProgress(){

const goal =
getDailyFocusGoal();

if(goal === 0)
return 0;

return Math.round(

(
completedPomodoroToday

/

goal

)

*100

);

}

/*
========================================
FOCUS KPI
========================================
*/

function renderFocusKPI(){

const el =
document.getElementById(
"focusKPI"
);

if(!el)
return;

const goal =
getDailyFocusGoal();

const progress =
getFocusProgress();

el.innerHTML =

`

<div
class="list-card">

<h3>

🎯 Focus Goal

</h3>

<p>

${completedPomodoroToday}

/

${goal}

Sesi

</p>

<p>

${progress}%

</p>

</div>

`;

}

/*
========================================
UPCOMING TASKS
========================================
*/

function getUpcomingTasks(
tasks
){

const today =
new Date();

return tasks.filter(
task=>{

if(
!task.dueDate
)
return false;

if(
task.completed
)
return false;

const due =
new Date(
task.dueDate
);

const diff =

Math.ceil(

(
due - today
)

/

86400000

);

return diff <= 3;

});
}

/*
========================================
OVERDUE COUNTER
========================================
*/

function getOverdueCount(
tasks
){

return tasks.filter(
task=>
isOverdue(task)
).length;

}

/*
========================================
LOAD TASKS PRO
========================================
*/

async function loadTasks(){

const container =
document.getElementById(
"taskList"
);

if(!container)
return;

let tasks =
await Storage.getTasks();

tasks =
sortTasks(
tasks
);

renderTaskSummary(
tasks
);

renderFocusKPI();

updatePomodoroStats();

renderPomodoroWidget();

renderTasks(
tasks
);

}

/*
========================================
RENDER TASKS PRO
========================================
*/

function renderTasks(
tasks
){

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
Tambahkan task pertama
untuk memulai planner.
</p>

</div>
`;

return;

}

container.innerHTML =

tasks.map(task=>{

const overdue =
isOverdue(
task
);

return `

<div class="list-card">

<h3>

${task.completed ? "✅" : ""}

${task.title}

</h3>

<p>

${getPriorityIcon(
task.priority
)}

${task.priority}

</p>

${
task.description

?

`

<p>

📝

${task.description}

</p>

`

:

""

}

<p>

📅

${task.dueDate || "-"}

</p>

<p>

🍅 Focus:

${task.focusSessions || 0}

</p>

${
overdue

?

`

<p
style="
color:red;
font-weight:bold;
">

🚨 OVERDUE

</p>

`

:

""

}

<div
style="
display:flex;
gap:8px;
flex-wrap:wrap;
margin-top:10px;
">

<button
onclick="
Planner.addFocusSession(
'${task.id}'
)
">

Focus

</button>

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

<label>

<input
type="checkbox"

${task.completed
?
"checked"
:
""
}

onclick="
Planner.toggleTask(
'${task.id}'
)
">

Selesai

</label>

</div>

</div>

`;

}).join("");

}

/*
========================================
ADD TASK PRO
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

<textarea
id="taskDescription"
placeholder="Deskripsi">
</textarea>

<input
type="date"
id="taskDate">

<select
id="taskPriority">

<option>
Low
</option>

<option selected>
Medium
</option>

<option>
High
</option>

<option>
Urgent
</option>

</select>

<select
id="taskRepeat">

<option value="none">
Tidak Berulang
</option>

<option value="daily">
Harian
</option>

<option value="weekly">
Mingguan
</option>

<option value="monthly">
Bulanan
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
SAVE TASK PRO
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

description:
document.getElementById(
"taskDescription"
).value,

dueDate:
document.getElementById(
"taskDate"
).value,

priority:
document.getElementById(
"taskPriority"
).value,

repeat:
document.getElementById(
"taskRepeat"
).value,

focusSessions:0,

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

App.toast(
validation.message,
"error"
);

return;

}

await Storage.saveTask(
task
);

App.closeModal();

App.toast(
"Task berhasil dibuat",
"success"
);

loadTasks();

App.updateStats();

}

/*
========================================
EDIT TASK PRO
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

<textarea
id="editTaskDescription">

${task.description || ""}

</textarea>

<input
type="date"
id="editTaskDate"
value="${task.dueDate || ""}">

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

<select
id="editTaskRepeat">

<option
value="none"
${task.repeat==="none"?"selected":""}>
Tidak Berulang
</option>

<option
value="daily"
${task.repeat==="daily"?"selected":""}>
Harian
</option>

<option
value="weekly"
${task.repeat==="weekly"?"selected":""}>
Mingguan
</option>

<option
value="monthly"
${task.repeat==="monthly"?"selected":""}>
Bulanan
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

task.description =
document.getElementById(
"editTaskDescription"
).value;

task.dueDate =
document.getElementById(
"editTaskDate"
).value;

task.priority =
document.getElementById(
"editTaskPriority"
).value;

task.repeat =
document.getElementById(
"editTaskRepeat"
).value;

await Storage.saveTask(
task
);

App.closeModal();

App.toast(
"Task diperbarui",
"success"
);

loadTasks();

App.updateStats();

}

);

},100);

}

/*
========================================
DELETE TASK PRO
========================================
*/

async function deleteTask(id){

const ok =
await App.confirm({

title:
"Hapus Task",

message:
"Task akan dihapus permanen"

});

if(!ok)
return;

await Storage.remove(
"tasks",
id
);

App.toast(
"Task dihapus",
"warning"
);

loadTasks();

App.updateStats();

}

/*
========================================
TOGGLE TASK
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

await Storage.saveTask(
task
);

if(
task.completed
&&
task.repeat
&&
task.repeat !== "none"
){

const nextTask = {

...task,

id:
crypto.randomUUID(),

completed:false,

dueDate:
getNextRepeatDate(
task.dueDate,
task.repeat
),

createdAt:
new Date()
.toISOString()

};

await Storage.saveTask(
nextTask
);

}

loadTasks();

App.updateStats();

}

/*
========================================
INIT
========================================
*/

async function init(){

await requestNotification();

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

return {

init,

loadTasks,

openAddTask,

saveTask,

editTask,

deleteTask,

toggleTask,

addFocusSession,

startPomodoro,

pausePomodoro,

resetPomodoro,

getProductivityScore,

getTaskAnalytics

};
