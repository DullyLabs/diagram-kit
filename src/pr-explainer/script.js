const RISK={high:['clay','▲','High risk'],medium:['amber','◇','Check'],low:['slate','○','Low risk']};
const RISKS={high:'high',critical:'high',major:'high',medium:'medium',med:'medium',moderate:'medium',low:'low',minor:'low'};
const ORDER={high:0,medium:1,low:2};
boot('flow',data=>{
  let n=0;const heading=t=>el('h2','tag',++n+' · '+t);
  if(txt(data.summary))header.append(callout('In one line',txt(data.summary)));
  const steps=list(data.flow).map(item),flow=el('section','flow'+(steps.length>4?' tall stack':''));
  steps.forEach((s,i)=>{
    const changed=yes(s.changed);
    flow.append(box(s,changed?'● Changed':'Unchanged',changed?'green':'slate'));
    if(i<steps.length-1)flow.append(s.arrow?arrow(item(s.arrow)):el('div','arrow'));
  });
  main.append(heading('What moves'),flow);

  // Sample rows: arrays of cells, or objects keyed by column name.
  const sample=data.sample&&typeof data.sample==='object'?data.sample:{},side={before:sample.before??sample.old,after:sample.after??sample.new};
  const rowsOf=v=>list(Array.isArray(v)?v:v?.rows);
  let cols=list(sample.columns).map(txt);
  const obj=[...rowsOf(side.before),...rowsOf(side.after)].find(r=>r&&typeof r==='object'&&!Array.isArray(r));
  if(!cols.length&&obj)cols=Object.keys(obj);
  const field=(r,c)=>r[c]??r[Object.keys(r).find(k=>k.toLowerCase()===c.toLowerCase())];
  const cells=r=>Array.isArray(r)?r.map(txt):r&&typeof r==='object'?(cols.length?cols.map(c=>txt(field(r,c))):Object.values(r).map(txt)):[txt(r)];
  const rows={before:rowsOf(side.before).map(cells),after:rowsOf(side.after).map(cells)};
  if(rows.before.length||rows.after.length){
    const tables=el('section','tables');
    [['before','after','slate'],['after','before','green']].forEach(([s,other,r])=>{
      if(!rows[s].length)return;
      // Pair rows by their first cell; if none match, pair them by position.
      const keyed=rows[s].some(row=>rows[other].some(o=>o[0]===row[0])),table=role(el('table'),r),head=el('tr'),note=txt(side[s]?.note),wrap=el('div','scroll');
      table.append(el('caption','tag',s+(note?' · '+note:'')),head);
      cols.forEach(c=>head.append(el('th','',c)));
      rows[s].forEach((row,j)=>{
        const tr=el('tr'),twin=(keyed?rows[other].find(o=>o[0]===row[0]):rows[other][j])||[];
        row.forEach((cell,i)=>tr.append(el('td',cell===twin[i]?'':'diff',cell)));
        table.append(tr);
      });
      wrap.append(table);tables.append(wrap);
    });
    main.append(heading('What a row looks like'),legend([['slate','■','Changed cell, before'],['green','■','Changed cell, after']]),tables);
  }

  const checks=list(data.checks).map(c=>{
    const o=c&&typeof c==='object'&&!Array.isArray(c)?c:{text:c};
    return{text:txt(o.text??o.label??o.check??o.detail),where:txt(o.where??o.look??o.file),risk:pick(o.risk??o.level??o.severity,RISKS,'medium')};
  }).filter(c=>c.text).sort((a,b)=>ORDER[a.risk]-ORDER[b.risk]);
  if(checks.length){
    const ul=el('ul','checks');
    checks.forEach(c=>{
      const r=RISK[c.risk],li=role(el('li'),r[0]),g=el('span','glyph',r[1]);
      g.title=r[2];li.append(g,el('span','',c.text));
      if(c.where)li.append(el('span','where','Look at: '+c.where));
      ul.append(li);
    });
    main.append(heading('What to check'),legend(Object.values(RISK).filter(r=>checks.some(c=>RISK[c.risk]===r))),ul);
  }
});
