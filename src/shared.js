'use strict';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
// Forgive sloppy JSON: anything outside the outer { } (code fences, prose), trailing commas, HTML, markdown, wrong types.
const txt=v=>v==null||v===false?'':Array.isArray(v)?v.map(txt).filter(Boolean).join('\n'):typeof v==='object'?txt(v.label??v.text??v.name??v.title):String(v).replace(/<\/?[a-z][^>]*>/gi,'').replace(/\*\*|__|`/g,'').trim();
const list=v=>Array.isArray(v)?v.filter(x=>x!=null&&x!==''):v==null||v===''||v===false?[]:typeof v==='object'?Object.values(v):String(v).split(/\s*[;\n]\s*|,\s+/).filter(Boolean);
const item=v=>{
  if(v==null||typeof v!=='object'||Array.isArray(v))return{label:txt(v),detail:''};
  const detail=txt(v.detail??v.details??v.description??v.desc??v.note);
  return{...v,label:txt(v.label??v.name??v.title??v.text??v.id)||detail.slice(0,40),detail};
};
const pick=(v,map,dflt)=>map[txt(v).toLowerCase()]??dflt;
const yes=v=>v===true||/^(true|yes|y|1)$/i.test(txt(v));

let onShow=()=>{},onHide=()=>{},keepOpen=()=>false;
const main=el('main'),header=el('header'),footer=el('footer');
// One popover for boxes and arrows: hover or focus shows, click or Enter pins, Esc or × closes.
const pop=el('aside','detail'),popTitle=el('h2'),popBody=el('p'),closer=el('button','close','×');
pop.id='detail';pop.hidden=true;closer.type='button';closer.setAttribute('aria-label','Close');pop.append(popTitle,popBody,closer);
let active=null,pinned=false,timer,quiet=false;
// Put a position:fixed element in the emptiest spot near target: least overlap with obstacles, then nearest. Reusable for any floating label.
function nestle(el,target,opts={}){
  const {gap=8,margin=12,pull=10,stick=2000,obstacles='.box,.arrow,.wire-label,table,h1,[data-obstacle]'}=opts;
  const t=target.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight,last=el._nestle||{};
  const fit=(v,size,max)=>Math.max(margin,Math.min(v,max-size-margin));
  const cover=(x,y,r)=>Math.max(0,Math.min(x+w,r.right)-Math.max(x,r.left))*Math.max(0,Math.min(y+h,r.bottom)-Math.max(y,r.top));
  const rects=[...document.querySelectorAll(obstacles)].filter(o=>!o.contains(target)&&!target.contains(o)&&!el.contains(o)).map(o=>o.getBoundingClientRect());
  // Candidates per axis: beside the target, aligned with it, centred on it, or against a viewport edge. Order breaks ties: below, right, left, above.
  const xs=[t.left,t.right+gap,t.left-w-gap,t.right-w,t.left+(t.width-w)/2,0,innerWidth].map(v=>fit(v,w,innerWidth));
  const ys=[t.bottom+gap,t.top,t.top-h-gap,t.bottom-h,t.top+(t.height-h)/2,0,innerHeight].map(v=>fit(v,h,innerHeight));
  let best,low=Infinity;
  ys.forEach((y,j)=>xs.forEach((x,i)=>{
    const k=j*7+i,away=Math.hypot(Math.max(t.left-x-w,x-t.right,0),Math.max(t.top-y-h,y-t.bottom,0));
    const score=rects.reduce((s,r)=>s+cover(x,y,r),4*cover(x,y,t))+pull*away-(last.target===target&&last.k===k?stick:0); // stick: no side-hopping on scroll
    if(score<low){low=score;best={x,y,k}}
  }));
  el._nestle={target,k:best.k};
  el.style.left=best.x+'px';el.style.top=best.y+'px';
}
function place(){
  if(!active)return;
  if(innerWidth>=600)return nestle(pop,active);
  const r=active.getBoundingClientRect(),h=pop.offsetHeight; // phone: dock away from the target
  pop.style.left='12px';pop.style.top=(r.bottom>innerHeight-h-24?12:innerHeight-h-12)+'px';
}
function release(btn){btn.setAttribute('aria-expanded','false');btn.removeAttribute('aria-describedby')}
function hide(refocus){
  clearTimeout(timer);
  const old=active;
  if(!old)return;
  release(old);active=null;pinned=false;pop.hidden=true;onHide();
  if(refocus){quiet=true;old.focus();quiet=false}
}
function show(btn,it,pin){
  if(quiet||(pinned&&!pin))return;
  clearTimeout(timer);
  if(active)release(active);
  active=btn;pinned=pin;
  btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-describedby','detail');
  popTitle.textContent=it.label;popBody.textContent=it.detail;popBody.hidden=!it.detail;
  pop.classList.toggle('pinned',pin);pop.hidden=false;place();onShow(btn);
  if(btn.id){btn.classList.add('seen');seen();if(pin)history.replaceState(null,'','#'+btn.id)} // read marks; pinned item becomes a link
}
function later(){clearTimeout(timer);timer=setTimeout(()=>{if(!pinned&&!keepOpen())hide()},200)}
const tips=[],progress=el('p','hint progress');
const seen=()=>{const n=tips.filter(t=>t.btn.classList.contains('seen')).length;progress.textContent=n+' of '+tips.length+' read'};
function tip(btn,it){
  if(!btn.classList.contains('wire-label')){tips.push({btn,it});btn.id='item-'+tips.length}
  btn.type='button';btn.setAttribute('aria-expanded','false');btn.dataset.tip='';
  if(it.detail)btn.append(el('span','note',it.detail));
  btn.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(btn,it,false)});
  btn.addEventListener('pointerleave',later);
  btn.addEventListener('focus',()=>show(btn,it,false));
  btn.addEventListener('blur',later);
  btn.addEventListener('click',()=>active===btn&&pinned?hide():show(btn,it,true));
  return btn;
}
const role=(n,r)=>{if(r)n.dataset.role=r;return n};
function box(it,tag,r,cls){
  const b=role(el('button','box'+(cls?' '+cls:'')),r);
  if(tag)b.append(el('span','tag',tag));
  b.append(el('span','label',it.label));
  return tip(b,it);
}
const arrow=(it,r)=>tip(role(el('button','arrow',it.label),r),it);
const legend=rows=>{const l=el('p','legend');rows.forEach(([r,glyph,text])=>{const s=role(el('span'),r);s.append(el('span','glyph',glyph),' '+text);l.append(s)});return l};
const callout=(tag,text,r)=>{const c=role(el('p','callout'),r||'green');c.append(el('span','tag',tag),text);return c};
closer.addEventListener('click',()=>hide(true));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')return hide(true);
  // Arrow keys step through the boxes and arrows in reading order.
  const step={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key],here=document.activeElement;
  if(!step||!here?.matches('[data-tip]:not(.wire-label)'))return;
  const all=[...main.querySelectorAll('[data-tip]:not(.wire-label)')].filter(n=>n.offsetParent),next=all[all.indexOf(here)+step];
  if(next){e.preventDefault();next.focus()}
});
document.addEventListener('pointerdown',e=>{if(!e.target.closest?.('.detail,[aria-expanded]'))hide()});
addEventListener('resize',place);addEventListener('scroll',place,{passive:true});

function fallback(text,done){const t=el('textarea');t.value=text;document.body.append(t);t.select();document.execCommand('copy');t.remove();done()}
function card(title,lines,snippet,r){
  const c=role(el('section','card'),r||'clay');
  c.append(el('h1','',title));lines.forEach(l=>c.append(el('p','',l)));
  if(snippet)c.append(el('pre','',snippet));
  document.title=title;document.body.replaceChildren(c);
}
function parse(src){
  const a=src.indexOf('{'),b=src.lastIndexOf('}');
  const s=a<0||b<a?src.trim():src.slice(a,b+1).replace(/,(\s*[}\]])/g,'$1');
  try{return JSON.parse(s)}catch(e){
    const m=/position (\d+)/.exec(e.message),at=m?+m[1]:-1;
    e.snippet=at<0?s.slice(0,240):s.slice(Math.max(0,at-80),at)+' ⟵ HERE ⟶ '+s.slice(at,at+60);
    throw e;
  }
}
// key: the list that must have items; render(data) adds the template's sections to main.
function boot(key,render){
  let data;
  try{data=parse(document.getElementById('diagram-data').textContent)}
  catch(e){return card('This diagram could not load',['The JSON block in this file is broken. Fix the JSON block; change nothing else.','Problem: '+e.message],e.snippet)}
  if(Array.isArray(data))data={[key]:data};
  if(!data||typeof data!=='object')data={};
  const title=txt(data.title)||'Untitled';
  if(title==='REPLACE_ME')return card('No diagram yet',['Replace {"title":"REPLACE_ME"} in this file with your JSON, in the format SKILL.md shows. Change nothing else.'],'',  'amber');
  if(!list(data[key]).length)return card(title,['This diagram is empty. Add items to "'+key+'" in the JSON block, as SKILL.md shows.'],'','amber');
  try{
    document.title=title;
    const bar=el('div','bar'),h1=el('h1',title.length>40?'long':'',title),all=el('button','toggle','Show all details');
    all.type='button';all.setAttribute('aria-pressed','false');
    all.addEventListener('click',()=>all.setAttribute('aria-pressed',document.body.classList.toggle('all')));
    const copy=el('button','toggle','Copy as Markdown');copy.type='button';
    copy.addEventListener('click',()=>{
      const md='# '+title+'\n\n'+tips.map(({it},i)=>(i+1)+'. **'+it.label+'**'+(it.detail?' — '+it.detail.replace(/\n+/g,' '):'')).join('\n')+'\n';
      const done=()=>{copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy as Markdown',1500)};
      navigator.clipboard?.writeText(md).then(done,()=>fallback(md,done))??fallback(md,done);
    });
    const tools=el('div','tools');tools.append(progress,all,copy);
    bar.append(el('p','eyebrow',txt(data.eyebrow)),el('p','hint','Hover or tab to inspect · tap to pin'),tools);
    header.append(bar,h1);
    if(txt(data.caption))header.append(el('p','caption',txt(data.caption)));
    if(txt(data.footnote))footer.append(el('span','',txt(data.footnote)));
    list(data.sources).map(item).forEach(s=>{const url=txt(s.url??s.href??s.link);if(/^https:\/\//.test(url)){const a=el('a','',s.label||url);a.href=url;footer.append(a)}});
    main.append(header);render(data);main.append(footer);
    document.body.append(main,pop);
    main.querySelectorAll('.box,.arrow').forEach((n,i)=>n.style.setProperty('--i',Math.min(i,12))); // staggered entrance, ~0.8 s at most
    seen();
    const linked=location.hash?document.getElementById(location.hash.slice(1)):null; // deep link: open that item
    if(linked&&'tip' in linked.dataset)setTimeout(()=>{linked.scrollIntoView({block:'center'});linked.click()},700);
  }catch(e){card('This diagram could not be drawn',['Something in the JSON block has an unexpected shape. Fix the JSON block; change nothing else.','Problem: '+e.message])}
}
