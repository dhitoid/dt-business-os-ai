/*
========================================
DT BUSINESS OS AI
CRM MODULE V1
========================================
*/

const CRM = (() => {

/*
========================================
LOAD LEADS
========================================
*/

async function loadLeads() {

const container =
document.getElementById(
"crmList"
);

if (!container) return;

const searchInput =
document.getElementById(
"leadSearch"
);

let leads =
await Storage.getLeads();

const keyword =
searchInput?.value
?.toLowerCase()
?.trim() || "";

if (keyword) {

leads = leads.filter(
lead =>

(lead.name || "")
.toLowerCase()
.includes(keyword)

||

(lead.phone || "")
.toLowerCase()
.includes(keyword)

||

(lead.source || "")
.toLowerCase()
.includes(keyword)

);

}

renderLeads(leads);

}

/*
========================================
RENDER
========================================
*/

function renderLeads(
leads
){

const container =
document.getElementById(
"crmList"
);

if (!container) return;

if (!leads.length) {

container.innerHTML =

`
<div class="list-card">

<h3>
Belum ada lead
</h3>

<p>
Tambahkan lead baru
untuk memulai CRM.
</p>

</div>
`;

return;

}

container.innerHTML =
leads.map(lead =>

`

<div class="list-card">

<h3>

${lead.name || "-"}

</h3>

<p>

📞 ${lead.phone || "-"}

</p>

<p>

📍 ${lead.source || "-"}

</p>

<p>

🏷️ ${lead.status || "New"}

</p>

<div
style="
display:flex;
gap:8px;
margin-top:10px;
flex-wrap:wrap;
">

<button
onclick="CRM.openWhatsapp('${lead.phone}')">

WA

</button>

<button
onclick="CRM.editLead('${lead.id}')">

Edit

</button>

<button
onclick="CRM.deleteLead('${lead.id}')">

Hapus

</button>

</div>

</div>

`

).join("");

}

/*
========================================
ADD LEAD
========================================
*/

function openAddLead() {

const html =

`

<form id="leadForm">

<input
type="text"
id="leadName"
placeholder="Nama Lead"
required>

<input
type="tel"
id="leadPhone"
placeholder="Nomor WhatsApp">

<input
type="text"
id="leadSource"
placeholder="Sumber Lead">

<select
id="leadStatus">

<option>
New
</option>

<option>
Contacted
</option>

<option>
Interested
</option>

<option>
Survey
</option>

<option>
Booking
</option>

<option>
Closing
</option>

<option>
Lost
</option>

</select>

<textarea
id="leadNote"
placeholder="Catatan">
</textarea>

<button
type="submit">

Simpan Lead

</button>

</form>

`;

App.openModal(
"Tambah Lead",
html
);

setTimeout(() => {

document
.getElementById(
"leadForm"
)
.addEventListener(
"submit",
saveLead
);

},100);

}

/*
========================================
SAVE LEAD
========================================
*/

async function saveLead(e){

e.preventDefault();

const lead = {

id:
crypto.randomUUID(),

name:
document.getElementById(
"leadName"
).value,

phone:
document.getElementById(
"leadPhone"
).value,

source:
document.getElementById(
"leadSource"
).value,

status:
document.getElementById(
"leadStatus"
).value,

note:
document.getElementById(
"leadNote"
).value,

createdAt:
new Date()
.toISOString()

};

await Storage.saveLead(
lead
);

App.closeModal();

App.showToast(
"Lead berhasil ditambahkan"
);

await loadLeads();

await App.updateStats();

}

/*
========================================
EDIT LEAD
========================================
*/

async function editLead(id){

const lead =
await Storage.get(
"leads",
id
);

if(!lead)
return;

const html =

`

<form id="editLeadForm">

<input
type="text"
id="editName"
value="${lead.name||""}"
required>

<input
type="tel"
id="editPhone"
value="${lead.phone||""}">

<input
type="text"
id="editSource"
value="${lead.source||""}">

<select
id="editStatus">

<option
${lead.status==="New"?"selected":""}>
New
</option>

<option
${lead.status==="Contacted"?"selected":""}>
Contacted
</option>

<option
${lead.status==="Interested"?"selected":""}>
Interested
</option>

<option
${lead.status==="Survey"?"selected":""}>
Survey
</option>

<option
${lead.status==="Booking"?"selected":""}>
Booking
</option>

<option
${lead.status==="Closing"?"selected":""}>
Closing
</option>

<option
${lead.status==="Lost"?"selected":""}>
Lost
</option>

</select>

<textarea
id="editNote">

${lead.note||""}

</textarea>

<button
type="submit">

Update Lead

</button>

</form>

`;

App.openModal(
"Edit Lead",
html
);

setTimeout(()=>{

document
.getElementById(
"editLeadForm"
)
.addEventListener(
"submit",
async (e)=>{

e.preventDefault();

lead.name =
document.getElementById(
"editName"
).value;

lead.phone =
document.getElementById(
"editPhone"
).value;

lead.source =
document.getElementById(
"editSource"
).value;

lead.status =
document.getElementById(
"editStatus"
).value;

lead.note =
document.getElementById(
"editNote"
).value;

await Storage.saveLead(
lead
);

App.closeModal();

App.showToast(
"Lead diperbarui"
);

loadLeads();

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

async function deleteLead(id){

const confirmDelete =
confirm(
"Hapus lead ini?"
);

if(!confirmDelete)
return;

await Storage.remove(
"leads",
id
);

App.showToast(
"Lead dihapus"
);

loadLeads();

App.updateStats();

}

/*
========================================
WHATSAPP
========================================
*/

function openWhatsapp(phone){

if(!phone){

App.showToast(
"Nomor tidak tersedia"
);

return;

}

const cleaned =
phone.replace(
/[^0-9]/g,
""
);

window.open(

`https://wa.me/${cleaned}`,

"_blank"

);

}

/*
========================================
SEARCH
========================================
*/

function initSearch(){

const search =
document.getElementById(
"leadSearch"
);

if(!search)
return;

search.addEventListener(
"input",
loadLeads
);

}

/*
========================================
INIT
========================================
*/

async function init(){

await loadLeads();

initSearch();

const btn1 =
document.getElementById(
"newLead"
);

if(btn1){

btn1.addEventListener(
"click",
openAddLead
);

}

const btn2 =
document.getElementById(
"addLeadBtn"
);

if(btn2){

btn2.addEventListener(
"click",
openAddLead
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
loadLeads,

openAddLead,

editLead,

deleteLead,

openWhatsapp

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

CRM.init();

},500);

}
);
