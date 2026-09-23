export type CalendarEvent={id:string;campaignId:string;campaignName:string;title:string;playedOn:string;startsAt:string|null;endsAt:string|null;location:string;version:number};
export function validSchedule(b:{startsAt?:unknown;endsAt?:unknown;location?:unknown;playedOn?:unknown}){
 if(b.location!==undefined&&(typeof b.location!=='string'||b.location.length>1000))return false;
 if(b.startsAt===undefined&&b.endsAt===undefined)return true;
 if(b.startsAt===null&&b.endsAt===null)return true;
 const instant=(v:unknown):v is string=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().replace('.000Z','Z')===v.replace('.000Z','Z');
 return !!b.playedOn&&instant(b.startsAt)&&instant(b.endsAt)&&Date.parse(b.endsAt)>Date.parse(b.startsAt)&&Date.parse(b.endsAt)-Date.parse(b.startsAt)<=14*86400000;
}
const text=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function mailbox(s:string){const m=s.match(/<([^<>]+)>/)?.[1]||s;if(!/^[^\s<>:,;"\\]+@[^\s<>:,;"\\]+$/.test(m))throw new Error('invalid_calendar_address');return m;}
function fold(s:string){let out='',line='';for(const c of s){if(Buffer.byteLength(line+c,'utf8')>75){out+=line+'\r\n';line=' ';}line+=c;}return out+line;}
export function calendarMessage(event:CalendarEvent,recipient:string,organizer:string,baseUrl:string,now=new Date()){
 const url=`${baseUrl.replace(/\/$/,'')}/campaigns/${event.campaignId}`;
 const stamp=(v:string)=>new Date(v).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const date=event.playedOn.replace(/-/g,'');
 const next=new Date(event.playedOn+'T00:00:00Z');next.setUTCDate(next.getUTCDate()+1);
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Terra Umbra//Campagnes//FR','CALSCALE:GREGORIAN','METHOD:REQUEST','BEGIN:VEVENT',`UID:campaign-session-${event.id}@terra-umbra.fr`,`SEQUENCE:${event.version}`,`DTSTAMP:${stamp(now.toISOString())}`,
 ...(event.startsAt&&event.endsAt?[`DTSTART:${stamp(event.startsAt)}`,`DTEND:${stamp(event.endsAt)}`]:[`DTSTART;VALUE=DATE:${date}`,`DTEND;VALUE=DATE:${next.toISOString().slice(0,10).replace(/-/g,'')}`]),
 `SUMMARY:${text(event.campaignName+' · '+event.title)}`,`DESCRIPTION:${text('Séance de la campagne '+event.campaignName+'\nRetrouver la séance : '+url)}`,`LOCATION:${text(event.location)}`,`URL:${url}`,`ORGANIZER;CN=Terra Umbra:mailto:${mailbox(organizer)}`,`ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION:mailto:${mailbox(recipient)}`,'STATUS:CONFIRMED','TRANSP:OPAQUE','END:VEVENT','END:VCALENDAR'];
 return lines.map(fold).join('\r\n')+'\r\n';
}
