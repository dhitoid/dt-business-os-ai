/*
========================================
DT BUSINESS OS AI
PWA ENGINE
========================================
*/

const PWA = (() => {

/*
========================================
REGISTER SW
========================================
*/

async function registerSW(){

if(
!("serviceWorker" in navigator)
){

return;
}

try{

const registration =

await navigator
.serviceWorker
.register(
"/sw.js"
);

console.log(
"SW Registered",
registration
);

}catch(err){

console.error(
err
);

}

}

/*
========================================
ONLINE STATUS
========================================
*/

function setupNetwork(){

window.addEventListener(
"online",
()=>{

if(window.App){

App.showToast(
"Online"
);

}

}
);

window.addEventListener(
"offline",
()=>{

if(window.App){

App.showToast(
"Offline Mode"
);

}

}
);

}

/*
========================================
UPDATE CHECK
========================================
*/

function checkUpdate(){

if(
!("serviceWorker"
in navigator)
){

return;
}

navigator.serviceWorker
.getRegistration()

.then(reg => {

if(!reg)
return;

reg.addEventListener(

"updatefound",

()=>{

if(window.App){

App.showToast(
"Update tersedia"
);

}

}

);

});

}

/*
========================================
DEVICE INFO
========================================
*/

function getDeviceInfo(){

const ua =
navigator.userAgent;

return {

ios:
(/iPhone|iPad|iPod/)
.test(ua),

android:
(/Android/)
.test(ua),

standalone:

window.matchMedia(
"(display-mode: standalone)"
).matches

||

window.navigator
.standalone

};

}

/*
========================================
IOS INSTALL HINT
========================================
*/

function showIOSHint(){

const info =
getDeviceInfo();

if(
!info.ios
) return;

if(
info.standalone
) return;

setTimeout(()=>{

if(window.App){

App.showToast(
"Safari → Share → Add to Home Screen"
);

}

},3000);

}

/*
========================================
INIT
========================================
*/

function init(){

registerSW();

setupNetwork();

checkUpdate();

showIOSHint();

console.log(
"PWA Ready"
);

}

/*
========================================
PUBLIC
========================================
*/

return {

init

};

})();

/*
========================================
START
========================================
*/

document.addEventListener(

"DOMContentLoaded",

()=>{

PWA.init();

}

);