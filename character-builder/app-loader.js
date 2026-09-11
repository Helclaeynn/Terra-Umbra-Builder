const parts=["00-truth-full-daemon-angelus.txt", "01.txt", "02.txt", "03.txt", "04.txt", "05.txt", "06.txt", "06b-reality-safe-fetch.txt", "07-reality.txt", "08-reality-access.txt", "09a-reality-lock.txt", "09b-reality-lock.txt", "09c-reality-lock.txt", "10a-ux-budget.txt", "10b-ux-choices.txt", "10c-ux-validation-reset.txt", "11-truth-vampire-garou.txt", "12-ux-equipment-truth-polish.txt", "13-truth-daemon-angelus.txt", "14-ux-dropdowns.txt", "15-reality-prereqs-lifestyle.txt", "16-truth-structure-mage-khinae.txt", "17-truth-choice-details.txt", "18-lifestyle-assets.txt", "18b-truth-exile-extral-compat.txt", "19-truth-exile-extral.txt"];
const base='./app.parts/';
const chunks=await Promise.all(parts.map(async n=>{const r=await fetch(base+n);if(!r.ok)throw new Error(`${n}: ${r.status}`);return r.text()}));
const url=URL.createObjectURL(new Blob([chunks.join('\n')],{type:'text/javascript'}));
try{await import(url)}finally{URL.revokeObjectURL(url)}
