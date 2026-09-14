import {GITHUB_EDITOR_CONFIG as CONFIG} from './github-editor-config.js';

const proxy=String(CONFIG.oauthProxy||'').replace(/\/$/,'');
const nativeFetch=globalThis.fetch.bind(globalThis);

globalThis.fetch=(input,init={})=>{
  try{
    const url=typeof input==='string'?input:input?.url||'';
    if(proxy&&url===`${proxy}/oauth/access_token`&&init?.body){
      const params=new URLSearchParams(init.body);
      // repository_id is optional for GitHub App Device Flow. Sending it here can
      // make GitHub reject the exchange before the installation/repository access
      // check has completed. We validate the owner and repository write access
      // immediately after token creation instead.
      params.delete('repository_id');
      return nativeFetch(input,{...init,body:params.toString()});
    }
  }catch(error){
    console.warn('Device Flow compatibility shim skipped',error);
  }
  return nativeFetch(input,init);
};
