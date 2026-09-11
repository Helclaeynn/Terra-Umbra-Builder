const parts=["01.txt", "02.txt", "03.txt", "04.txt", "05.txt", "06.txt", "07-reality.txt", "08-reality-access.txt", "09a-reality-lock.txt", "09b-reality-lock.txt", "09c-reality-lock.txt"];
const base='./app.parts/';
const chunks=await Promise.all(parts.map(async n=>{const r=await fetch(base+n);if(!r.ok)throw new Error(`${n}: ${r.status}`);return r.text()}));
const url=URL.createObjectURL(new Blob([chunks.join('\n')],{type:'text/javascript'}));
try{await import(url)}finally{URL.revokeObjectURL(url)}
