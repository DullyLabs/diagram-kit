const LANE={upstream:'upstream',source:'upstream',sources:'upstream',input:'upstream',inputs:'upstream',external:'upstream',system:'system',main:'system',ours:'system',internal:'internal',component:'internal',part:'internal',parts:'internal',downstream:'downstream',consumer:'downstream',consumers:'downstream',output:'downstream',outputs:'downstream',sink:'downstream'};
const LANE_ROLE={upstream:'blue',system:'green',internal:'green',downstream:'plum'};
const STATUS={new:'● New',changed:'◇ Changed',unsure:'? Guess'};
const STATUSES={new:'new',added:'new',changed:'changed',modified:'changed',updated:'changed',unsure:'unsure',guess:'unsure',unknown:'unsure',maybe:'unsure'};
boot('nodes',data=>{
  const board=el('section','board'),plan=el('section','plan'),shell=role(el('div','shell'),'green'),parts=el('div','parts stack'),boxes={},cols={system:shell,internal:parts};
  [['upstream','↓ Upstream'],['system','● Our system'],['downstream','↗ Downstream']].forEach(([key,name])=>{
    const lane=role(el('div','lane'),LANE_ROLE[key]);
    lane.append(el('h2','tag',name));board.append(lane);
    if(cols[key])lane.append(shell);else cols[key]=lane;
  });
  const nodes=list(data.nodes).map(item);
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  nodes.forEach(n=>{
    const lane=pick(n.lane,LANE,'upstream'),k=pick(n.status,STATUSES,''),id=slug(n.id||n.label);
    const b=box(n,STATUS[k],LANE_ROLE[lane],k==='unsure'?'guess':''); // colour = lane; status = tag text, guesses dashed
    b.dataset.id=id;b.dataset.lane=lane;boxes[id]=b;cols[lane].append(step(b,{...n,parts:''},n.label)); // a node's parts are the internal lane
  });
  shell.append(parts); // system box first, its parts below
  // The plan: a numbered list, or jobs by phase when steps name a phase, an owner or what they need. A job's row is the first box it touches.
  const steps=list(data.plan).map(item),phased=list(data.phases).length||steps.some(s=>s.phase??s.when??s.needs??s.after??s.owner??s.who);
  if(steps.length&&!phased)plan.append(el('h2','tag','The plan'));
  steps.forEach((s,i)=>{
    const lit=list(s.boxes).map(slug),name=boxes[lit.find(id=>boxes[id])]?.querySelector('.label').textContent||'Plan';
    if(phased)return(lanes.find(l=>l.name===name)||lanes[lanes.push({name,work:[]})-1]).work.push(s);
    const b=box(s,String(i+1).padStart(2,'0'));b.lit=lit;plan.append(b);
  });
  const edges=list(data.edges).map(item).map(e=>({...e,from:slug(e.from),to:slug(e.to)}));

  // Connections: hidden at rest, drawn only for the box that is hovered, focused or pinned.
  const wires=document.createElementNS('http://www.w3.org/2000/svg','svg');
  wires.setAttribute('class','wires');wires.setAttribute('aria-hidden','true');
  wires.innerHTML=['blue','green','plum'].map(r=>`<marker id="head-${r}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" style="fill:var(--${r}-e)"/></marker>`).join('')+'<g/>';
  board.append(wires);
  let current=null,lit=[],placed=[];
  const opts={gap:2,pull:60,obstacles:'.box,.wire-label,.lane>h2,h1,.detail'};
  function draw(){
    wires.lastChild.replaceChildren();
    board.querySelectorAll('.wire-label').forEach(n=>n.remove());
    for(const id in boxes)boxes[id].classList.toggle('on',id===current||lit.includes(id));
    board.classList.toggle('dim',lit.length>0); // a plan step is lit: fade everything it doesn't touch
    if(!current)return;
    const o=board.getBoundingClientRect(),labels=[];
    edges.filter(e=>(e.from===current||e.to===current)&&boxes[e.from]&&boxes[e.to]).forEach(e=>{
      const far=boxes[e.from===current?e.to:e.from],r=LANE_ROLE[far.dataset.lane]; // wire takes the colour of the far end
      const a=boxes[e.from].getBoundingClientRect(),b=boxes[e.to].getBoundingClientRect();
      const ay=a.top+a.height/2-o.top,by=b.top+b.height/2-o.top,label=role(tip(el('button','wire-label',e.label),e),r);
      let ax,bx,bend;
      if(a.right<b.left||b.right<a.left){
        // Side by side: curve across the gap.
        ax=(a.right<b.left?a.right:a.left)-o.left;bx=(a.right<b.left?b.left:b.right)-o.left;bend=(ax+bx)/2;
      }else{
        // Stacked: curve down the left side.
        ax=a.left-o.left;bx=b.left-o.left;bend=Math.min(ax,bx)-18;
      }
      const path=document.createElementNS(wires.namespaceURI,'path');
      path.setAttribute('d','M'+ax+' '+ay+'C'+bend+' '+ay+' '+bend+' '+by+' '+bx+' '+by);
      path.setAttribute('marker-end',`url(#head-${r})`);path.style.stroke=`var(--${r}-e)`;
      // Anchor the label at the curve's midpoint (in page coordinates) so it sits on its own line.
      const mx=(ax+bx)/2+(bend-(ax+bx)/2)*.75,my=(ay+by)/2,mid={getBoundingClientRect:()=>{const r=board.getBoundingClientRect();return new DOMRect(r.left+mx,r.top+my,0,0)}};
      wires.lastChild.append(path);labels.push([label,mid]);
    });
    placed=labels;
    labels.forEach(([label,mid])=>{boxes[current].after(label);nestle(label,mid,opts)}); // labels repel boxes, each other and the popover
  }
  onShow=btn=>{if(btn.classList.contains('wire-label'))return;current=btn.dataset.id||null;lit=btn.lit||[];draw()};
  onHide=()=>{current=null;lit=[];draw()};
  keepOpen=()=>board.matches(':hover');
  board.addEventListener('pointerleave',later);
  new ResizeObserver(draw).observe(board);addEventListener('scroll',()=>placed.forEach(([l,m])=>nestle(l,m,opts)),{passive:true}); // move labels, don't rebuild them
  // Connections in words, for show-all, print and copy.
  const notes=el('ul','notes'),name=id=>boxes[id]?.querySelector('.label').textContent||id;
  edges.forEach(e=>notes.append(el('li','',name(e.from)+' → '+name(e.to)+': '+e.label+(e.detail?' — '+e.detail:''))));
  main.append(board);if(plan.firstChild)main.append(plan);if(edges.length)main.append(notes);
});
