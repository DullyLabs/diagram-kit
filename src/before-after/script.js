const EFFECT={better:['green','▲','Better'],worse:['clay','▼','Worse'],same:['slate','=','Same'],removed:['clay','✕','Removed']};
const EFFECTS={better:'better',improved:'better',faster:'better',worse:'worse',slower:'worse',same:'same',unchanged:'same',removed:'removed',deleted:'removed',dropped:'removed',gone:'removed'};
boot('themes',data=>{
  const themes=list(data.themes).map(item),same=list(data.unchanged).map(txt).filter(Boolean),grid=el('section','grid');
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  header.append(el('p','caption',themes.length+' changed'+(same.length?' · '+same.length+' stayed the same':'')));
  themes.forEach((t,i)=>{
    const theme=el('section','theme stack'),h=el('h2','tag',String(i+1).padStart(2,'0')+' · '+t.label),e=EFFECT[pick(t.effect,EFFECTS,'')];
    if(e)h.append(role(el('span','chip',e[1]+' '+e[2]),e[0]));
    theme.append(h);
    const before=t.before??t.old??t.from,change=t.change??t.how,after=t.after??t.new??t.to;
    if(before!=null)theme.append(box(item(before),'Before','slate'));
    if(change!=null)theme.append(arrow(item(change),'green'));
    if(after!=null)theme.append(box(item(after),'After','green'));
    grid.append(theme);
  });
  main.append(grid);
  if(same.length){
    const s=el('section','same');s.append(el('h2','tag','Stayed the same'));
    same.forEach(x=>s.append(role(el('span','chip','= '+x),'slate')));main.append(s);
  }
});
