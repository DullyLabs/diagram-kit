// Lanes by what they do for this system; the old positional names still work.
const LANE={feeds:'feeds',from:'feeds',upstream:'feeds',source:'feeds',sources:'feeds',input:'feeds',inputs:'feeds',external:'feeds',
  system:'system',main:'system',ours:'system',part:'part',parts:'part',internal:'part',component:'part',inside:'part',
  serves:'serves',for:'serves',downstream:'serves',consumer:'serves',consumers:'serves',output:'serves',outputs:'serves',sink:'serves',
  runs:'runs',above:'runs',top:'runs',people:'runs',users:'runs',actors:'runs',checks:'checks',below:'checks',bottom:'checks',watchers:'checks',observers:'checks'};
const LANE_ROLE={feeds:'blue',system:'green',part:'green',serves:'plum',runs:'amber',checks:'amber'};
const STATUS={new:'● New',changed:'◇ Changed',unsure:'? Guess'};
const STATUSES={new:'new',added:'new',changed:'changed',modified:'changed',updated:'changed',unsure:'unsure',guess:'unsure',unknown:'unsure',maybe:'unsure'};
popOpts={obstacles:'.box,.more,.chip,.wire-label,.lane>h2,h1'};
boot('nodes',data=>{
  const board=el('section','board'),plan=el('section','plan'),shell=role(el('div','shell'),'green'),parts=el('div','parts'),boxes={},cols={system:shell,part:parts};
  const nodes=list(data.nodes).map(item).map(n=>({...n,lane:pick(n.lane,LANE,'feeds'),id:slug(n.id||n.label)}));
  const edges=list(data.edges).map(item).map(e=>({...e,from:slug(e.from??e.source),to:slug(e.to??e.target)}));
  // Lane headings say what each lane is in this story; without them, they are built from the system's own name.
  const names={},lanesIn=data.lanes??data.bands,sys=nodes.find(n=>n.lane==='system')?.label||'it';
  for(const k in Object(lanesIn))names[pick(k,LANE,k)]=txt(lanesIn[k]);
  const fallback={runs:'Who runs '+sys,feeds:'What feeds '+sys,system:'Inside '+sys,serves:'Who '+sys+' serves',checks:'What checks '+sys};
  ['runs','feeds','system','serves','checks'].forEach(key=>{
    if((key==='runs'||key==='checks')&&!nodes.some(n=>n.lane===key))return; // the top and bottom bands draw only when used
    const lane=role(el('div','lane '+key),LANE_ROLE[key]);
    lane.append(el('h2','tag',names[key]||fallback[key]));board.append(lane);
    if(cols[key])lane.append(shell);else cols[key]=lane;
  });
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  // Parts flow left to right: a part's column is the longest chain of parts that feed it (loops ignored), at most three.
  const inner=new Set(nodes.filter(n=>n.lane==='part').map(n=>n.id)),rank={},seen={},back=new Set();
  const visit=id=>{seen[id]=1;edges.forEach(e=>{if(e.from!==id||!inner.has(e.to))return;if(seen[e.to]===1)back.add(e);else if(!seen[e.to])visit(e.to)});seen[id]=2};
  inner.forEach(id=>rank[id]=0);inner.forEach(id=>seen[id]||visit(id));
  for(let i=0;i<inner.size;i++)edges.forEach(e=>{if(!back.has(e)&&inner.has(e.from)&&inner.has(e.to))rank[e.to]=Math.max(rank[e.to],rank[e.from]+1)});
  const width=Math.min(3,1+Math.max(0,...Object.values(rank))),columns=[...Array(width)].map(()=>el('div','column'));
  parts.style.setProperty('--cols',width);parts.append(...columns);
  nodes.forEach(n=>{
    const k=pick(n.status,STATUSES,'');
    const b=box(n,STATUS[k],LANE_ROLE[n.lane],k==='unsure'?'guess':''); // colour = lane; status = tag text, guesses dashed
    b.dataset.id=n.id;b.dataset.lane=n.lane;boxes[n.id]=b;
    (n.lane==='part'?columns[Math.min(rank[n.id],width-1)]:cols[n.lane]).append(step(b,{...n,parts:''},n.label)); // a node's parts are the part lane
  });
  if(inner.size)shell.append(parts); // system box first, its parts below
  // The plan: a numbered list, or jobs by phase when steps name a phase, an owner or what they need. A job's row is the first box it touches.
  const steps=list(data.plan).map(item),phased=list(data.phases).length||steps.some(s=>s.phase??s.when??s.needs??s.after??s.owner??s.who);
  if(steps.length&&!phased)plan.append(el('h2','tag','The plan'));
  steps.forEach((s,i)=>{
    const lit=list(s.boxes).map(slug),name=boxes[lit.find(id=>boxes[id])]?.querySelector('.label').textContent||'Plan';
    if(phased)return(lanes.find(l=>l.name===name)||lanes[lanes.push({name,work:[]})-1]).work.push(s);
    const b=box(s,String(i+1).padStart(2,'0'));b.lit=lit;plan.append(b);
  });

  // Every connection is drawn faintly at rest. Hover, focus or pin a box: its wires light up in the far end's colour and say what moves.
  const NS='http://www.w3.org/2000/svg',wires=document.createElementNS(NS,'svg');
  wires.setAttribute('class','wires');wires.setAttribute('aria-hidden','true');
  wires.innerHTML=['blue','green','plum','amber','slate'].map(r=>`<marker id="head-${r}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" style="fill:var(--${r}-e)"/></marker>`).join('')+'<g/><g class="leaders"/>';
  board.append(wires);
  const live=edges.filter(e=>boxes[e.from]&&boxes[e.to]&&e.from!==e.to);
  const pair=new Set(live.map(e=>e.from+'>'+e.to));
  let current=null,lit=[],labels=[];
  // Where a wire leaves and enters: facing sides when apart sideways, top and bottom when stacked with nothing between, else round the left.
  function route(e,o){
    const a=boxes[e.from].getBoundingClientRect(),b=boxes[e.to].getBoundingClientRect(),twin=pair.has(e.to+'>'+e.from)?(e.from<e.to?-6:6):0; // a two-way pair runs side by side
    const cx=r=>r.left+r.width/2-o.left,cy=r=>r.top+r.height/2-o.top;
    if(a.right+8<b.left||b.right+8<a.left){
      const ax=(a.right<b.left?a.right:a.left)-o.left,bx=(a.right<b.left?b.left:b.right)-o.left,ay=cy(a)+twin,by=cy(b)+twin,m=(ax+bx)/2;
      return{d:`M${ax} ${ay}C${m} ${ay} ${m} ${by} ${bx} ${by}`,x:m,y:(ay+by)/2};
    }
    const lo=Math.min(a.bottom,b.bottom),hi=Math.max(a.top,b.top),l=Math.max(a.left,b.left)-20,r=Math.min(a.right,b.right)+20;
    const clear=Object.values(boxes).every(x=>{const q=x.getBoundingClientRect();return x===boxes[e.from]||x===boxes[e.to]||!q.width||q.bottom<=lo||q.top>=hi||q.right<=l||q.left>=r});
    if(lo+8<hi&&clear){
      const down=a.bottom<b.top,ay=(down?a.bottom:a.top)-o.top,by=(down?b.top:b.bottom)-o.top,ax=cx(a)+twin,bx=cx(b)+twin,m=(ay+by)/2;
      return{d:`M${ax} ${ay}C${ax} ${m} ${bx} ${m} ${bx} ${by}`,x:(ax+bx)/2,y:m};
    }
    // Anything in between: round the left side.
    const ax=a.left-o.left,bx=b.left-o.left,ay=cy(a)+twin,by=cy(b)+twin,m=Math.min(ax,bx)-18;
    return{d:`M${ax} ${ay}C${m} ${ay} ${m} ${by} ${bx} ${by}`,x:(ax+bx)/8+m*.75,y:(ay+by)/2};
  }
  function draw(){
    const [g,leaders]=wires.querySelectorAll('g');
    g.replaceChildren();leaders.replaceChildren();
    board.querySelectorAll('.wire-label').forEach(n=>n.remove());labels=[];
    const near=new Set(live.filter(e=>e.from===current||e.to===current).flatMap(e=>[e.from,e.to]));
    for(const id in boxes)boxes[id].classList.toggle('on',id===current||lit.includes(id)||near.has(id));
    board.classList.toggle('dim',!!current||lit.length>0); // something is open: fade what it doesn't touch
    const o=board.getBoundingClientRect();
    live.forEach(e=>{
      if(!boxes[e.from].offsetParent||!boxes[e.to].offsetParent)return;
      const hot=current&&(e.from===current||e.to===current),r=hot?LANE_ROLE[boxes[e.from===current?e.to:e.from].dataset.lane]:'slate',w=route(e,o);
      const path=document.createElementNS(NS,'path');
      path.setAttribute('d',w.d);path.setAttribute('marker-end',`url(#head-${r})`);path.style.stroke=`var(--${r}-e)`;
      if(hot){path.setAttribute("class","hot");if(e.label)labels.push({e,r,x:w.x,y:w.y});g.append(path)}else g.prepend(path);
    });
    labels=labels.map(({e,r,x,y})=>{const label=role(tip(el('button','wire-label',e.label),e),r);boxes[current].after(label);return{el:label,r,x,y}});
    afterPlace();
  }
  // Labels sit on their wire if there's room; otherwise they drift to the nearest gap and a thin leader points back.
  afterPlace=()=>{
    if(!labels.length)return;
    const o=board.getBoundingClientRect(),leaders=wires.querySelector('.leaders');
    const spots=settle(labels.map(l=>({el:l.el,anchor:{x:o.left+l.x,y:o.top+l.y}})));
    leaders.replaceChildren();
    labels.forEach((l,i)=>{
      const s=spots[i],w=l.el.offsetWidth/2,h=l.el.offsetHeight/2,ex=Math.max(s.x-w,Math.min(o.left+l.x,s.x+w))-o.left,ey=Math.max(s.y-h,Math.min(o.top+l.y,s.y+h))-o.top;
      if(Math.hypot(ex-l.x,ey-l.y)<6)return;
      const line=document.createElementNS(NS,'path');line.setAttribute('d',`M${l.x} ${l.y}L${ex} ${ey}`);line.style.stroke=`var(--${l.r}-e)`;
      leaders.append(line);
    });
  };
  onShow=btn=>{if(btn.classList.contains('wire-label'))return;current=btn.dataset.id||null;lit=btn.lit||[];draw()};
  onHide=()=>{current=null;lit=[];draw()};
  keepOpen=()=>board.matches(':hover');
  board.addEventListener('pointerleave',later);
  new ResizeObserver(draw).observe(board);
  // Connections in words, for show-all, print and copy.
  const notes=el('ul','notes'),name=id=>boxes[id]?.querySelector('.label').textContent||id;
  edges.forEach(e=>notes.append(el('li','',name(e.from)+' → '+name(e.to)+': '+e.label+(e.detail?' — '+e.detail:''))));
  main.append(board);if(plan.firstChild)main.append(plan);if(edges.length)main.append(notes);
});
