import { watchEffect } from 'vue';
export function pageTitle(label:string){ return `${label.trim() || 'Compendium'} · Terra Umbra`; }
export function usePageTitle(label:()=>string){ watchEffect(()=>{const value=label();if(value)document.title=pageTitle(value);}); }
