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

${
lead.surveyDate
?

`

<p>

🏠 Survey:

${lead.surveyDate}

</p>

`

:

""

}

<p>

🏷️ ${lead.status || "New"}

</p>

${
lead.tags?.length

?

`

<p>

🏷️

${lead.tags.join(", ")}

</p>

`

:

""

}

<p>

📈 Score :
${lead.score || 0}

</p>

<p>

📞 Follow Up :
${lead.followUpCount || 0}x

</p>

${
lead.lastFollowUp
?

`

<p>

🕒 Terakhir FU:

${new Date(
lead.lastFollowUp
).toLocaleDateString("id-ID")}

</p>

`

:

""

}

<p>

${
lead.temperature === "Hot"
?

"🔥 Hot Lead"

:

lead.temperature === "Warm"

?

"🟡 Warm Lead"

:

"❄️ Cold Lead"

}

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
onclick="
CRM.followUpLead(
'${lead.id}'
)
">

Follow Up

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

<input
type="date"
id="surveyDate">

<input
type="text"
id="leadTags"
placeholder="Tag: Investor,KPR,Cash">

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

id: crypto.randomUUID(),

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

surveyDate:
document.getElementById(
"surveyDate"
).value,

tags:
document.getElementById(
"leadTags"
)
.value
.split(",")
.map(tag=>tag.trim())
.filter(Boolean),

note:
document.getElementById(
"leadNote"
).value,

followUpCount:0,

lastFollowUp:""

};

/*
SANITIZE
*/

lead.name =
Validator.sanitize(
lead.name
);

lead.phone =
Validator.normalizePhone(
lead.phone
);

lead.source =
Validator.sanitize(
lead.source
);

lead.note =
Validator.sanitize(
lead.note
);

/*
VALIDATE
*/

const validation =
Validator.validateLead(
lead
);

if(!validation.valid){

App.toast(
validation.message,
"error"
);

return;

}

/*
LEAD SCORE
*/

lead.score =
calculateLeadScore(
lead
);

lead.temperature =
getLeadTemperature(
lead.score
);

await Storage.saveLead(
lead
);

App.closeModal();

App.toast(
"Lead berhasil ditambahkan",
"success"
);

await loadLeads();

await App.updateStats();

}

function calculateLeadScore(
lead
){

let score = 0;

switch(
lead.status
){

case "New":
score += 10;
break;

case "Contacted":
score += 30;
break;

case "Interested":
score += 60;
break;

case "Survey":
score += 80;
break;

case "Booking":
score += 95;
break;

case "Closing":
score += 100;
break;

}

if(
lead.followUpCount > 3
){

score += 10;

}

return Math.min(
score,
100
);

}

function getLeadTemperature(
score
){

if(score >= 80)
return "Hot";

if(score >= 50)
return "Warm";

return "Cold";

}

async function followUpLead(id){

const lead =
await Storage.get(
"leads",
id
);

if(!lead)
return;

lead.followUpCount =
(lead.followUpCount || 0)
+ 1;

lead.lastFollowUp =
new Date()
.toISOString();

lead.score =
Math.min(
(lead.score || 0) + 5,
100
);

lead.temperature =
getLeadTemperature(
lead.score
);

await Storage.saveLead(
lead
);

await Storage.logActivity(

"followup",

"crm",

`Follow Up ${lead.name}`

);

App.toast(
"Follow Up dicatat",
"success"
);

loadLeads();

App.updateStats();

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

<input
type="date"
id="editSurveyDate"
value="${lead.surveyDate||""}">

<input
type="text"
id="editTags"
value="${(lead.tags||[]).join(",")}"
placeholder="Investor,KPR,Cash">

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

lead.surveyDate =
document.getElementById(
"editSurveyDate"
).value;

lead.tags =
document.getElementById(
"editTags"
)
.value
.split(",")
.map(tag=>tag.trim())
.filter(Boolean);

lead.note =
document.getElementById(
"editNote"
).value;

const validation =
Validator.validateLead(
lead
);

if(
!validation.valid
){

App.showToast(
validation.message
);

return;
}

lead.score =
calculateLeadScore(
lead
);

lead.temperature =
getLeadTemperature(
lead.score
);

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

const ok =
await App.confirm({

title:
"Hapus Lead",

message:
"Data tidak dapat dikembalikan"

});

if(!ok)
return;

await Storage.remove(
"leads",
id
);

await Storage.logActivity(

"delete",

"crm",

"Hapus Lead"

);

App.toast(
"Lead dihapus",
"warning"
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

followUpLead,

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
