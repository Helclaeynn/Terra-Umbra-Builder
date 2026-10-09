/** An announced hostile release pauses automatic rounds; preparation and narrative magic do not. */
import {occultPowerIds} from './occult-resolution.js';
export async function pendingOccultResolution(db:{query:(...args:any[])=>Promise<any>},campaign:string){
 const r=await db.query(`WITH eligible AS (
  SELECT e.id,e.payload,e.request_payload FROM character_play_events e JOIN characters c ON c.id=e.character_id
  WHERE e.campaign_id=$1 AND c.campaign_id=$1 AND c.archived_at IS NULL
   AND EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=$1 AND m.character_id=c.id AND m.user_id=c.owner_id AND m.status='accepted')
   AND e.kind IN ('nature-mage-release','nature-daemon-spectrum-release','nature-power-release','power')
   AND COALESCE((e.payload->>'narrativeFailure')::boolean,false)=false AND e.payload->>'success' IS DISTINCT FROM 'false'
   AND COALESCE((e.payload->'spell'->>'forced')::boolean,false)=false AND e.request_payload->>'enabled' IS DISTINCT FROM 'false'
   AND e.live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$1)
   AND NOT EXISTS(SELECT 1 FROM campaign_live_events b WHERE b.campaign_id=$1 AND b.kind IN ('combat-scene','combat-scenario','combat-stop') AND b.created_at>e.created_at)
   AND NOT EXISTS(SELECT 1 FROM campaign_live_events d WHERE d.campaign_id=$1 AND d.kind IN ('occult-resolve','occult-cancel') AND d.payload->>'sourceEventId'=e.id::text)
 ) SELECT id FROM eligible WHERE payload->'spell'->>'intent'='hostile' OR COALESCE(payload->>'powerId',request_payload->>'powerId')=ANY($2::text[])
 UNION ALL SELECT source.id FROM eligible source JOIN campaign_live_events offer ON offer.campaign_id=$1 AND offer.kind='occult-defense-offer' AND offer.payload->>'sourceEventId'=source.id::text
 LIMIT 1`,[campaign,Object.values(occultPowerIds)]);
 return !!r.rowCount;
}
