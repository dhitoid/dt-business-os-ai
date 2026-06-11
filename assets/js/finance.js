/*
========================================
DT BUSINESS OS AI
FINANCE MODULE V1
========================================
*/

const Finance = (() => {

/*
========================================
LOAD
========================================
*/

async function loadFinance(){

const container =
document.getElementById(
"financeList"
);

if(!container)
return;

let items =
await Storage.getFinance();

items.sort((a,b)=>
new Date(b.date || 0)
-
new Date(a.date || 0)
);

renderFinance(items);

}

/*
========================================
FORMAT
========================================
*/

function formatMoney(amount){

return new Intl.NumberFormat(
"id-ID",
{
style:"currency",
currency:"IDR",
maximumFractionDigits:0
}
).format(
Number(amount || 0)
);

}

/*
========================================
SUMMARY
========================================
*/

function calculateSummary(items){

let income = 0;
let expense = 0;

items.forEach(item=>{

if(item.type==="income"){

income += Number(
item.amount || 0
);

}

if(item.type==="expense"){

expense += Number(
item.amount || 0
);

}

});

return {

income,

expense,

profit:
income - expense

};

}

/*
========================================
RENDER
========================================
*/

function renderFinance(items){

const container =
document.getElementById(
"financeList"
);

if(!container)
return;

if(!items.length){

container.innerHTML =

`
<div class="list-card">

<h3>
Belum ada transaksi
</h3>

<p>
Tambahkan income atau
expense pertama Anda.
</p>

</div>
`;

return;

}

const summary =
calculateSummary(items);

container.innerHTML =

`
<div class="list-card">

<h3>
Ringkasan Keuangan
</h3>

<p>
💰 Income :
${formatMoney(summary.income)}
</p>

<p>
💸 Expense :
${formatMoney(summary.expense)}
</p>

<p>
📈 Profit :
${formatMoney(summary.profit)}
</p>

</div>

${items.map(item=>`

<div class="list-card">

<h3>

${item.type==="income"
? "💰 Income"
: "💸 Expense"}

</h3>

<p>

${item.title}

</p>

<p>

${item.category || "-"}

</p>

<p>

${formatMoney(item.amount)}

</p>

<p>

📅 ${item.date || "-"}

</p>

<div
style="
display:flex;
gap:8px;
margin-top:10px;
flex-wrap:wrap;
">

<button
onclick="
Finance.editFinance(
'${item.id}'
)
">

Edit

</button>

<button
onclick="
Finance.deleteFinance(
'${item.id}'
)
">

Hapus

</button>

</div>

</div>

`).join("")}
`;

}

/*
========================================
ADD
========================================
*/

function openAddFinance(){

const html =

`
<form id="financeForm">

<select
id="financeType">

<option value="income">
Income
</option>

<option value="expense">
Expense
</option>

</select>

<input
type="text"
id="financeTitle"
placeholder="Judul Transaksi"
required>

<input
type="number"
id="financeAmount"
placeholder="Nominal"
required>

<select
id="financeCategory">

<option>
Komisi
</option>

<option>
Penjualan
</option>

<option>
Operasional
</option>

<option>
Marketing
</option>

<option>
Transport
</option>

<option>
Lainnya
</option>

</select>

<input
type="date"
id="financeDate">

<button
type="submit">

Simpan

</button>

</form>
`;

App.openModal(
"Tambah Transaksi",
html
);

setTimeout(()=>{

document
.getElementById(
"financeForm"
)
.addEventListener(
"submit",
saveFinance
);

},100);

}

/*
========================================
SAVE
========================================
*/

async function saveFinance(e){

e.preventDefault();

const item = {

id:
crypto.randomUUID(),

type:
document.getElementById(
"financeType"
).value,

title:
document.getElementById(
"financeTitle"
).value,

amount:
Number(
document.getElementById(
"financeAmount"
).value
),

category:
document.getElementById(
"financeCategory"
).value,

date:
document.getElementById(
"financeDate"
).value,

createdAt:
new Date()
.toISOString()

};

await Storage.saveFinance(
item
);

App.closeModal();

App.showToast(
"Transaksi berhasil ditambahkan"
);

await loadFinance();

await App.updateStats();

}

/*
========================================
EDIT
========================================
*/

async function editFinance(id){

const item =
await Storage.get(
"finance",
id
);

if(!item)
return;

const html =

`
<form id="editFinanceForm">

<select
id="editType">

<option value="income"
${item.type==="income"?"selected":""}>
Income
</option>

<option value="expense"
${item.type==="expense"?"selected":""}>
Expense
</option>

</select>

<input
type="text"
id="editTitle"
value="${item.title}"
required>

<input
type="number"
id="editAmount"
value="${item.amount}"
required>

<input
type="text"
id="editCategory"
value="${item.category||""}">

<input
type="date"
id="editDate"
value="${item.date||""}">

<button
type="submit">

Update

</button>

</form>
`;

App.openModal(
"Edit Transaksi",
html
);

setTimeout(()=>{

document
.getElementById(
"editFinanceForm"
)
.addEventListener(
"submit",

async(e)=>{

e.preventDefault();

item.type =
document.getElementById(
"editType"
).value;

item.title =
document.getElementById(
"editTitle"
).value;

item.amount =
Number(
document.getElementById(
"editAmount"
).value
);

item.category =
document.getElementById(
"editCategory"
).value;

item.date =
document.getElementById(
"editDate"
).value;

await Storage.saveFinance(
item
);

App.closeModal();

App.showToast(
"Transaksi diperbarui"
);

loadFinance();

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

async function deleteFinance(id){

if(
!confirm(
"Hapus transaksi ini?"
)
) return;

await Storage.remove(
"finance",
id
);

App.showToast(
"Transaksi dihapus"
);

loadFinance();

App.updateStats();

}

/*
========================================
INIT
========================================
*/

async function init(){

await loadFinance();

document
.getElementById(
"newFinance"
)
?.addEventListener(
"click",
openAddFinance
);

document
.getElementById(
"addIncomeBtn"
)
?.addEventListener(
"click",
openAddFinance
);

}

/*
========================================
PUBLIC
========================================
*/

return {

init,

loadFinance,

openAddFinance,

editFinance,

deleteFinance

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

Finance.init();

},700);

}
);
