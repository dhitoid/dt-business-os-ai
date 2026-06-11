/*
========================================
DT BUSINESS OS AI
APP ENGINE V1
========================================
*/

const App = (() => {

let deferredPrompt = null;

/*
========================================
SELECTOR
========================================
*/

const $ = (el) =>
document.querySelector(el);

const $$ = (el) =>
document.querySelectorAll(el);

/*
========================================
TOAST
========================================
*/

function showToast(message){

const toast =
$("#toast");

if(!toast) return;

toast.textContent =
message;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

}

/*
========================================
MODAL
========================================
*/

function openModal(
title,
content
){

$("#modalTitle")
.textContent = title;

const body =
$("#modalBody");

body.innerHTML = "";

if(
typeof content
=== "string"
){

body.innerHTML =
content;

}else{

body.appendChild(
content
);

}

$("#modal")
.classList.add(
"active"
);

}

function closeModal(){

$("#modal")
.classList.remove(
"active"
);

}

/*
========================================
PAGE ROUTER
========================================
*/

function openPage(id){

$$(".page")
.forEach(page=>{

page.classList.remove(
"active"
);

});

const target =
document.getElementById(
id
);

if(target){

target.classList.add(
"active"
);

}

$$(".nav-btn")
.forEach(btn=>{

btn.classList.remove(
"active"
);

if(
btn.dataset.page
=== id
){

btn.classList.add(
"active"
);

}

});

}

/*
========================================
SIDEBAR
========================================
*/

function openSidebar(){

$("#sidebar")
.classList.add(
"active"
);

$("#overlay")
.classList.add(
"active"
);

}

function closeSidebar(){

$("#sidebar")
.classList.remove(
"active"
);

$("#overlay")
.classList.remove(
"active"
);

}

/*
========================================
DARK MODE
========================================
*/

function loadTheme(){

const theme =
localStorage.getItem(
"theme"
);

if(theme==="dark"){

document.body
.classList.add(
"dark"
);

const sw =
$("#themeSwitch");

if(sw){

sw.checked=true;

}

}

}

function toggleTheme(){

document.body
.classList.toggle(
"dark"
);

const isDark =
document.body
.classList.contains(
"dark"
);

localStorage.setItem(
"theme",
isDark
? "dark"
: "light"
);

showToast(
isDark
? "Dark Mode Aktif"
: "Light Mode Aktif"
);

}

/*
========================================
DASHBOARD
========================================
*/

async function updateStats(){

if(
typeof Storage
=== "undefined"
){

return;
}

const stats =
await Storage.getStats();

const lead =
$("#leadCount");

const task =
$("#taskCount");

const income =
$("#incomeTotal");

const expense =
$("#expenseTotal");

if(lead){

lead.textContent =
stats.totalLeads;

}

if(task){

task.textContent =
stats.totalTasks;

}

if(income){

income.textContent =
formatRupiah(
stats.income
);

}

if(expense){

expense.textContent =
formatRupiah(
stats.expense
);

}

}

/*
========================================
FORMAT RUPIAH
========================================
*/

function formatRupiah(num){

return new Intl
.NumberFormat(
"id-ID",
{
style:"currency",
currency:"IDR",
maximumFractionDigits:0
}
)
.format(
num||0
);

}

/*
========================================
LOADER
========================================
*/

function hideLoader(){

const loader =
$("#loader");

if(!loader)
return;

setTimeout(()=>{

loader.style.display =
"none";

},800);

}

/*
========================================
FAB
========================================
*/

function handleFab(){

const fab =
$("#fab");

if(!fab)
return;

fab.addEventListener(
"click",
()=>{

const active =
document.querySelector(
".page.active"
);

if(!active)
return;

const pageId =
active.id;

switch(pageId){

case "crm":

if(
window.CRM &&
CRM.openAddLead
){

CRM.openAddLead();

}

break;

case "planner":

if(
window.Planner &&
Planner.openAddTask
){

Planner.openAddTask();

}

break;

case "finance":

if(
window.Finance &&
Finance.openAddFinance
){

Finance.openAddFinance();

}

break;

case "reminder":

if(
window.Reminder &&
Reminder.openAddReminder
){

Reminder.openAddReminder();

}

break;

default:

showToast(
"Pilih menu terlebih dahulu"
);

}

});

}

/*
========================================
NOTIFICATION
========================================
*/

async function requestNotification(){

if(
!("Notification" in window)
){

showToast(
"Browser tidak mendukung notifikasi"
);

return;

}

const permission =
await Notification
.requestPermission();

if(
permission==="granted"
){

showToast(
"Notifikasi Aktif"
);

}else{

showToast(
"Notifikasi Ditolak"
);

}

}

/*
========================================
INSTALL PWA
========================================
*/

function initInstallPrompt(){

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt =
e;

const btn =
$("#installBtn");

if(btn){

btn.style.display=
"block";

}

});

}

async function installPWA(){

if(
!deferredPrompt
){

showToast(
"Install belum tersedia"
);

return;

}

deferredPrompt.prompt();

const choice =
await deferredPrompt
.userChoice;

if(
choice.outcome
==="accepted"
){

showToast(
"App berhasil diinstall"
);

}

deferredPrompt = null;

}

/*
========================================
EVENT
========================================
*/

function bindEvents(){

$("#openSidebar")
?.addEventListener(
"click",
openSidebar
);

$("#closeSidebar")
?.addEventListener(
"click",
closeSidebar
);

$("#overlay")
?.addEventListener(
"click",
closeSidebar
);

$("#closeModal")
?.addEventListener(
"click",
closeModal
);

$("#darkToggle")
?.addEventListener(
"click",
toggleTheme
);

$("#themeSwitch")
?.addEventListener(
"change",
toggleTheme
);

$("#notifPermission")
?.addEventListener(
"click",
requestNotification
);

$("#installBtn")
?.addEventListener(
"click",
installPWA
);

$$(".menu-btn")
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

openPage(
btn.dataset.page
);

closeSidebar();

}

);

});

$$(".nav-btn")
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

openPage(
btn.dataset.page
);

}

);

});

}

/*
========================================
INIT
========================================
*/

async function init(){

try{

if(
typeof Storage
!== "undefined"
){

await Storage.init();

}

loadTheme();

bindEvents();

handleFab();

initInstallPrompt();

await updateStats();

hideLoader();

console.log(
"DT Business OS AI Ready"
);

}catch(err){

console.error(err);

showToast(
"Gagal memuat aplikasi"
);

}

}

/*
========================================
PUBLIC
========================================
*/

return {

init,
showToast,
openModal,
closeModal,
updateStats,
formatRupiah

};

})();

/*
========================================
START APP
========================================
*/

document.addEventListener(
"DOMContentLoaded",
()=>{

App.init();

}
);
