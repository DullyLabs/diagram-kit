"""Load each page in headless Chrome; fail on console errors, injected HTML, "undefined", "[object Object]" or a page that could not be drawn."""
import pathlib, re, subprocess, sys
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
d = pathlib.Path(sys.argv[1]); prof = d.parent / "chrome-prof"
failed = 0
for f in sorted(d.glob("*.html")):
  r = subprocess.run([C, "--headless=new", "--disable-gpu", f"--user-data-dir={prof}", "--virtual-time-budget=3000",
                      "--enable-logging=stderr", "--v=0", "--dump-dom", f.as_uri()], capture_output=True, text=True, errors="replace")
  dom = re.sub(r"<script.*?</script>", "", r.stdout, flags=re.S)
  errs = [l.split('CONSOLE')[1][:110] for l in r.stderr.splitlines() if "CONSOLE" in l and re.search("error|uncaught", l, re.I)]
  boxes = len(re.findall(r'class="box', dom))
  banner = "BANNER" if "could not load" in dom else ""
  inj = "INJECTED" if "<img src=" in dom else ""
  text = re.sub(r"<[^>]+>", " ", dom)
  bad = [w for w in ("undefined", "[object Object]", "could not be drawn") if w in text]
  ok = not errs and not inj and not bad and (banner or "broken" not in f.name)
  failed += not ok
  print(f"{'ok ' if ok else 'BAD'} {f.name:34} boxes={boxes:<3} {banner:6} {inj} {bad} {errs[:1]}")
sys.exit(1 if failed else 0)
