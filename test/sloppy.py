"""Write sloppy-JSON copies of each built example (from src/build.py --example DIR) to OUT."""
import json, pathlib, re, sys
root = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2]); out.mkdir(exist_ok=True)
LONG = "An extremely long label that a careless model wrote without reading the limits at all " * 2
minimal = {
  "flow-diagram": {"title": "T", "steps": [{"label": "Only step"}]},
  "before-after": {"title": "T", "themes": [{"name": "One"}]},
  "pr-explainer": {"title": "T", "flow": [{"label": "One"}]},
  "system-plan": {"title": "T", "nodes": [{"id": "a", "lane": "mine", "label": "Mine"}]},
}
for t in minimal:
  src = (root / f"{t}.html").read_text()
  block = re.search(r'(<script id="diagram-data" type="application/json">)(.*?)(</script>)', src, re.S)
  good = json.loads(block.group(2))
  def put(name, text):
    (out / f"{t}-{name}.html").write_text(src[:block.start(2)] + text + src[block.end(2):])
  put("broken", block.group(2).replace('"title"', 'title', 1))
  put("trailing-comma", json.dumps(good, indent=1).replace("\n}", ",\n}"))
  put("minimal", json.dumps(minimal[t]))
  put("empty", "{}")
  long = json.loads(json.dumps(good))
  for k in ("steps", "themes", "flow", "nodes", "plan"):
    for item in long.get(k, []):
      for f in ("label", "name"):
        if f in item: item[f] = LONG
  long["title"] = LONG
  put("long", json.dumps(long))
  put("html", json.dumps(good).replace(good["title"], "<img src=x onerror=alert(1)>" + good["title"], 1))
print(sorted(p.name for p in out.iterdir()))
