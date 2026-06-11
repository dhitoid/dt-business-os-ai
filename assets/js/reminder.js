/*
========================================
DT BUSINESS OS AI
REMINDER MODULE V1
========================================
*/

const Reminder = (() => {

let reminderInterval = null;

/*
========================================
LOAD REMINDERS
========================================
*/

async function loadReminders(){

const container =
document.getElementById(
"reminderList"
);

if(!container) return;

let reminders =
await Storage.getReminders();

reminders.sort((a,b)=>
new Date(a.date || 0)
-
new Date(b.date || 0)
);

renderReminders(reminders);

}

/*
========================================
RENDER
========================================
*/

function renderReminders(reminders){

const container =
document.getElementById(
"reminderList"
);

if(!container) return;

if(!reminders.length){

container.innerHTML = `
<div class="list-card">
<h3>Belum ada reminder</h3>
<p>Tambahkan reminder pertama Anda.</p>
</div>
`;

return;
}

container.innerHTML = reminders.map(item=>{

const overdue =
isOverdue(item);

return `

<div class="list-card">

<h3>
⏰ ${item.title}
</h3>

<p>
📌 ${item.type}
</p>

<p>
📅 ${item.date}
</p>

<p>
🕒 ${item.time}
</p>

${
overdue
?
'<p style="color:red">⚠️ Terlambat</p>'
:
''
}

<div
style="
display:flex;
gap:8px;
margin-top:10px;
flex-wrap:wrap;
">

<button
onclick="
Reminder.editReminder(
'${item.id}'
)
">

Edit

</button>

<button
onclick="
Reminder.deleteReminder(
'${item.id}'
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
OVERDUE
========================================
*/

function isOverdue(item){

if(!item.date)
return false;

const now =
new Date();

const target =
new Date(
`${item.date}T${item.time || "00:00"}`
);

return target < now;

}

/*
========================================
ADD
========================================
*/

function openAddReminder(){

const html =

`
<form id="reminderForm">

<input
type="text"
id="reminderTitle"
placeholder="Judul Reminder"
required>

<select
id="reminderType">

<option>
Follow Up
</option>

<option>
Meeting
</option>

<option>
Tagihan
</option>

<option>
Task
</option>

</select>

<input
type="date"
id="reminderDate"
required>

<input
type="time"
id="reminderTime"
required>

<button
type="submit">

Simpan Reminder

</button>

</form>
`;

App.openModal(
"Tambah Reminder",
html
);

setTimeout(()=>{

document
.getElementById(
"reminderForm"
)
.addEventListener(
"submit",
saveReminder
);

},100);

}

/*
========================================
SAVE
========================================
*/

async function saveReminder(e){

e.preventDefault();

const item = {

id:
crypto.randomUUID(),

title:
document.getElementById(
"reminderTitle"
).value,

type:
document.getElementById(
"reminderType"
).value,

date:
document.getElementById(
"reminderDate"
).value,

time:
document.getElementById(
"reminderTime"
).value,

notified:false,

createdAt:
new Date()
.toISOString()

};

await Storage.saveReminder(
item
);

App.closeModal();

App.showToast(
"Reminder berhasil dibuat"
);

loadReminders();

}

/*
========================================
EDIT
========================================
*/

async function editReminder(id){

const item =
await Storage.get(
"reminders",
id
);

if(!item) return;

const html =

`
<form id="editReminderForm">

<input
type="text"
id="editTitle"
value="${item.title}"
required>

<select
id="editType">

<option
${item.type==="Follow Up"?"selected":""}>
Follow Up
</option>

<option
${item.type==="Meeting"?"selected":""}>
Meeting
</option>

<option
${item.type==="Tagihan"?"selected":""}>
Tagihan
</option>

<option
${item.type==="Task"?"selected":""}>
Task
</option>

</select>

<input
type="date"
id="editDate"
value="${item.date}">

<input
type="time"
id="editTime"
value="${item.time}">

<button
type="submit">

Update Reminder

</button>

</form>
`;

App.openModal(
"Edit Reminder",
html
);

setTimeout(()=>{

document
.getElementById(
"editReminderForm"
)
.addEventListener(
"submit",

async(e)=>{

e.preventDefault();

item.title =
document.getElementById(
"editTitle"
).value;

item.type =
document.getElementById(
"editType"
).value;

item.date =
document.getElementById(
"editDate"
).value;

item.time =
document.getElementById(
"editTime"
).value;

item.notified = false;

await Storage.saveReminder(
item
);

App.closeModal();

App.showToast(
"Reminder diperbarui"
);

loadReminders();

}

);

},100);

}

/*
========================================
DELETE
========================================
*/

async function deleteReminder(id){

if(
!confirm(
"Hapus reminder ini?"
)
) return;

await Storage.remove(
"reminders",
id
);

App.showToast(
"Reminder dihapus"
);

loadReminders();

}

/*
========================================
NOTIFICATION
========================================
*/

async function sendNotification(item){

if(
Notification.permission
!== "granted"
){

return;
}

new Notification(

item.title,

{
body:
`${item.type} - Saatnya melakukan aktivitas ini`,
icon:
"icons/icon-192.png",
badge:
"icons/icon-192.png"
}

);

}

/*
========================================
CHECK REMINDERS
========================================
*/

async function checkReminders(){

const reminders =
await Storage.getReminders();

const now =
new Date();

for(
const item
of reminders
){

if(item.notified)
continue;

const target =
new Date(
`${item.date}T${item.time}`
);

if(
target <= now
){

await sendNotification(
item
);

item.notified = true;

await Storage.saveReminder(
item
);

}

}

}

/*
========================================
BACKGROUND CHECK
========================================
*/

function startChecker(){

if(reminderInterval){

clearInterval(
reminderInterval
);

}

reminderInterval =
setInterval(

checkReminders,

60000

);

}

/*
========================================
INIT
========================================
*/

async function init(){

await loadReminders();

startChecker();

document
.getElementById(
"newReminder"
)
?.addEventListener(
"click",
openAddReminder
);

document
.getElementById(
"addReminderBtn"
)
?.addEventListener(
"click",
openAddReminder
);

}

/*
========================================
PUBLIC
========================================
*/

return {

init,

loadReminders,

openAddReminder,

editReminder,

deleteReminder,

checkReminders

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

Reminder.init();

},800);

}
);
