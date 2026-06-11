/*
========================================
DT BUSINESS OS AI
AI MODULE V1
========================================
*/

const AI = (() => {

/*
========================================
ELEMENTS
========================================
*/

const output =
() => document.getElementById(
"aiOutput"
);

/*
========================================
COPY
========================================
*/

async function copyOutput(){

const text =
output()?.value;

if(!text){

App.showToast(
"Tidak ada teks"
);

return;
}

try{

await navigator.clipboard
.writeText(text);

App.showToast(
"Berhasil disalin"
);

}catch{

App.showToast(
"Gagal menyalin"
);

}

}

/*
========================================
FOLLOW UP
========================================
*/

function generateFollowUp(){

const html =

`
<form id="followupForm">

<input
type="text"
id="customerName"
placeholder="Nama Prospek"
required>

<select
id="followType">

<option>
Lead Baru
</option>

<option>
Belum Respon
</option>

<option>
Setelah Survey
</option>

<option>
Menunggu Booking
</option>

<option>
Menunggu Closing
</option>

</select>

<button type="submit">

Generate

</button>

</form>
`;

App.openModal(
"AI Follow Up",
html
);

setTimeout(()=>{

document
.getElementById(
"followupForm"
)
.addEventListener(
"submit",

(e)=>{

e.preventDefault();

const name =
document.getElementById(
"customerName"
).value;

const type =
document.getElementById(
"followType"
).value;

let text = "";

switch(type){

case "Lead Baru":

text =

`Halo ${name},

Terima kasih sudah tertarik dengan properti kami.

Apakah ada tipe rumah tertentu yang sedang Anda cari?

Saya siap membantu memberikan informasi lengkap dan penawaran terbaik.`;

break;

case "Belum Respon":

text =

`Halo ${name},

Saya ingin follow up kembali terkait informasi properti yang pernah Anda tanyakan.

Apabila masih berminat, saya siap membantu menjelaskan detail unit yang tersedia.`;

break;

case "Setelah Survey":

text =

`Halo ${name},

Terima kasih sudah meluangkan waktu untuk survey.

Bagaimana kesan Anda terhadap unit yang telah dilihat?

Jika ada pertanyaan tambahan saya siap membantu.`;

break;

case "Menunggu Booking":

text =

`Halo ${name},

Saya ingin menginformasikan bahwa unit yang Anda minati masih tersedia.

Apabila ingin mengamankan unit tersebut, saya siap membantu proses booking.`;

break;

case "Menunggu Closing":

text =

`Halo ${name},

Saya ingin memastikan apakah ada dokumen atau informasi tambahan yang diperlukan sebelum proses closing.

Saya siap membantu sampai proses selesai.`;

break;

}

output().value =
text;

App.closeModal();

}

);

},100);

}

/*
========================================
BROADCAST
========================================
*/

function generateBroadcast(){

const html =

`
<form id="broadcastForm">

<input
type="text"
id="promoName"
placeholder="Nama Promo"
required>

<button type="submit">

Generate

</button>

</form>
`;

App.openModal(
"Broadcast WA",
html
);

setTimeout(()=>{

document
.getElementById(
"broadcastForm"
)
.addEventListener(
"submit",

(e)=>{

e.preventDefault();

const promo =
document.getElementById(
"promoName"
).value;

output().value =

`🔥 PROMO ${promo.toUpperCase()} 🔥

Kesempatan terbaik memiliki hunian impian.

✅ Lokasi strategis
✅ Cicilan ringan
✅ Fasilitas lengkap
✅ Investasi menguntungkan

Hubungi saya sekarang untuk mendapatkan informasi lengkap dan penawaran khusus.

Terima kasih.`;

App.closeModal();

}

);

},100);

}

/*
========================================
CAPTION
========================================
*/

function generateCaption(){

const html =

`
<form id="captionForm">

<input
type="text"
id="propertyName"
placeholder="Nama Properti"
required>

<button type="submit">

Generate

</button>

</form>
`;

App.openModal(
"Caption Properti",
html
);

setTimeout(()=>{

document
.getElementById(
"captionForm"
)
.addEventListener(
"submit",

(e)=>{

e.preventDefault();

const property =
document.getElementById(
"propertyName"
).value;

output().value =

`🏡 ${property}

Hunian modern dengan lokasi strategis dan nilai investasi yang terus berkembang.

✨ Keunggulan:
✔ Akses mudah
✔ Lingkungan nyaman
✔ Harga kompetitif
✔ Potensi kenaikan nilai tinggi

Segera jadwalkan survey dan temukan rumah impian Anda.`;

App.closeModal();

}

);

},100);

}

/*
========================================
SCRIPT TELEPON
========================================
*/

function generateCallScript(){

output().value =

`Halo Bapak/Ibu.

Perkenalkan saya dari tim marketing.

Apakah saat ini sedang mencari rumah atau properti untuk investasi?

Saya memiliki beberapa pilihan unit yang mungkin sesuai dengan kebutuhan Anda.

Jika berkenan, saya dapat menjelaskan secara singkat mengenai lokasi, harga, dan promo yang sedang berjalan.

Apakah saat ini ada waktu beberapa menit untuk berdiskusi?`;

}

/*
========================================
CLOSING SCRIPT
========================================
*/

function generateClosing(){

output().value =

`Halo Bapak/Ibu.

Terima kasih atas ketertarikannya terhadap unit yang telah kami tawarkan.

Saat ini unit masih tersedia dan promo yang berjalan cukup menarik.

Apabila Bapak/Ibu berkenan melakukan booking dalam waktu dekat, kami dapat membantu mengamankan unit terbaik sebelum terjual.

Saya siap membantu proses selanjutnya kapan saja.`;

}

/*
========================================
BIND
========================================
*/

function bindEvents(){

const buttons =
document.querySelectorAll(
".ai-tool"
);

buttons.forEach(btn=>{

btn.addEventListener(
"click",

()=>{

const text =
btn.textContent
.trim();

if(
text.includes(
"Follow"
)
){

generateFollowUp();

}

else if(
text.includes(
"Broadcast"
)
){

generateBroadcast();

}

else if(
text.includes(
"Caption"
)
){

generateCaption();

}

else if(
text.includes(
"Telepon"
)
){

generateCallScript();

}

}

);

});

}

/*
========================================
ADD EXTRA BUTTON
========================================
*/

function addCopyButton(){

const area =
document.getElementById(
"aiOutput"
);

if(!area)
return;

const btn =
document.createElement(
"button"
);

btn.textContent =
"📋 Copy";

btn.style.marginTop =
"10px";

btn.addEventListener(
"click",
copyOutput
);

area.parentNode
.appendChild(btn);

}

/*
========================================
INIT
========================================
*/

function init(){

bindEvents();

addCopyButton();

console.log(
"AI Module Ready"
);

}

/*
========================================
PUBLIC
========================================
*/

return {

init,

generateFollowUp,

generateBroadcast,

generateCaption,

generateCallScript,

generateClosing,

copyOutput

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

AI.init();

},900);

}
);
