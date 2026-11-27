const DAY=86400000,ROLES=['green','blue','plum','amber','clay','slate'];
function day(v){
  const s=txt(v),m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if(!m)return null;
  const n=Date.parse(s+'T00:00:00Z');
  return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===s?n/DAY:null;
}
const date=n=>new Date(n*DAY).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
function render(data){
  if(txt(data.summary))header.append(el('p','g-summary',txt(data.summary)));
  const tasks=list(data.tasks).map(item),kinds=list(data.kinds??data.types).map(item);
  tasks.forEach((t,i)=>{
    t.label||= 'Task '+(i+1);t.a=day(t.start??t.from??t.begin);t.b=day(t.end??t.finish??t.to??t.date);
    t.gate=yes(t.gate??t.milestone);t.point=t.a===null&&t.b!==null;
    t.warning=[];
    if(t.a===null&&t.b===null)t.warning.push('Dates missing or invalid; not placed on the axis.');
    else if(t.b===null){t.b=t.a;t.warning.push('End missing or invalid; shown on the start date.');}
    if(t.a!==null&&t.b<t.a){[t.a,t.b]=[t.b,t.a];t.warning.push('Dates reversed; shown in date order.');}
    const name=txt(t.kind??t.type??t.category)||'Work';
    t.k=kinds.findIndex(k=>slug(k.label)===slug(name));
    if(t.k<0)t.k=kinds.push(item(name))-1;
    t.needs=list(t.needs??t.after??t.dependsOn).map(txt);
  });
  const legendBox=el('div','g-legend');
  kinds.forEach((k,i)=>{const b=role(tip(el('button','g-key',String(i+1).padStart(2,'0')+' / '+k.label),k),ROLES[i%6]);legendBox.append(b)});
  legendBox.append(el('span','caption','◇ Gate · underline = complete'));
  main.append(legendBox);
  const valid=tasks.filter(t=>t.b!==null),today=day(data.today);
  const dates=valid.flatMap(t=>[t.a??t.b,t.b]);if(today!==null)dates.push(today);
  const lo=dates.length?Math.min(...dates):0,hi=dates.length?Math.max(...dates):lo+14,span=hi-lo+1;
  const scale=span<=45?'day':span<=210?'week':'month';
  // Fold only unoccupied time; an ongoing task always keeps its full calendar width.
  const intervals=valid.map(t=>[t.a??t.b,t.b+1]).sort((a,b)=>a[0]-b[0]),merged=[];
  intervals.forEach(r=>{const p=merged.at(-1);if(p&&r[0]<=p[1])p[1]=Math.max(p[1],r[1]);else merged.push([...r])});
  const breaks=[];
  merged.forEach((r,i)=>{const p=merged[i-1];if(p&&r[0]-p[1]>14)breaks.push({a:p[1]+2,b:r[0]-2})});
  const weight=Math.max(1,span-breaks.reduce((s,g)=>s+g.b-g.a-4,0));
  const pos=n=>{let x=n-lo;breaks.forEach(g=>{x-=Math.max(0,Math.min(n,g.b)-g.a)*(1-4/(g.b-g.a))});return 4+92*x/weight};
  const scroll=el('div','g-scroll');scroll.tabIndex=0;scroll.setAttribute('aria-label','Project timeline; scroll horizontally');
  const board=el('section','g-board'),axis=el('div','g-axis'),corner=el('div','g-name g-corner',scale+'s / '+date(lo)+' – '+date(hi));
  board.append(corner,axis);
  const backdrop=el('div','g-backdrop');board.append(backdrop);
  const at=(node,x)=>{node.style.left=x+'%';return node};
  let last=-100;
  for(let n=lo;n<=hi;){
    const d=new Date(n*DAY),x=pos(n),inBreak=breaks.some(g=>n>=g.a&&n<g.b);
    const next=scale==='month'?Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)/DAY:n+(scale==='week'?7:1);
    if(inBreak){n=next;continue;}
    if(scale==='day'&&(d.getUTCDay()===0||d.getUTCDay()===6)){
      const w=at(el('span','g-weekend'),x);w.style.width=(pos(n+1)-x)+'%';backdrop.append(w);
    }
    const tick=true;
    if(tick&&x-last> (scale==='day'?3:8)){
      const label=scale==='month'?d.toLocaleDateString('en-GB',{month:'short',year:'2-digit',timeZone:'UTC'}):d.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});
      axis.append(at(el('span','g-tick',label),x));backdrop.append(at(el('span','g-gridline'),x));last=x;
    }
    n=next;
  }
  breaks.forEach(g=>{
    const fold=at(el('span','g-fold'),pos(g.a));fold.style.width=(pos(g.b)-pos(g.a))+'%';backdrop.append(fold);
    const label=at(el('span','g-break',Math.round(g.b-g.a)+' days omitted'),pos((g.a+g.b)/2));axis.append(label);
  });
  if(today!==null){const line=at(el('div','g-today'),pos(today));line.append(el('span','','Today · '+date(today)));backdrop.append(line)}
  const notes=el('section','g-details');notes.append(el('h2','tag','The work, in full'));
  tasks.forEach((t,i)=>{
    t.parents=tasks.filter(p=>p!==t&&t.needs.some(n=>slug(n)===slug(p.label)||slug(n)===slug(p.id)));
    t.children=tasks.filter(p=>p!==t&&p.needs.some(n=>slug(n)===slug(t.label)||slug(n)===slug(t.id)));
    const done=t.done??t.progress;t.progress=(done===true||txt(done).toLowerCase()==='true')?100:Math.max(0,Math.min(100,parseFloat(done)||0));
    const duration=t.b===null?'Unscheduled':t.point?'Milestone: '+date(t.b):date(t.a)+' to '+date(t.b)+' · '+(t.b-t.a+1)+' calendar days';
    t.full=[t.detail,duration,'Kind: '+kinds[t.k].label,txt(t.owner??t.who)&&'Owner: '+txt(t.owner??t.who),done!=null&&'Complete: '+t.progress+'%',t.needs.length&&'Needs: '+t.needs.join(', '),t.children.length&&'Unlocks: '+t.children.map(p=>p.label).join(', '),...t.warning].filter(Boolean).join('\n');
    const name=role(el('div','g-name'),ROLES[t.k%6]);name.append(el('span','g-number',String(i+1).padStart(2,'0')),el('span','g-task-name',t.label),el('span','g-row-kind',String(t.k+1).padStart(2,'0')));
    const lane=el('div','g-lane');t.lane=lane;
    const b=role(tip(el('button','g-bar'+(t.point?' g-point':'')+(t.b===null?' g-unscheduled':'')),{label:t.label,detail:t.full}),ROLES[t.k%6]);
    b.dataset.task=i;b.setAttribute('aria-label',t.label+'; '+duration);
    b.append(el('span','g-kind',String(t.k+1).padStart(2,'0')),el('span','g-label',t.label));
    if(t.b!==null){b.style.left=pos(t.a??t.b)+'%';b.style.width=t.point?'18px':Math.max(.6,pos(t.b+1)-pos(t.a))+'%';}
    b.style.setProperty('--done',t.progress+'%');
    if(t.gate||t.point)b.append(el('span','g-diamond'));
    t.button=b;lane.append(b);board.append(name,lane);
    const entry=el('article','g-entry');entry.append(el('h3','',t.label),el('p','',t.full));
    depth(entry,entry,t,t.label);notes.append(entry);
    if(list(t.risks).length){const risk=tip(role(el('button','g-risk','▲'), 'clay'),{label:t.label+' / risks',detail:list(t.risks).map(item).map(r=>r.label+(r.detail?': '+r.detail:'')).join('\n')});risk.setAttribute('aria-label',t.label+' risks');name.append(risk)}
  });
  const NS='http://www.w3.org/2000/svg',wires=document.createElementNS(NS,'svg');wires.setAttribute('class','g-wires');wires.setAttribute('aria-hidden','true');board.append(wires);
  let current=null;
  function draw(){
    const o=board.getBoundingClientRect();wires.replaceChildren();
    const selected=tasks[current],near=new Set(selected?[selected,...selected.parents,...selected.children]:[]);
    board.classList.toggle('g-dim',!!selected);
    tasks.forEach(t=>{
      t.button.classList.toggle('g-on',near.has(t));
      const label=t.button.querySelector('.g-label');t.button.classList.toggle('g-outside',t.point||label.scrollWidth+52>t.button.clientWidth);
      t.button.classList.toggle('g-label-left',t.b!==null&&pos(t.b)>68);
      t.parents.forEach(p=>{
        if(t.b===null||p.b===null)return;
        const a=p.button.getBoundingClientRect(),b=t.button.getBoundingClientRect(),ax=a.right-o.left,bx=b.left-o.left,ay=a.top+a.height/2-o.top,by=b.top+b.height/2-o.top;
        const bend=Math.max(ax+12,bx-12),path=document.createElementNS(NS,'path');
        path.setAttribute('d',`M${ax} ${ay}H${bend}V${by}H${bx}m4 -3 -4 3 4 3`);
        if(selected&&(t===selected||p===selected))path.setAttribute('class','g-hot');wires.append(path);
      });
    });
  }
  onShow=b=>{current=b.dataset.task??null;draw()};onHide=()=>{current=null;draw()};
  scroll.addEventListener('scroll',soon,{passive:true});
  new ResizeObserver(draw).observe(board);
  scroll.append(board);main.append(scroll,notes);
  main.append(el('p','caption g-foot',valid.length+' dated tasks · '+(hi-lo+1)+' calendar days'+(breaks.length?' · folded calendar':'')+' · ◇ milestone'));
}
boot('tasks',render);
