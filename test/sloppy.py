"""Write sloppy-JSON copies of each built example (from src/build.py --example DIR) to OUT."""
import json, pathlib, re, sys
root = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2]); out.mkdir(exist_ok=True)
LONG = "An extremely long label that a careless model wrote without reading the limits at all " * 2
minimal = {
  "flow-diagram": {"title": "T", "steps": [{"label": "Only step"}]},
  "before-after": {"title": "T", "themes": [{"name": "One"}]},
  "pr-explainer": {"title": "T", "flow": [{"label": "One"}]},
  "system-plan": {"title": "T", "nodes": [{"id": "a", "lane": "mine", "label": "Mine"}]},
  "join-explainer": {"title": "T", "groups": [{"label": "x", "left": "2"}]},
  "grain-map": {"title": "T", "tables": ["orders"]},
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
  for k in ("steps", "themes", "flow", "nodes", "plan", "groups", "tables"):
    for item in long.get(k, []):
      for f in ("label", "name"):
        if f in item: item[f] = LONG
  long["title"] = LONG
  put("long", json.dumps(long))
  put("html", json.dumps(good).replace(good["title"], "<img src=x onerror=alert(1)>" + good["title"], 1))
# system-plan: lanes by alias, bands keyed by alias, a loop, a self edge, a missing id, source/target edges.
src = (root / "system-plan.html").read_text()
block = re.search(r'(<script id="diagram-data" type="application/json">)(.*?)(</script>)', src, re.S)
lanes = {"title": "T", "bands": {"top": "Runs it", "bottom": "Checks it"}, "lanes": {"from": "Feeds it"}, "nodes": [
  {"id": "p", "lane": "people", "label": "People"}, {"id": "s", "lane": "main", "label": "Sys"},
  {"id": "a", "lane": "part", "label": "A"}, {"id": "b", "lane": "part", "label": "B"}, {"id": "c", "lane": "part", "label": "C"},
  {"id": "w", "lane": "watchers", "label": "Watch"}],
  "edges": [{"source": "p", "target": "a", "label": "x"}, {"from": "a", "to": "b"}, {"from": "b", "to": "c"}, {"from": "c", "to": "a", "label": "back"},
            {"from": "b", "to": "b"}, {"from": "ghost", "to": "a"}, {"from": "c", "to": "w", "label": "ring"}]}
(out / "system-plan-lanes.html").write_text(src[:block.start(2)] + json.dumps(lanes) + src[block.end(2):])
print(sorted(p.name for p in out.iterdir()))
