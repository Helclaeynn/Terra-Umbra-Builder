import type {FastifyInstance} from 'fastify';
import {requireAdmin} from './auth.js';
import {NPC_CATALOG,generateNpcBatch} from './campaign-npc-generator.js';
import {validNpcData} from './campaign-npc-model.js';
import {npcPortrait} from './campaign-npcs.js';
import {canonicalNpcDraft} from './canonical-npc-draft.js';
export async function registerCanonicalNpcGenerator(app:FastifyInstance){
 const base='/api/compendium/editor/npc-generator';
 app.addHook('onSend',async(req,reply,payload)=>{if(req.url.startsWith(base)){reply.header('Cache-Control','no-store, private');reply.header('Pragma','no-cache');}return payload;});
 app.get(base+'/catalog',async(req,reply)=>{if(!await requireAdmin(req,reply))return;return NPC_CATALOG;});
 app.post(base+'/generate',async(req,reply)=>{if(!await requireAdmin(req,reply))return;const npcs=generateNpcBatch(req.body);if(!npcs||npcs.length!==1)return reply.code(400).send({error:'invalid_npc_generator'});return {npcs};});
 // Pure preview: only the existing wiki draft/publication endpoints persist pages.
 app.post<{Body:{npc?:unknown}}>(base+'/preview',async(req,reply)=>{if(!await requireAdmin(req,reply))return;const n=req.body?.npc;if(!validNpcData(n,NPC_CATALOG)||(n.portrait&&!npcPortrait(n.portrait)))return reply.code(400).send({error:'invalid_npc'});return {article:canonicalNpcDraft(n)};});
}
