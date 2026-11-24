const EFFECT={better:['green','▲','Better'],worse:['clay','▼','Worse'],same:['slate','=','Same'],removed:['clay','✕','Removed']};
const EFFECTS={better:'better',improved:'better',faster:'better',worse:'worse',slower:'worse',same:'same',unchanged:'same',removed:'removed',deleted:'removed',dropped:'removed',gone:'removed'};
const BEFORE='slate',AFTER='blue';
popOpts={pull:300}; // rows fill the page, so the detail stays beside its box and covers the next row instead
boot('themes',data=>{
  const themes=list(data.themes).map(item),same=list(data.unchanged).map(txt).filter(Boolean),sides=role(el('section','sides'),AFTER);
  const phases=list(data.phases).map(item),lanes=[],count=(a,word)=>a.length?a.length+' '+word+(a.length>1?'s':''):'';
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  header.append(el('p','caption',themes.length+' changed'+(same.length?' · '+same.length+' stayed the same':'')));
  // Wide screens: every Before on the left, every After on the right. Narrow: each theme stacks, and the boxes carry the tags.
  [['Before',BEFORE],['After',AFTER]].forEach(([name,r])=>{const p=role(el('p','side',name),r);p.dataset.obstacle='';sides.append(p)});
  const pair=(theme,t,mid,cls)=>{
    const before=t.before??t.old??t.from,after=t.after??t.new??t.to;
    if(before!=null)theme.append(box(item(before),'Before',BEFORE,'before'+cls));
    if(mid)theme.append(mid);
    if(after!=null)theme.append(box(item(after),'After',AFTER,'after'+cls));
  };
  themes.forEach((t,i)=>{
    const name=String(i+1).padStart(2,'0')+' · '+t.label,theme=el('section','theme'),h=el('h2','tag',name),e=EFFECT[pick(t.effect,EFFECTS,'')];
    const parts=list(t.parts).map(item),risks=list(t.risks).map(item),work=list(t.work??t.jobs).map(item),change=t.change??t.how;
    // Zoom in: a theme opens to show its parts and risks.
    if(parts.length||risks.length){
      const more=el('button','more',[count(parts,'part'),count(risks,'risk')].filter(Boolean).join(' · '));
      more.type='button';more.setAttribute('aria-expanded','false');
      more.addEventListener('click',()=>more.setAttribute('aria-expanded',theme.classList.toggle('open')));
      h.append(more);
    }
    if(e)h.append(role(el('span','chip',e[1]+' '+e[2]),e[0]));
    theme.append(h);
    pair(theme,t,change!=null&&arrow(item(change),AFTER),'');
    parts.forEach(p=>pair(theme,p,el('p','tag part name',p.label),' part'));
    if(risks.length){
      const r=el('div','risks part');r.append(el('span','tag','Risks'));
      risks.forEach(x=>r.append(tip(role(el('button','chip','▲ '+x.label),'clay'),x)));theme.append(r);
    }
    if(work.length)lanes.push({name,work});
    sides.append(theme);
  });
  main.append(sides);
  if(same.length){
    const s=el('section','same');s.append(el('h2','tag','Stayed the same'));
    same.forEach(x=>s.append(role(el('span','chip','= '+x),'slate')));main.append(s);
  }
  if(!lanes.length)return;

  // The plan: one row per theme, one column per phase. A job names what it needs; lines join them.
  const all=lanes.flatMap(l=>l.work),byId={};
  all.forEach(w=>{
    const k=slug(w.phase??w.when);
    w.id=slug(w.id||w.label);byId[w.id]=w;
    w.col=phases.findIndex(p=>slug(p.label)===k);
    if(w.col<0)w.col=+k>0&&+k<=phases.length?k-1:k||!phases.length?phases.push(item(k?w.phase??w.when:'Plan'))-1:0;
  });
  all.forEach(w=>{w.needs=list(w.needs??w.after).map(slug).filter(id=>byId[id]&&id!==w.id)});
  all.forEach(w=>{
    const names=ws=>ws.map(o=>o.label).join(', ');
    w.unlocks=all.filter(o=>o.needs.includes(w.id));
    w.detail=[w.detail,w.needs.length&&'Needs: '+names(w.needs.map(id=>byId[id])),w.unlocks.length&&'Unlocks: '+names(w.unlocks)].filter(Boolean).join('\n');
  });
  const plan=el('section','plan'),scroll=el('div','scroll'),grid=el('div','lanes'),NS='http://www.w3.org/2000/svg',wires=document.createElementNS(NS,'svg');
  grid.style.setProperty('--n',phases.length);grid.append(el('span'));
  phases.forEach(p=>{const b=el('button','phase');b.append(el('span','label',p.label),el('span','tag',txt(p.when)));grid.append(tip(b,p))});
  lanes.forEach(l=>{
    const cells=phases.map(()=>el('div','cell'));
    l.work.forEach(w=>{w.b=box(w,txt(w.owner??w.who??w.team),'','job');w.b.dataset.id=w.id;cells[w.col].append(w.b)});
    grid.append(el('h3','tag',l.name),...cells);
  });
  wires.setAttribute('class','wires');wires.setAttribute('aria-hidden','true');
  wires.innerHTML='<marker id="head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z"/></marker><marker id="hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z"/></marker><g/>';
  grid.append(wires);
  let current;
  function draw(){
    const o=grid.getBoundingClientRect(),on=byId[current];
    wires.lastChild.replaceChildren();
    grid.classList.toggle('dim',!!on); // a job is open: fade everything it doesn't touch
    all.forEach(w=>w.b.classList.toggle('on',!!on&&(w===on||on.needs.includes(w.id)||on.unlocks.includes(w))));
    all.forEach(w=>w.needs.forEach(id=>{
      const a=byId[id].b.getBoundingClientRect(),b=w.b.getBoundingClientRect(),hot=on&&(w===on||id===on.id);
      const ay=a.top+a.height/2-o.top,by=b.top+b.height/2-o.top,across=a.right<b.left||b.right<a.left;
      // Different phases: curve across the gap. Same phase: curve down the left side.
      const ax=(across&&a.right<b.left?a.right:a.left)-o.left,bx=(across&&b.right<a.left?b.right:b.left)-o.left,bend=across?(ax+bx)/2:Math.min(ax,bx)-12;
      const path=document.createElementNS(NS,'path');
      path.setAttribute('d','M'+ax+' '+ay+'C'+bend+' '+ay+' '+bend+' '+by+' '+bx+' '+by);
      path.setAttribute('marker-end',hot?'url(#hot)':'url(#head)');if(hot)path.setAttribute('class','hot');
      wires.lastChild[hot?'append':'prepend'](path);
    }));
  }
  onShow=btn=>{current=btn.dataset.id;draw()};
  onHide=()=>{current=null;draw()};
  new ResizeObserver(draw).observe(grid);
  scroll.append(grid);plan.append(el('h2','tag','The plan'),scroll);main.append(plan);
  tips[(/^#item-(\d+)$/.exec(location.hash)?.[1]||0)-1]?.btn.closest('.theme:not(.open)')?.querySelector('.more')?.click(); // a linked part opens its theme
});
