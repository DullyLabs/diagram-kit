"""Build skills/<name>/template.html from src/: shared + per-diagram CSS and JS, one JSON placeholder.
Also writes the worked example into SKILL.md between <!-- example --> markers.
Usage: python3 src/build.py            -> templates with the REPLACE_ME placeholder
       python3 src/build.py --example DIR -> filled copies in DIR (for screenshots and tests)"""
import html, json, pathlib, re, sys, urllib.parse
SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent
SHARED_CSS, SHARED_JS = (SRC / "shared.css").read_text(), (SRC / "shared.js").read_text()
COLOURS = ["#2f6452", "#2b5f8a", "#7a4a7e", "#a63d2a", "#7d5200", "#656a60"]

def page(name, i, data):
  d = SRC / name
  icon = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='5' fill='"
          + COLOURS[i % len(COLOURS)] + "'/><path d='" + (d / "icon.txt").read_text().strip()
          + "' fill='none' stroke='#f5f2ea' stroke-width='2.5'/></svg>")
  return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(name)}</title>
<link rel="icon" href="data:image/svg+xml,{urllib.parse.quote(icon)}">
<style>
{SHARED_CSS}
/* {name} only */
{(d / "style.css").read_text()}</style>
</head>
<body>
<!-- Replace the JSON below with your own, in the format SKILL.md shows. Change nothing else in this file. -->
<script id="diagram-data" type="application/json">
{data}
</script>
<script>
(()=>{{
{SHARED_JS}
{(d / "script.js").read_text()}
}})();
</script>
</body>
</html>
"""

names = sorted(p.name for p in SRC.iterdir() if (p / "script.js").exists())
out = pathlib.Path(sys.argv[2]) if sys.argv[1:2] == ["--example"] else None
for i, name in enumerate(names):
  example = (SRC / name / "example.json").read_text().strip()
  if out:
    out.mkdir(parents=True, exist_ok=True)
    (out / f"{name}.html").write_text(page(name, i, example))
    continue
  skill = ROOT / "skills" / name
  skill.mkdir(parents=True, exist_ok=True)
  (skill / "template.html").write_text(page(name, i, '{"title":"REPLACE_ME"}'))
  (skill / "example.html").write_text(page(name, i, example))
  desc = re.search(r"^description: (.*)$", (skill / "SKILL.md").read_text(), re.M).group(1).split(". Fills")[0]
  (skill / "README.md").write_text(f"# {name}\n\n**Use it when** {desc.removeprefix('Use when ')}.\n\n**[Open the live example](https://dullylabs.com/diagram-kit/skills/{name}/example.html)**\n\n![{name}, with one detail open](screenshot.png)\n\nThe model copies `template.html` and fills its JSON block as [SKILL.md](SKILL.md) shows; `example.html` is that template filled in.\n")
  md = skill / "SKILL.md"
  if md.exists():
    s = md.read_text()
    block = "<!-- example -->\n```json\n" + json.dumps(json.loads(example), indent=2, ensure_ascii=False) + "\n```\n<!-- /example -->"
    s = re.sub(r"<!-- example -->.*?<!-- /example -->", lambda m: block, s, flags=re.S)
    md.write_text(s)
print("built", ", ".join(names), "->", out or "skills/")
