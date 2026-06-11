/*
========================================
DT BUSINESS OS AI
SERVICE WORKER V1
========================================
*/

const CACHE_NAME =
"dt-os-v1";

const ASSETS = [

"/",

"/index.html",

"/manifest.json",

"/assets/css/style.css",

"/assets/js/storage.js",

"/assets/js/app.js",

"/assets/js/crm.js",

"/assets/js/planner.js",

"/assets/js/finance.js",

"/assets/js/reminder.js",

"/assets/js/ai.js",

"/assets/js/pwa.js"

];

/*
========================================
INSTALL
========================================
*/

self.addEventListener(

"install",

event => {

event.waitUntil(

caches.open(
CACHE_NAME
)

.then(cache =>

cache.addAll(
ASSETS
)

)

);

self.skipWaiting();

}

);

/*
========================================
ACTIVATE
========================================
*/

self.addEventListener(

"activate",

event => {

event.waitUntil(

caches.keys()

.then(keys =>

Promise.all(

keys.map(key => {

if(
key !== CACHE_NAME
){

return caches.delete(
key
);

}

})

)

)

);

self.clients.claim();

}

);

/*
========================================
FETCH
========================================
*/

self.addEventListener(

"fetch",

event => {

event.respondWith(

caches.match(
event.request
)

.then(response => {

return (
response ||

fetch(
event.request
)
);

})

);

}

);