const {readFileSync}=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const {webcrypto}=require('node:crypto');
const events=new Map();let seq=0;
function make(){
 let applied={},storage=new Map();
 const client={
  auth:{onAuthStateChange(){},getSession:async()=>({data:{session:null}})},
  from(table){return {
   upsert:async(batch)=>{for(const r of batch)if(!events.has(r.op_id))events.set(r.op_id,{...structuredClone(r),seq:++seq});return {}},
   select(){let uid;return {
    eq(k,id){uid=id;return this},order(){return this},
    range:async(start,end)=>{const latest={};[...events.values()].filter(x=>x.user_id===uid).forEach(x=>latest[x.entity_key]=x);return {data:Object.values(latest).sort((a,b)=>a.entity_key.localeCompare(b.entity_key)).slice(start,end+1)}}
   }
  }}}
 };
 const context=vm.createContext({console,structuredClone,crypto:webcrypto,navigator:{onLine:true},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},window:{Kitchen:{toast(){},apply:r=>applied=structuredClone(r),snapshot:()=>({recipes:[]}),clearAccount(){}},addEventListener(){}},document:{querySelectorAll:()=>[],querySelector:()=>null,createElement:()=>({}),body:{append(){}},addEventListener(){},visibilityState:'visible'},createClient:()=>client,Capacitor:{isNativePlatform:()=>false},registerPlugin:()=>null,setTimeout:()=>0,clearTimeout(){},setInterval(){},Date,JSON,Map,Set});
 let src=readFileSync(__dirname+'/../cloud-entry.js','utf8').replace(/^import .*;\n/gm,'');vm.runInContext(src,context);return {ctx:context,run:s=>vm.runInContext(s,context),storage,get applied(){return applied}};}
(async()=>{let a=make(),b=make();await Promise.resolve();await a.run("setSession({user:{id:'owner'}})");await b.run("setSession({user:{id:'owner'}})");
 a.run("navigator.onLine=false;record('recipe/one',{title:'offline'});record('menu/2026-10-30/one',{id:'one'});record('draft/one',{id:'one',title:'draft'});record('check/2026-10-30/one/0',{checked:true})");await a.run('sync()');assert.equal(events.size,0);assert.equal(a.run('state.pending.length'),4);
 a.run('navigator.onLine=true');await a.run('sync()');await b.run('sync()');assert.equal(b.applied['recipe/one'].payload.title,'offline');assert.equal(b.applied['check/2026-10-30/one/0'].payload.checked,true);
 a.run("record('recipe/one',{title:'device A'})");b.run("record('recipe/one',{title:'device B'})");await a.run('sync()');await b.run('sync()');await a.run('sync()');assert.equal(a.applied['recipe/one'].payload.title,'device B');assert.equal([...events.values()].filter(x=>x.entity_key==='recipe/one').length,3);
 const before=events.size;await a.run('sync()');assert.equal(events.size,before);
 a.run("record('recipe/one',{},true)");await a.run('sync()');await b.run('sync()');assert.equal(b.applied['recipe/one'].deleted,true);
 let c=make();await Promise.resolve();await c.run("setSession({user:{id:'different-user'}})");assert.equal(Object.keys(c.applied).length,0);
 console.log('PASS: offline queue, cross-client recipe/menu/draft/check sync, conflict history, idempotent resync, deletion, account separation');})().catch(e=>{console.error(e);process.exitCode=1});
