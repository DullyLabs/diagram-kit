boot('tables',data=>{
  const tables=list(data.tables).map(item),cards=el('section','grain-cards'),ids=new Map();
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  tables.forEach((t,i)=>{
    const id=slug(t.id||t.label)||String(i+1),card=el('section','grain-card');
    if(!ids.has(id))ids.set(id,t.label||id);
    card.append(el('h2','tag',t.label||id));
    card.append(box({label:txt(t.grain)||'Grain not specified',detail:t.detail},'One row is','blue'));
    card.append(box({label:txt(t.key)||'Key not specified',detail:txt(t.keyDetail)},'Unique by','slate'));
    depth(card,card.firstChild,t,t.label||id,p=>card.append(box(p,'Column','','part')),'column');
    cards.append(card);
  });
  main.append(cards);
  const edges=list(data.links).map(item);
  if(!edges.length)return;
  main.append(el('h2','tag relations-title','How the tables match up'));
  const ledger=el('section','relations');
  edges.forEach(e=>{
    const from=slug(e.from),to=slug(e.to),kind=pick(e.matches,{one:'one',many:'many',unknown:'unknown',single:'one',unique:'one',multiple:'many',several:'many'},'unknown');
    const [glyph,r,note]=pick(kind,{one:['At most one','green','Each row finds at most one partner, so totals stay right.'],many:['Can be many','clay','A row can find several partners, so it repeats and sums can double.']},['Not known','amber','Not checked yet: check before combining these tables.']);
    const row=el('div','relation'),valid=ids.has(from)&&ids.has(to);
    row.append(el('p','endpoints',(ids.get(from)||from||'Unspecified')+' → '+(ids.get(to)||to||'Unspecified')));
    row.append(box({label:valid?glyph:'?',detail:valid?note:'One of these names is not in tables.'},'Partners per row',valid?r:'slate'));
    row.append(box({label:e.label||'Not given',detail:e.detail},'Matched on'));
    ledger.append(row);
  });
  main.append(ledger);
});
