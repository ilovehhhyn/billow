import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker,{validatePlan,basePlan} from '../backend/worker.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const input={date:'2026-10-23',morning:{must:'Coffee while reading three papers, 418 slides, info theory homework, a little X, an afternoon run, website tonight and one hour of research job check-ins',wake:'11:00',finish:'23:00',energy:3},fixed:[{id:'meeting',title:'Lab meeting',start:'13:00',duration:30,type:'fixed'}]};
const tasks=[['papers','Coffee + read three papers',120,true,'work',2],['slides','Review course 418 slides',50,true,'work',3],['homework','Check info theory homework',25,true,'work',3],['x','X window',15,true,'routine',5],['run','Outdoor run',30,true,'routine',5],['website','Mindfulness website tonight',40,true,'work',5],['research','Research job check-ins',60,false,'work',1]].map(([id,title,duration,estimated,category,priority])=>({id,title,duration,estimated,preference:'',category,priority}));
function sample(data){
 const baseline=basePlan(data).blocks,slots=baseline.filter(b=>['focus','work'].includes(b.type));
 return {tasks,allocations:slots.slice(0,2).map((slot,i)=>({slotId:slot.id,taskId:'research',minutes:i===0?50:10,note:'Higher priority responsibility first.'})),routineMatches:[{taskId:'x',blockId:baseline.find(b=>b.title.includes('X research')).id}],reasons:['Research first; remaining tasks wait for available work time.']};
}
const plan=sample(input),good=validatePlan(plan,input),baseline=basePlan(input).blocks;
assert.equal(good.blocks.find(b=>b.id==='meeting').start,'13:00');
assert.equal(good.tasks.length,7);assert.equal(globalThis.Planner.conflicts(good.blocks).length,0);
assert.equal(good.blocks.length,baseline.length);
for(const b of baseline){const after=good.blocks.find(x=>x.id===b.id);assert.equal(after.start,b.start);assert.equal(after.duration,b.duration);assert.equal(after.type,b.type);if(['rest','fixed'].includes(b.type))assert.deepEqual(after,b);}
assert(good.unscheduled.some(s=>s.includes('120 min')));assert(good.unscheduled.some(s=>s.includes('Mindfulness website')));
assert.throws(()=>validatePlan({...plan,allocations:[{slotId:baseline.find(b=>b.type==='rest').id,taskId:'research',minutes:10,note:''}]},input),/Invalid work/);
assert.throws(()=>validatePlan({...plan,allocations:[{slotId:'invented-slot',taskId:'research',minutes:10,note:''}]},input),/Invalid work/);
assert.throws(()=>validatePlan({...plan,allocations:[{slotId:baseline.find(b=>b.type==='focus').id,taskId:'papers',minutes:100,note:''}]},input),/exceeds/);
for(const energy of [1,3])for(const date of ['2026-10-23','2026-10-26']){
 const data={...input,date,morning:{...input.morning,energy},fixed:globalThis.Planner.defaults(date)};
 const base=basePlan(data).blocks,slot=base.find(b=>b.type==='focus');
 const output=validatePlan({tasks,allocations:[{slotId:slot.id,taskId:'papers',minutes:Math.min(25,slot.duration),note:''}],routineMatches:[],reasons:[]},data);
 for(const b of base){const updated=output.blocks.find(x=>x.id===b.id);assert.equal(updated.start,b.start);assert.equal(updated.duration,b.duration);if(['rest','fixed'].includes(b.type))assert.deepEqual(updated,b);}
}
const req=(data,token='x'.repeat(40),origin='https://ilovehhhyn.github.io')=>new Request('https://worker.invalid/plan',{method:'POST',headers:{Origin:origin,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(data)});
const env={OPENAI_API_KEY:'test-only-not-a-key',PLANNER_ACCESS_TOKEN:'x'.repeat(40),PLANNER_LIMIT:{limit:async()=>({success:true})}};
assert.equal((await worker.fetch(req(input,'wrong'),env)).status,401);
assert.equal((await worker.fetch(req(input,undefined,'https://evil.invalid'),env)).status,403);
assert.equal((await worker.fetch(req(input),{})).status,503);
assert.equal((await worker.fetch(req({...input,morning:{...input.morning,must:'x'.repeat(8001)}}),env)).status,400);
assert.equal((await worker.fetch(req(input),{...env,PLANNER_LIMIT:{limit:async()=>({success:false})}})).status,429);
const original=globalThis.fetch;let sent;
globalThis.fetch=async(url,options)=>{sent=JSON.parse(options.body);return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(sample(input))}]}]})};
const result=await worker.fetch(req({...input,morning:{...input.morning,fear:'PRIVATE FEAR',excited:'PRIVATE EXCITEMENT'}}),env);
assert.equal(result.status,200);
assert.equal(sent.store,false);assert.equal(sent.text.format.strict,true);
assert(!JSON.stringify(sent).includes('PRIVATE FEAR'));assert(!JSON.stringify(sent).includes('PRIVATE EXCITEMENT'));
globalThis.fetch=async()=>Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{}'}]}]});
assert.equal((await worker.fetch(req(input),env)).status,502);
globalThis.fetch=original;
console.log('AI boundary checks passed: protected daily routine, partial work overflow, fixed slots, slot capacity, authentication, origin, rate limit, privacy, schema, invalid output. Provider calls were mocked; no live model was called.');
const {createRequire}=await import('node:module');const require=createRequire(import.meta.url);const {JSDOM}=require('jsdom');const fs=require('node:fs');
const dom=new JSDOM(fs.readFileSync('dist/index.html','utf8'),{url:'https://ilovehhhyn.github.io/billow/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.structuredClone=structuredClone;w.AbortSignal=AbortSignal;w.scrollTo=()=>{};w.matchMedia=()=>({matches:true});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};w.SiteMotion={refresh(){},pulse(){},pause(){},resume(){}};
for(const f of ['planner.js','flow-tips.js','calendar-model.js','calendar-ui.js','voice.js','ai-planner.js','app.js'])w.eval(fs.readFileSync('dist/'+f,'utf8'));
const q=s=>w.document.querySelector(s),edit=(s,v)=>{q(s).value=v;q(s).dispatchEvent(new w.Event('input',{bubbles:true}))};
assert.throws(()=>w.AIPlanner.setConfig('https://evil.invalid','x'.repeat(40)));
assert.throws(()=>w.AIPlanner.setConfig('https://test.workers.dev','sk-'+ 'x'.repeat(40)));
w.AIPlanner.setConfig('https://test.workers.dev','x'.repeat(40));
edit('#taskText','Keep my own task');q('#taskForm').dispatchEvent(new w.Event('submit',{cancelable:true,bubbles:true}));
edit('[data-bind="morning.must"]',input.morning.must);edit('[data-bind="morning.fear"]','PRIVATE UI FEAR');
let captured;w.fetch=async(url,opts)=>{captured=JSON.parse(opts.body);return Response.json(validatePlan(sample({...input,fixed:captured.fixed}),{...input,fixed:captured.fixed}))};
q('#generatePlan').click();assert(q('#aiProgress'));await new Promise(r=>setTimeout(r,20));assert(q('#acceptPlan'));assert(w.document.body.textContent.includes('Your to-do list'));assert(!JSON.stringify(captured).includes('PRIVATE UI FEAR'));q('#acceptPlan').click();
let saved=JSON.parse(w.localStorage.getItem('still-days-v1'));assert(Object.values(saved.days).some(d=>d.parsedTasks?.length===7));assert(!JSON.stringify(saved).includes('x'.repeat(40)));
let todayEntry=Object.values(saved.days).find(d=>d.parsedTasks?.length===7);
assert.equal(todayEntry.tasks.length,8);
assert(todayEntry.tasks.filter(t=>t.source==='ai').every(t=>t.duration>0));
assert.equal(todayEntry.tasks[1].text,'Research job check-ins');
assert(w.document.querySelector('.task-estimate').textContent.includes('60 min'));
q('[data-task="0"]').click();
const previousSchedule=JSON.stringify(Object.values(JSON.parse(w.localStorage.getItem('still-days-v1')).days).find(d=>d.parsedTasks?.length===7).schedule);
q('#generatePlan').click();await new Promise(r=>setTimeout(r,20));q('#acceptTasks').click();
saved=JSON.parse(w.localStorage.getItem('still-days-v1'));todayEntry=Object.values(saved.days).find(d=>d.parsedTasks?.length===7);
assert.equal(todayEntry.tasks.length,8);assert.equal(todayEntry.tasks[0].done,true);assert.equal(JSON.stringify(todayEntry.schedule),previousSchedule);

const before=w.localStorage.getItem('still-days-v1');w.fetch=async()=>Response.json({error:'Test provider error'},{status:502});q('#generatePlan').click();await new Promise(r=>setTimeout(r,20));assert.equal(q('#aiProgress').textContent,'Test provider error');assert(!q('#defaultAI').hidden);assert.equal(w.localStorage.getItem('still-days-v1'),before);q('#cancelAI').click();dom.window.close();
console.log('AI interface checks passed: settings reject provider keys, Shape my day calls the API, private journal fields excluded, review/accept populates checkable estimated tasks, repeated import preserves completion without duplicates, list-only leaves schedule intact, failures preserve the schedule, credentials excluded from backups.');
