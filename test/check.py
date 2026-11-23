"""Load each fixture in headless Chrome; report console errors, rendered boxes, error banner, injected HTML."""
import pathlib, re, subprocess, sys
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
d = pathlib.Path(sys.argv[1]); prof = d.parent / "chrome-prof"
for f in sorted(d.glob("*.html")):
  r = subprocess.run([C, "--headless=new", "--disable-gpu", f"--user-data-dir={prof}", "--virtual-time-budget=3000",
                      "--enable-logging=stderr", "--v=0", "--dump-dom", f.as_uri()], capture_output=True, text=True, errors="replace")
  dom = re.sub(r"<script.*?</script>", "", r.stdout, flags=re.S)
  errs = [l.split('CONSOLE')[1][:110] for l in r.stderr.splitlines() if "CONSOLE" in l and re.search("error|uncaught", l, re.I)]
  boxes = len(re.findall(r'class="box', dom))
  banner = "BANNER" if "could not load" in dom else ""
  inj = "INJECTED" if "<img src=" in dom else ""
  print(f"{f.name:34} boxes={boxes:<3} {banner:6} {inj} {errs[:1]}")
