const DAY=864e5,ROLES=['green','blue','plum','amber','clay','slate'],MON='Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),WD='Sun Mon Tue Wed Thu Fri Sat'.split(' ');
const SCALES=[['day',45,5],['week',210,28],['month',Infinity,90]]; // tick, the most drawn days it suits, the shortest empty stretch it folds away
// Days since 1970, or null: 2026-11-23, 2026/11/23 and anything with a time after it.
const day=v=>{const m=/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/.exec(txt(v));if(!m)return null;const n=Date.UTC(m[1],m[2]-1,m[3]);return new Date(n).getUTCDate()==m[3]?n/DAY:null};
const utc=n=>new Date(n*DAY),year=n=>utc(n).getUTCFullYear(),fmt=(n,y)=>utc(n).getUTCDate()+' '+MON[utc(n).getUTCMonth()]+(y?' '+year(n):'');
const span=(d,[days,weeks,months])=>d<14?d+days+(d>1&&days.length>2?'s':''):d<70?Math.round(d/7)+weeks:Math.round(d/30.4)+months;
const SHORT=[' d',' wk',' mo'],LONG=[' day',' weeks',' months'];
popOpts={obstacles:'.g-bar,.g-name,h1,.tools,.callout,.legend'};
boot('tasks',data=>{
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  const kinds=list(data.kinds??data.types).map(item),named=kinds.length>0,ids={};
  const tasks=list(data.tasks).map(item).map((t,i)=>{
    let a=day(t.start??t.from??t.begin),b=day(t.end??t.finish??t.to??t.due??t.date);
    const days=parseInt(txt(t.days??t.duration)),point=a===null?b!==null:b===null&&!(days>0); // one date: a gate on that day
    if(a===null)a=b;else if(b===null)b=days>0?a+days-1:a;
    if(b<a)[a,b]=[b,a];
    const kind=txt(t.kind??t.type??t.category??t.group)||'Work',done=t.done??t.progress??t.complete;
    let k=kinds.findIndex(x=>slug(x.label)===slug(kind));
    if(k<0)k=kinds.push(item(kind))-1;
    return{...t,label:t.label||'Task '+(i+1),a,b,point,k,gate:point||yes(t.gate??t.milestone),owner:txt(t.owner??t.who??t.team),
      pct:yes(done)?100:Math.max(0,Math.min(100,parseFloat(txt(done))||0)),needs:list(t.needs??t.after??t.dependsOn??t.depends_on).map(slug),risks:list(t.risks).map(item)};
  });
  tasks.forEach(t=>{ids[slug(t.id||t.label)]??=t;ids[slug(t.label)]??=t});
  tasks.forEach(t=>{t.parents=[...new Set(t.needs.map(n=>ids[n]).filter(p=>p&&p!==t))]});
  tasks.forEach(t=>{t.children=tasks.filter(c=>c.parents.includes(t))});

  // Time: busy stretches are drawn to scale; long empty ones fold into a narrow band, so two bursts of work weeks apart share one screen.
  const today=day(data.today??data.now),busy=[];
  [...tasks.filter(t=>t.a!==null).map(t=>[t.a,t.b+1]),...(today===null?[]:[[today,today+1]])].sort((p,q)=>p[0]-q[0])
    .forEach(s=>{const p=busy.at(-1);p&&s[0]<=p[1]?p[1]=Math.max(p[1],s[1]):busy.push(s)});
  const lo=busy[0]?.[0]??0,hi=busy.at(-1)?.[1]??1;
  let scale,folds,shown;
  for(const [name,most,gap] of SCALES){
    scale=name;folds=busy.slice(1).map((s,i)=>({a:busy[i][1],b:s[0]})).filter(f=>f.b-f.a>=gap);
    shown=hi-lo-folds.reduce((s,f)=>s+f.b-f.a,0);
    if(shown<=most)break;
  }
  const fw=shown*.06,total=shown+fw*folds.length; // every fold is drawn 6% of the busy time wide
  const pos=n=>{let x=n-lo;folds.forEach(f=>{if(n>f.a)x-=(Math.min(n,f.b)-f.a)*(1-fw/(f.b-f.a))});return 1.5+97*x/total};
  const at=(n,x,w)=>{n.style.left=x+'%';if(w!=null)n.style.width=w+'%';return n};

  const scroll=el('div','g-scroll'),board=el('section','g-board'),axis=el('div','g-axis'),back=el('div','g-back');
  board.append(el('div','g-name g-corner',busy.length?fmt(lo,year(lo)!==year(hi-1))+' – '+fmt(hi-1,1):''),axis,back);
  let lastTick=-99,lastEra=-99,era;
  for(let n=lo;n<hi&&busy.length;n++){
    if(folds.some(f=>n>=f.a&&n<f.b))continue;
    const d=utc(n),dom=d.getUTCDate(),wd=d.getUTCDay(),x=pos(n),start=n===lo||folds.some(f=>f.b===n);
    if(scale==='day'&&(wd===0||wd===6))back.append(at(el('i','g-rest'),x,pos(n+1)-x));
    const name=scale==='month'?''+d.getUTCFullYear():MON[d.getUTCMonth()]+' '+d.getUTCFullYear(),turn=name!==era;
    if(turn){era=name;if(x-lastEra>5){axis.append(at(el('span','g-era',name),x));lastEra=x}}
    if(!(start||turn||(scale==='day'||(scale==='week'?wd===1:dom===1))))continue;
    back.append(at(el('i','g-grid'+(turn&&!start?' g-major':'')),x));
    const wide=scale==='day'&&shown<=14,label=scale==='month'?MON[d.getUTCMonth()]:wide?WD[wd]+' '+dom:''+dom;
    if(x-lastTick>=(wide?6.5:scale==='month'?4:3.2)&&(scale!=='day'||shown<=21||wd===1||start)){axis.append(at(el('span','g-tick',label),x));lastTick=x}
  }
  folds.forEach(f=>{const band=at(el('i','g-fold'),pos(f.a),pos(f.b)-pos(f.a));band.append(el('span','',span(f.b-f.a,LONG)));back.append(band)});
  if(today!==null){const line=at(el('i','g-today'+(pos(today)>88?' g-flip':'')),pos(today+.5));line.append(el('span','','Today'));back.append(line)}

  const full=el('ul','g-list');
  tasks.forEach((t,i)=>{
    const r=ROLES[t.k%6],row=el('div','g-row'),name=el('div','g-name'),lane=el('div','g-lane'),label=el('span','g-label');
    const when=t.a===null?'No dates yet':t.point?fmt(t.b,1):fmt(t.a,year(t.a)!==year(t.b))+' – '+fmt(t.b,1)+' · '+span(t.b-t.a+1,LONG);
    const names=ts=>ts.map(o=>o.label).join(', ');
    t.detail=[t.detail,when,t.owner&&'Owner: '+t.owner,t.pct>0&&t.pct<100&&t.pct+'% done',t.pct===100&&'Done',
      t.parents.length&&'Needs: '+names(t.parents),t.children.length&&'Unlocks: '+names(t.children)].filter(Boolean).join('\n');
    label.append(el('span','g-text',t.label));
    if(t.owner)label.append(el('span','g-who',t.owner));
    name.append(label);
    t.risks.forEach(x=>{const b=tip(role(el('button','g-risk','▲'),'clay'),x);b.setAttribute('aria-label','Risk: '+x.label);name.append(b)});
    const bar=role(el('button','g-bar'+(t.point?' g-point':'')+(t.a===null?' g-loose g-in':'')),r),x=t.a===null?0:pos(t.point?t.b+.5:t.a),w=t.a===null||t.point?0:Math.max(.4,pos(t.b+1)-x);
    bar.dataset.cue=t.k%6;bar.dataset.task=i;bar.style.setProperty('--i',Math.min(i,14));bar.style.setProperty('--done',t.pct+'%');
    if(t.a!==null){at(bar,x,t.point?null:w);if(x+w>80)bar.classList.add(w>14?'g-in':'g-flip')}
    bar.append(el('span','g-fill'));
    if(t.gate)bar.append(el('span','g-gate'));
    bar.append(el('span','g-cap',t.a===null?'No dates yet':t.gate?fmt(t.b):span(t.b-t.a+1,SHORT)));
    tip(bar,t).setAttribute('aria-label',t.label+', '+when);
    t.bar=bar;t.row=row;lane.append(bar);row.append(name,lane);board.append(row);
    const li=el('li');li.append(el('b','',t.label),'\n'+[t.detail,...t.risks.map(x=>'▲ '+x.label+(x.detail?': '+x.detail:''))].join('\n'));full.append(li);
  });

  // Thin lines from each task to what it unlocks. Open a bar: its lines light up and the rest of the chart steps back. Open a kind: only its bars stay.
  const NS='http://www.w3.org/2000/svg',wires=document.createElementNS(NS,'svg'),head=id=>`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker>`;
  wires.setAttribute('class','g-wires');wires.setAttribute('aria-hidden','true');wires.innerHTML=head('g-head')+head('g-hot')+'<g/>';
  board.append(wires);
  let current,kind;
  function draw(){
    const o=board.getBoundingClientRect(),on=tasks[current],near=new Set(on?[on,...on.parents,...on.children]:kind?tasks.filter(t=>t.k==kind-1):[]);
    wires.lastChild.replaceChildren();
    board.classList.toggle('g-dim',near.size>0);
    tasks.forEach(t=>{
      t.row.classList.toggle('g-on',near.has(t));
      t.parents.forEach(p=>{
        if(t.a===null||p.a===null)return;
        const a=p.bar.getBoundingClientRect(),b=t.bar.getBoundingClientRect(),hot=on&&(t===on||p===on);
        const ax=a.right-o.left+(p.gate&&!p.point?8:1),bx=b.left-o.left-2,ay=a.top+a.height/2-o.top,by=b.top+b.height/2-o.top,dx=Math.max(22,Math.abs(bx-ax)/2);
        const path=document.createElementNS(NS,'path');
        path.setAttribute('d',`M${ax} ${ay}C${ax+dx} ${ay} ${bx-dx} ${by} ${bx} ${by}`);
        path.setAttribute('marker-end',hot?'url(#g-hot)':'url(#g-head)');if(hot)path.setAttribute('class','g-hot');
        wires.lastChild[hot?'append':'prepend'](path);
      });
    });
  }
  onShow=b=>{current=b.dataset.task;kind=b.dataset.kind;draw()};
  onHide=()=>{current=kind=null;draw()};
  scroll.addEventListener('scroll',soon,{passive:true});
  new ResizeObserver(draw).observe(board);

  // Kinds: colour, plus a fill pattern so the chart still reads in greyscale.
  if(named||kinds.length>1||tasks.some(t=>t.gate)){
    const key=el('p','legend');
    if(named||kinds.length>1)kinds.forEach((k,i)=>{const b=role(el('button','g-key'),ROLES[i%6]);b.dataset.cue=i%6;b.dataset.kind=i+1;b.append(el('span','g-fill'),k.label);key.append(tip(b,{...k,detail:k.detail||tasks.filter(t=>t.k===i).map(t=>t.label).join('\n')}))});
    if(tasks.some(t=>t.gate))key.append(el('span','','◆ Gate'));
    if(tasks.some(t=>t.pct>0))key.append(el('span','g-done','Done so far'));
    main.append(key);
  }
  scroll.append(board);main.append(scroll,full);
});
