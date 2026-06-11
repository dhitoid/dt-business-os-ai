/*
========================================
DT BUSINESS OS AI
VALIDATOR ENGINE V1.1.1
========================================
*/

const Validator = (() => {

/*
========================================
REQUIRED
========================================
*/

function required(value){

return (
value !== null &&
value !== undefined &&
String(value).trim() !== ""
);

}

/*
========================================
MIN LENGTH
========================================
*/

function minLength(
value,
length = 3
){

return String(
value || ""
).trim().length >= length;

}

/*
========================================
MAX LENGTH
========================================
*/

function maxLength(
value,
length = 100
){

return String(
value || ""
).trim().length <= length;

}

/*
========================================
PHONE
========================================
*/

function phone(value){

if(!value) return false;

const clean =
String(value)
.replace(/\s/g,"")
.replace(/\-/g,"");

const regex =
/^(08|628|\+628)[0-9]{7,14}$/;

return regex.test(clean);

}

/*
========================================
EMAIL
========================================
*/

function email(value){

if(!value) return false;

const regex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return regex.test(value);

}

/*
========================================
NUMBER
========================================
*/

function number(value){

return (
!isNaN(value) &&
value !== "" &&
value !== null
);

}

/*
========================================
POSITIVE NUMBER
========================================
*/

function positiveNumber(value){

return (
number(value) &&
Number(value) > 0
);

}

/*
========================================
DATE
========================================
*/

function date(value){

if(!value) return false;

const d =
new Date(value);

return !isNaN(
d.getTime()
);

}

/*
========================================
FUTURE DATE
========================================
*/

function futureDate(value){

if(!date(value))
return false;

return (
new Date(value)
>=
new Date()
);

}

/*
========================================
WHATSAPP FORMATTER
========================================
*/

function normalizePhone(phone){

if(!phone)
return "";

let number =
phone.replace(
/[^0-9]/g,
""
);

if(
number.startsWith("08")
){

number =
"62" +
number.substring(1);

}

return number;

}

/*
========================================
MONEY
========================================
*/

function money(value){

return (
positiveNumber(value)
);

}

/*
========================================
SANITIZE TEXT
========================================
*/

function sanitize(value){

if(!value)
return "";

return String(value)

.replace(
/</g,
"&lt;"
)

.replace(
/>/g,
"&gt;"
)

.trim();

}

/*
========================================
FORM VALIDATOR
========================================
*/

function validateLead(data){

if(
!required(data.name)
){

return {
valid:false,
message:
"Nama wajib diisi"
};

}

if(
data.phone &&
!phone(data.phone)
){

return {
valid:false,
message:
"Nomor WhatsApp tidak valid"
};

}

return {
valid:true
};

}

/*
========================================
TASK VALIDATOR
========================================
*/

function validateTask(data){

if(
!required(data.title)
){

return {
valid:false,
message:
"Judul task wajib diisi"
};

}

return {
valid:true
};

}

/*
========================================
FINANCE VALIDATOR
========================================
*/

function validateFinance(data){

if(
!required(data.title)
){

return {
valid:false,
message:
"Judul transaksi wajib diisi"
};

}

if(
!positiveNumber(
data.amount
)
){

return {
valid:false,
message:
"Nominal tidak valid"
};

}

return {
valid:true
};

}

/*
========================================
REMINDER VALIDATOR
========================================
*/

function validateReminder(data){

if(
!required(data.title)
){

return {
valid:false,
message:
"Judul reminder wajib diisi"
};

}

if(
!date(data.date)
){

return {
valid:false,
message:
"Tanggal tidak valid"
};

}

return {
valid:true
};

}

/*
========================================
PUBLIC
========================================
*/

return {

required,

minLength,
maxLength,

phone,
email,

number,
positiveNumber,

date,
futureDate,

money,

sanitize,

normalizePhone,

validateLead,
validateTask,
validateFinance,
validateReminder

};

})();