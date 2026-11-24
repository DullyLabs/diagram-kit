boot('groups',data=>{
  const mode=pick(data.join,{inner:'inner',left:'left',right:'right',full:'full'},'inner');
  const count=v=>{const n=typeof v==='number'?v:/^\s*\d+\s*$/.test(txt(v))?+txt(v):NaN;return Number.isSafeInteger(n)&&n>=0?n:null}; // "2" counts too
  const L=txt(data.left)||'Left table',R=txt(data.right)||'Right table';
  const rule={inner:'Keep only rows that match',left:'Keep every '+L+' row',right:'Keep every '+R+' row',full:'Keep every row from both'}[mode];
  if(txt(data.summary))header.append(callout('In short',txt(data.summary)));
  header.append(callout(rule,'Matched on: '+(txt(data.condition)||'not given'),'blue'));
  const board=el('section','join-board'),head=el('div','join-row headings');
  ['Matching value',L,R,'Rows out'].forEach(t=>head.append(el('h2','tag',t)));
  board.append(head);
  let total=0,known=true;
  list(data.groups).map(item).forEach(g=>{
    const l=count(g.left),r=count(g.right),valid=l!==null&&r!==null;
    const matches=valid&&l>0&&r>0;
    let n=valid?(matches?l*r:mode==='full'?l+r:mode==='left'?l:mode==='right'?r:0):null;
    if(n!==null&&!Number.isSafeInteger(n))n=null;
    if(n===null)known=false;else total+=n;
    const row=el('div','join-row'),state=n===null?'? Unknown':matches?'● Matched':n?'Kept, no match':'✕ Dropped';
    row.append(box(g,state,matches?'green':n?'amber':'clay'));
    row.append(box({label:l===null?'?':String(l),detail:'Rows in '+L+' with this value.'},L,'blue'));
    row.append(box({label:r===null?'?':String(r),detail:'Rows in '+R+' with this value.'},R,'plum'));
    const why=n===null?'A count is missing in the JSON.':matches?'Every '+L+' row pairs with every '+R+' row: '+l+' × '+r+' = '+n+'.'+(l>1&&r>1?'\nRows repeat, so totals can double.':''):n?'Kept with blanks for the other table.':'These rows disappear from the result.';
    row.append(box({label:n===null?'?':String(n),detail:why},'Rows out',matches?'green':n?'amber':'clay'));
    const extra=el('div','extra');row.append(extra);depth(row,extra,g,g.label);
    if(!extra.firstChild)extra.remove();
    board.append(row);
  });
  main.append(board,callout('Rows out in total',known&&Number.isSafeInteger(total)?String(total):'Unknown: a count is missing.','slate'));
});
