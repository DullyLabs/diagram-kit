const LANE={upstream:'upstream',source:'upstream',sources:'upstream',input:'upstream',inputs:'upstream',external:'upstream',system:'system',main:'system',ours:'system',internal:'internal',component:'internal',part:'internal',parts:'internal',downstream:'downstream',consumer:'downstream',consumers:'downstream',output:'downstream',outputs:'downstream',sink:'downstream'};
const LANE_ROLE={upstream:'blue',system:'green',internal:'green',downstream:'plum'};
const STATUS={new:['','● New'],changed:['','◇ Changed'],unsure:['','? Guess']};
const STATUSES={new:'new',added:'new',changed:'changed',modified:'changed',updated:'changed',unsure:'unsure',guess:'unsure',unknown:'unsure',maybe:'unsure'};
const slug=s=>txt(s).toLowerCase().replace(/[^a-z0-9]+/g,'-');
boot('nodes',data=>{
  const board=el('section','board'),plan=el('section','plan'),shell=role(el('div','shell'),'green'),parts=el('div','parts stack'),boxes={},lanes={system:shell,internal:parts};
  [['upstream','↓ Upstream'],['system','● Our system'],['downstream','↗ Downstream']].forEach(([key,name])=>{
    const lane=role(el('div','lane'),LANE_ROLE[key]);
    lane.append(el('h2','tag',name));board.append(lane);
    if(lanes[key])lane.append(shell);else lanes[key]=lane;
  });
  const nodes=list(data.nodes).map(item);
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  nodes.forEach(n=>{
    const lane=pick(n.lane,LANE,'upstream'),k=pick(n.status,STATUSES,''),id=slug(n.id||n.label);
    const b=box(n,STATUS[k]?.[1],LANE_ROLE[lane],k==='unsure'?'guess':''); // colour = lane; status = tag text, guesses dashed
    b.dataset.id=id;b.dataset.lane=lane;boxes[id]=b;lanes[lane].append(b);
  });
  shell.append(parts); // system box first, its parts below
  plan.append(el('h2','tag','The plan'));
  list(data.plan).map(item).forEach((s,i)=>{
    const b=box(s,String(i+1).padStart(2,'0'));b.lit=list(s.boxes).map(slug);plan.append(b);
  });
  const edges=list(data.edges).map(item).map(e=>({...e,from:slug(e.from),to:slug(e.to)}));

  // Connections: hidden at rest, drawn only for the box that is hovered, focused or pinned.
  const wires=document.createElementNS('http://www.w3.org/2000/svg','svg');
  wires.setAttribute('class','wires');wires.setAttribute('aria-hidden','true');
  wires.innerHTML=['blue','green','plum'].map(r=>`<marker id="head-${r}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" style="fill:var(--${r}-e)"/></marker>`).join('')+'<g/>';
  board.append(wires);
  let current=null,lit=[];
  function draw(){
    wires.lastChild.replaceChildren();
    board.querySelectorAll('.wire-label').forEach(n=>n.remove());
    for(const id in boxes)boxes[id].classList.toggle('on',id===current||lit.includes(id));
    board.classList.toggle('dim',lit.length>0); // a plan step is lit: fade everything it doesn't touch
    if(!current)return;
    const o=board.getBoundingClientRect(),tagged={},labels=[];
    edges.filter(e=>(e.from===current||e.to===current)&&boxes[e.from]&&boxes[e.to]).forEach(e=>{
      const far=boxes[e.from===current?e.to:e.from],r=LANE_ROLE[far.dataset.lane]; // wire takes the colour of the far end
      const a=boxes[e.from].getBoundingClientRect(),b=boxes[e.to].getBoundingClientRect();
      const ay=a.top+a.height/2-o.top,by=b.top+b.height/2-o.top,label=role(tip(el('button','wire-label',e.label),e),r);
      let ax,bx,bend;
      if(a.right<b.left||b.right<a.left){
        // Side by side: curve across the gap, label on the far box's top edge so labels never stack.
        const t=far.getBoundingClientRect();
        ax=(a.right<b.left?a.right:a.left)-o.left;bx=(a.right<b.left?b.left:b.right)-o.left;bend=(ax+bx)/2;
        label.style.left=t.left+t.width/2-o.left+'px';label.style.top=t.top-o.top+'px';
      }else{
        // Stacked: curve down the left side, label tagged onto the other box.
        const t=far.getBoundingClientRect(),fid=far.dataset.id;
        ax=a.left-o.left;bx=b.left-o.left;bend=Math.min(ax,bx)-18;
        label.classList.add('tagged');
        label.style.left=t.left-o.left+12+'px';label.style.top=(tagged[fid]?t.bottom:t.top)-o.top+'px';tagged[fid]=true;
      }
      const path=document.createElementNS(wires.namespaceURI,'path');
      path.setAttribute('d','M'+ax+' '+ay+'C'+bend+' '+ay+' '+bend+' '+by+' '+bx+' '+by);
      path.setAttribute('marker-end',`url(#head-${r})`);path.style.stroke=`var(--${r}-e)`;
      wires.lastChild.append(path);labels.push(label);
    });
    boxes[current].after(...labels);
  }
  onShow=btn=>{if(btn.classList.contains('wire-label'))return;current=btn.dataset.id||null;lit=btn.lit||[];draw()};
  onHide=()=>{current=null;lit=[];draw()};
  keepOpen=()=>board.matches(':hover');
  board.addEventListener('pointerleave',later);
  new ResizeObserver(draw).observe(board);
  main.append(board,plan);
});
