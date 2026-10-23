(function(root){
const mins=s=>{if(!/^\d{2}:\d{2}$/.test(s||''))return null;let[h,m]=s.split(':').map(Number);return h<24&&m<60?h*60+m:null};
const time=n=>`${String(Math.floor(n/60)%24).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
function defaults(date){let w=new Date(date+'T12:00:00').getDay();let out=[];if(w===2||w===3)out.push({id:'meeting',title:'Research meeting · confirm time',start:'12:00',duration:60,type:'fixed',note:'Placeholder: edit to your actual meeting time.'});if(w>=1&&w<=3)out.push({id:'class',title:'Classes · confirm times',start:'13:30',duration:180,type:'fixed',note:'Placeholder: edit to match your class timetable.'});return out}
function makePlan(date,m={},fixed=[]){
let wake=mins(m.wake)??660;let end=mins(m.finish)??1380;let energy=Number(m.energy||3);let size=energy<=2?25:50;let w=new Date(date+'T12:00:00').getDay();let lock=w===4||w===5;let reasons=[];let unscheduled=[];let blocks=fixed.map(x=>({...x}));let priority=(m.must||'Agent swarm safety: resolve one protocol or environment question').trim();
if(date>'2026-10-31'&&!m.must)priority='Research: choose one question across your three projects';
let cursor=wake;function add(title,duration,type='rest',note='',earliest=null){let t=Math.max(cursor,earliest??cursor);let sorted=blocks.slice().sort((a,b)=>mins(a.start)-mins(b.start));for(let b of sorted){let bs=mins(b.start);if(t<bs+b.duration&&t+duration>bs)t=bs+b.duration;}if(t+duration>end){unscheduled.push(title);return;}blocks.push({id:'b-'+blocks.length+'-'+t,title,start:time(t),duration,type,note});cursor=t+duration;}
add('Get up, wash, daylight + first meal',40,'rest','Leave your phone away from bed while you get ready.');
add('Arrive somewhere fresh + write to warm up',10,'rest',m.place||'Write your question, what you think so far, and what you want to finish.');
add(priority,size,'focus',m.fear?'Start with the part you can answer in this session.':'Work through one question and save your notes or result.');
add('Walk + water + look away',15);
if(lock&&energy>=3)add('Continue the same research question',size,'focus','Continue where you left off. Write down what you found or where you got stuck.');
add('Meal + real break',40);
add('Other research responsibility / coursework',size,'focus','Pick the next task for project 2 or 3 before opening its tabs.');
add('X research window + capture',20,'rest','Open with a question. Save to Read / Ideas / Opportunities. Close when the window ends.');
add('Draw, walk, or sit without a feed',20,'rest','Take a break without opening a feed.');
add('Project check-in / meetings follow-up',30,'work','Existing commitments first. New opportunities can wait until tomorrow.');
add('Dinner + friends',60,'rest','Eat dinner and catch up with friends.',1080);
add('Fun side project / drawing',40,'rest','Work on something you enjoy.');
let night=Math.min(end,1410);let occupied=blocks.some(b=>mins(b.start)<night+10&&mins(b.start)+b.duration>night);if(!occupied)blocks.push({id:'night',start:time(night),duration:10,title:'Night journal + close the day',type:'rest',note:'3 wins · 2 lessons · 1 intention. Then wind down.'});else unscheduled.push('Night journal + close the day');
reasons.push(m.must?'Your “must do” gets the first available focus block.':'Default priority: swarm safety before the October grant deadline; research afterward.');reasons.push(energy<=2?'Low energy: focus blocks are 25 minutes.':lock?'Thursday/Friday: an extra block stays on the same research question.':'Class/meeting day or weekend: a lighter focus load.');reasons.push('Fixed commitments are preserved. Flexible blocks fit into the remaining gaps.');if(m.fear)reasons.push('Your answer about fear is saved in the journal and does not change the plan.');return{blocks:blocks.sort((a,b)=>mins(a.start)-mins(b.start)),reasons,unscheduled};}
function conflicts(blocks){let sorted=blocks.slice().sort((a,b)=>mins(a.start)-mins(b.start));let out=[];sorted.forEach((b,i)=>{if(mins(b.start)===null||!Number.isFinite(b.duration)||b.duration<5||mins(b.start)+b.duration>1440)out.push('Invalid time or duration: '+b.title);for(let j=0;j<i;j++)if(mins(b.start)<mins(sorted[j].start)+sorted[j].duration)out.push(sorted[j].title+' overlaps '+b.title)});return out}
root.Planner={mins,time,defaults,makePlan,conflicts};if(typeof module!=='undefined')module.exports=root.Planner;
})(typeof window!=='undefined'?window:globalThis);
