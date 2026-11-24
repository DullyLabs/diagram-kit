const KIND={fetch:['blue','↓','Fetch'],check:['amber','◇','Check'],change:['green','●','Change'],save:['green','●','Save'],send:['plum','↗','Send'],stop:['clay','▲','Stop']};
const KINDS={...Object.fromEntries(Object.keys(KIND).map(k=>[k,k])),read:'fetch',load:'fetch',get:'fetch',query:'fetch',input:'fetch',receive:'fetch',validate:'check',verify:'check',test:'check',decide:'check',decision:'check',if:'check',transform:'change',update:'change',compute:'change',process:'change',convert:'change',write:'save',store:'save',persist:'save',emit:'send',publish:'send',notify:'send',output:'send',error:'stop',fail:'stop',end:'stop',abort:'stop',exit:'stop'};
boot('steps',data=>{
  const steps=list(data.steps).map(item),flow=el('section','flow stack'),used=new Set();
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  let phase='';
  steps.forEach((s,i)=>{
    const p=txt(s.phase),k=pick(s.kind??s.type,KINDS,''),kind=KIND[k];
    if(p&&p!==phase)flow.append(el('h2','tag phase',phase=p));
    if(kind)used.add(k);
    const n=String(i+1).padStart(2,'0');
    flow.append(step(box(s,n+(kind?' · '+kind[1]+' '+kind[2]:''),kind?.[0]),s,n+' · '+s.label));
    if(s.branch){
      const b=item(s.branch),side=el('div','branch');
      if(b.arrow)side.append(arrow(item(b.arrow),'amber'));
      side.append(box(b,'◇ Or','amber'));flow.append(side);
    }
    if(i<steps.length-1)flow.append(s.arrow?arrow(item(s.arrow)):el('div','arrow'));
  });
  if(used.size)header.append(legend([...used].map(k=>KIND[k])));
  main.append(flow);
});
