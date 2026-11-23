"""Open every box's popover in headless Chrome and report how much it covers other items.
Usage: python3 test/placement.py [WIDTHxHEIGHT ...]   (run outside any sandbox)"""
import pathlib, re, subprocess, sys, tempfile
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
root = pathlib.Path(__file__).resolve().parent.parent
PROBE = """<script>setTimeout(()=>{const pop=document.querySelector('.detail'),res=[];
const ov=(p,r)=>Math.max(0,Math.min(p.right,r.right)-Math.max(p.left,r.left))*Math.max(0,Math.min(p.bottom,r.bottom)-Math.max(p.top,r.top));
document.querySelectorAll('.box,.arrow').forEach(b=>{b.focus();const p=pop.getBoundingClientRect();let o=0;
document.querySelectorAll('.box,.arrow,.wire-label,table,h1').forEach(x=>{if(x!==b&&!x.contains(b))o+=ov(p,x.getBoundingClientRect())});
const inside=p.left>=11&&p.top>=11&&p.right<=innerWidth-11&&p.bottom<=innerHeight-11;
res.push(Math.round(100*o/(p.width*p.height))+(inside?'':'!'))});
document.body.setAttribute('data-probe',res.join(','))},2600)</script>"""
tmp = pathlib.Path(tempfile.mkdtemp())
for size in sys.argv[1:] or ["1200x900", "800x700"]:
  for t in sorted((root / "skills").glob("*/template.html")):
    f = tmp / f"{t.parent.name}.html"; f.write_text(t.read_text().replace("</body>", PROBE + "</body>"))
    out = subprocess.run([C, "--headless=new", "--disable-gpu", f"--user-data-dir={tmp/'prof'}", f"--window-size={size.replace('x', ',')}",
                          "--virtual-time-budget=4000", "--dump-dom", f.as_uri()], capture_output=True, text=True).stdout
    m = re.search(r'data-probe="([^"]*)"', out)
    vals = m.group(1).split(",") if m else []
    worst = max((int(v.rstrip("!")) for v in vals), default=-1)
    print(f"{size:9} {t.parent.name:13} items={len(vals):<3} worst cover={worst}%  off-screen={sum(v.endswith('!') for v in vals)}  [{m.group(1) if m else 'NO PROBE'}]")
