const hasOwn=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);

export function deepClone(value){
  return value==null?value:JSON.parse(JSON.stringify(value));
}

function decodeToken(token){
  return token.replace(/~1/g,'/').replace(/~0/g,'~');
}
function pointerParts(path){
  if(typeof path!=='string'||!path.startsWith('/'))throw new Error(`Chemin JSON Pointer invalide: ${path}`);
  if(path==='/')return [''];
  return path.slice(1).split('/').map(decodeToken);
}
function resolveParent(root,path,{create=false}={}){
  const parts=pointerParts(path);
  const key=parts.pop();
  let node=root;
  for(const part of parts){
    if(Array.isArray(node)){
      const index=Number(part);
      if(!Number.isInteger(index)||index<0||index>=node.length)throw new Error(`Index introuvable: ${part}`);
      node=node[index];
      continue;
    }
    if(node==null||typeof node!=='object')throw new Error(`Parent non objet pour ${path}`);
    if(!hasOwn(node,part)){
      if(!create)throw new Error(`Chemin introuvable: ${path}`);
      node[part]={};
    }
    node=node[part];
  }
  return {parent:node,key};
}
function arrayIndex(key,length,{allowEnd=false}={}){
  if(key==='-'&&allowEnd)return length;
  const index=Number(key);
  if(!Number.isInteger(index)||index<0||index>(allowEnd?length:length-1))throw new Error(`Index de tableau invalide: ${key}`);
  return index;
}
export function applyOperation(target,operation){
  const {op,path}=operation||{};
  if(!['add','replace','remove'].includes(op))throw new Error(`Opération inconnue: ${op}`);
  const {parent,key}=resolveParent(target,path,{create:op==='add'});
  if(Array.isArray(parent)){
    if(op==='add'){
      const index=arrayIndex(key,parent.length,{allowEnd:true});
      parent.splice(index,0,deepClone(operation.value));
    }else{
      const index=arrayIndex(key,parent.length);
      if(op==='replace')parent[index]=deepClone(operation.value);
      else parent.splice(index,1);
    }
    return target;
  }
  if(parent==null||typeof parent!=='object')throw new Error(`Parent non objet pour ${path}`);
  if(op==='remove'){
    if(!hasOwn(parent,key))throw new Error(`Chemin introuvable: ${path}`);
    delete parent[key];
  }else if(op==='replace'){
    if(!hasOwn(parent,key))throw new Error(`Chemin introuvable: ${path}`);
    parent[key]=deepClone(operation.value);
  }else{
    parent[key]=deepClone(operation.value);
  }
  return target;
}
export function applyOperations(article,operations=[]){
  const copy=deepClone(article);
  for(const operation of operations)applyOperation(copy,operation);
  return copy;
}

function canonicalize(value){
  if(Array.isArray(value))return value.map(canonicalize);
  if(value&&typeof value==='object'){
    const out={};
    for(const key of Object.keys(value).sort()){
      if(key==='dataset')continue;
      out[key]=canonicalize(value[key]);
    }
    return out;
  }
  return value;
}
export function stableStringify(value){
  return JSON.stringify(canonicalize(value));
}
export async function articleHash(article){
  const data=new TextEncoder().encode(stableStringify(article));
  const digest=await globalThis.crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

export async function applyOverrideEntries(article,entries=[]){
  const baseHash=await articleHash(article);
  let effective=deepClone(article);
  const applied=[];
  const conflicts=[];
  for(const entry of entries.filter(item=>item?.articleId===article.id)){
    if(entry.baseHash!==baseHash){
      conflicts.push({entry,expected:baseHash,received:entry.baseHash});
      continue;
    }
    effective=applyOperations(effective,entry.operations||[]);
    applied.push(entry);
  }
  return {article:effective,baseHash,applied,conflicts};
}

function equal(a,b){return stableStringify(a)===stableStringify(b);}
function opForPath(base,path,value){
  const parts=pointerParts(path);
  let node=base;
  let exists=true;
  for(const part of parts){
    if(node==null||typeof node!=='object'||!hasOwn(node,part)){exists=false;break;}
    node=node[part];
  }
  if(value===undefined)return exists?{op:'remove',path}:null;
  if(exists&&equal(node,value))return null;
  return {op:exists?'replace':'add',path,value:deepClone(value)};
}
export function buildArticleOperations(base,edited){
  const operations=[];
  for(const [path,value] of [
    ['/title',edited.title],
    ['/source',edited.source],
    ['/status',edited.status],
    ['/tags',edited.tags||[]],
    ['/sections',edited.sections||[]],
  ]){
    const op=opForPath(base,path,value);
    if(op)operations.push(op);
  }
  if(base.pnj||edited.pnj){
    const portrait=edited.pnj?.portrait;
    const op=opForPath(base,'/pnj/portrait',portrait||undefined);
    if(op)operations.push(op);
  }else{
    const media=edited.image??edited.illustration;
    const currentPath=hasOwn(base,'image')?'/image':hasOwn(base,'illustration')?'/illustration':'/image';
    const op=opForPath(base,currentPath,media||undefined);
    if(op)operations.push(op);
  }
  return operations;
}
