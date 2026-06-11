/*
========================================
DT BUSINESS OS AI
STORAGE ENGINE V1
IndexedDB Core
========================================
*/

const Storage = (() => {

const DB_NAME = "DTBusinessOSAI";
const DB_VERSION = 2;

let db = null;

/*
========================================
INIT DATABASE
========================================
*/

function init() {

return new Promise((resolve, reject) => {

const request =
indexedDB.open(
DB_NAME,
DB_VERSION
);

request.onerror = () => {

console.error(
"Database gagal dibuka"
);

reject();

};

request.onsuccess = () => {

db = request.result;

console.log(
"Database Connected"
);

resolve();

};

request.onupgradeneeded = (e) => {

db = e.target.result;

/*
========================================
ACTIVITY LOGS
========================================
*/

if(
!db.objectStoreNames.contains(
"activity_logs"
)
){

db.createObjectStore(
"activity_logs",
{
keyPath:"id"
}
);

}

/*
========================================
NOTIFICATIONS
========================================
*/

if(
!db.objectStoreNames.contains(
"notifications"
)
){

db.createObjectStore(
"notifications",
{
keyPath:"id"
}
);

}

/*
LEADS
*/

if (
!db.objectStoreNames.contains(
"leads"
)
) {

const leads =
db.createObjectStore(
"leads",
{
keyPath:"id"
}
);

leads.createIndex(
"name",
"name",
{
unique:false
}
);

}

/*
TASKS
*/

if (
!db.objectStoreNames.contains(
"tasks"
)
) {

db.createObjectStore(
"tasks",
{
keyPath:"id"
}
);

}

/*
FINANCE
*/

if (
!db.objectStoreNames.contains(
"finance"
)
) {

db.createObjectStore(
"finance",
{
keyPath:"id"
}
);

}

/*
REMINDERS
*/

if (
!db.objectStoreNames.contains(
"reminders"
)
) {

db.createObjectStore(
"reminders",
{
keyPath:"id"
}
);

}

};

});

}

/*
========================================
GET STORE
========================================
*/

function getStore(
storeName,
mode="readonly"
){

const tx =
db.transaction(
storeName,
mode
);

return tx.objectStore(
storeName
);

}

/*
========================================
METADATA
========================================
*/

function addMetadata(data){

const now =
new Date()
.toISOString();

return {

...data,

createdAt:
data.createdAt || now,

updatedAt:
now,

version:
(data.version || 0) + 1

};

}

/*
========================================
ADD
========================================
*/

function add(
storeName,
data
){

return new Promise(
(resolve,reject)=>{

const store =
getStore(
storeName,
"readwrite"
);

const req =
store.add(data);

req.onsuccess=
()=>resolve(data);

req.onerror=
()=>reject(
req.error
);

});

}

/*
========================================
UPDATE
========================================
*/

function update(
storeName,
data
){

return new Promise(
(resolve,reject)=>{

const store =
getStore(
storeName,
"readwrite"
);

const req =
store.put(data);

req.onsuccess=
()=>resolve(data);

req.onerror=
()=>reject(
req.error
);

});

}

/*
========================================
DELETE
========================================
*/

function remove(
storeName,
id
){

return new Promise(
(resolve,reject)=>{

const store =
getStore(
storeName,
"readwrite"
);

const req =
store.delete(id);

req.onsuccess=
()=>resolve();

req.onerror=
()=>reject(
req.error
);

});

}

/*
========================================
GET ALL
========================================
*/

function getAll(
storeName
){

return new Promise(
(resolve,reject)=>{

const store =
getStore(storeName);

const req =
store.getAll();

req.onsuccess=
()=>resolve(
req.result || []
);

req.onerror=
()=>reject(
req.error
);

});

}

/*
========================================
GET ONE
========================================
*/

function get(
storeName,
id
){

return new Promise(
(resolve,reject)=>{

const store =
getStore(storeName);

const req =
store.get(id);

req.onsuccess=
()=>resolve(
req.result
);

req.onerror=
()=>reject(
req.error
);

});

}

/*
========================================
CLEAR STORE
========================================
*/

function clear(
storeName
){

return new Promise(
(resolve,reject)=>{

const store =
getStore(
storeName,
"readwrite"
);

const req =
store.clear();

req.onsuccess=
()=>resolve();

req.onerror=
()=>reject(
req.error
);

});

}

/*
========================================
LEADS
========================================
*/

async function getLeads(){

return await getAll(
"leads"
);

}

async function saveLead(
lead
){

if(!lead.id){

lead.id =
crypto.randomUUID();

}

lead =
addMetadata(
lead
);

await logActivity(

"create",

"crm",

`Lead ${lead.name} disimpan`

);

await addNotification(

"Lead Baru",

`${lead.name} berhasil ditambahkan`,

"success"

);

localStorage.setItem(

"lastBackup",

new Date()
.toISOString()

);

return await update(
"leads",
lead
);

}

/*
========================================
TASKS
========================================
*/

async function getTasks(){

return await getAll(
"tasks"
);

}

async function saveTask(
task
){

if(!task.id){

task.id =
crypto.randomUUID();

}

task =
addMetadata(
task
);

localStorage.setItem(

"lastBackup",

new Date()
.toISOString()

);

return await update(
"tasks",
task
);

await logActivity(

"create",

"planner",

`Task ${task.title} disimpan`

);

await addNotification(

"Task Baru",

task.title,

"info"

);

await logActivity(

"create",

"finance",

`${item.title}`

);

await addNotification(

"Transaksi",

item.title,

"success"

);

await logActivity(

"create",

"reminder",

item.title

);

await addNotification(

"Reminder",

item.title,

"info"

);

}

/*
========================================
FINANCE
========================================
*/

async function getFinance(){

return await getAll(
"finance"
);

}

async function saveFinance(
item
){

if(!item.id){

item.id =
crypto.randomUUID();

}

item =
addMetadata(
item
);

localStorage.setItem(

"lastBackup",

new Date()
.toISOString()

);

return await update(
"finance",
item
);

}

/*
========================================
REMINDERS
========================================
*/

async function getReminders(){

return await getAll(
"reminders"
);

}

async function saveReminder(
item
){

if(!item.id){

item.id =
crypto.randomUUID();

}

item =
addMetadata(
item
);

localStorage.setItem(

"lastBackup",

new Date()
.toISOString()

);

return await update(
"reminders",
item
);

}

/*
========================================
ACTIVITY LOG
========================================
*/

async function logActivity(

action,
module,
description

){

const log = {

id:
crypto.randomUUID(),

action,

module,

description,

createdAt:
new Date()
.toISOString()

};

localStorage.setItem(

"lastBackup",

new Date()
.toISOString()

);

return await update(
"activity_logs",
log
);

}

async function getActivities(){

return await getAll(
"activity_logs"
);

}

/*
========================================
NOTIFICATION CENTER
========================================
*/

async function addNotification(

title,
message,
type="info"

){

const notification = {

id:
crypto.randomUUID(),

title,

message,

type,

read:false,

createdAt:
new Date()
.toISOString()

};

localStorage.setItem(

"lastBackup",

new Date()
.toISOString()

);

return await update(
"notifications",
notification
);

}

async function getNotifications(){

return await getAll(
"notifications"
);

}

/*
========================================
DASHBOARD STATS
========================================
*/

async function getStats(){

const leads =
await getLeads();

const tasks =
await getTasks();

const finance =
await getFinance();

let income = 0;
let expense = 0;

finance.forEach(item=>{

if(
item.type==="income"
){

income +=
Number(
item.amount
||0
);

}

if(
item.type==="expense"
){

expense +=
Number(
item.amount
||0
);

}

});

return {

totalLeads:
leads.length,

totalTasks:
tasks.length,

income,

expense,

profit:
income-expense

};

}

/*
========================================
BACKUP
========================================
*/

async function backup(){

const data = {

leads:
await getLeads(),

tasks:
await getTasks(),

finance:
await getFinance(),

reminders:
await getReminders(),

createdAt:
new Date()
.toISOString()

};

return JSON.stringify(
data,
null,
2
);

}

/*
========================================
RESTORE
========================================
*/

async function restore(
json
){

const data =
JSON.parse(json);

if(data.leads){

for(
const item
of data.leads
){

await saveLead(
item
);

}

}

if(data.tasks){

for(
const item
of data.tasks
){

await saveTask(
item
);

}

}

if(data.finance){

for(
const item
of data.finance
){

await saveFinance(
item
);

}

}

if(data.reminders){

for(
const item
of data.reminders
){

await saveReminder(
item
);

}

}

return true;

}

/*
========================================
EXPORT
========================================
*/

return {

init,

add,
update,
remove,
get,
getAll,
clear,

getLeads,
saveLead,

getTasks,
saveTask,

getActivities,
logActivity,

getNotifications,
addNotification

getFinance,
saveFinance,

getReminders,
saveReminder,

getStats,

backup,
restore

};

})();
