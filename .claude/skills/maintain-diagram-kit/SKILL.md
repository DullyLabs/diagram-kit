---
name: maintain-diagram-kit
description: Use when changing diagram-kit itself - a template's layout, colours or fields, a new diagram type, the examples or the generator skills. Not for filling in a diagram; that is the skill in skills/<name>.
---

# Maintaining diagram-kit

## What the kit is for

Someone has to explain a large piece of work to the people who will build it, and a small local model does the drawing. The page must work at three distances:

| Distance | The reader gets | In the page |
|---|---|---|
| Across the room | What changes, in one screen | Title, one-sentence summary, short labels |
| At the desk | How each piece changes and what could go wrong | Sections that open on click; details on hover |
| Building it | Who does what, in what order, and what waits on what | Jobs by phase, with lines between jobs that depend on each other |

## Rules that keep it working

- **Data and template stay apart.** A template is one self-contained HTML file; the model only replaces its JSON block. Never ask a model to edit layout, CSS or script.
- **The data picks the template.** Each template fits one shape of data ([SKILL.md](../../../SKILL.md) lists them). A new shape gets a new template; an existing one never grows a second purpose.
- **Sections follow the data.** A section draws only when its field is present, so every new field is optional and the short form still fits one screen.
- **Look tweaks go through `style`.** Models change variables, never rules. Anything worth tweaking becomes a variable at the top of `src/shared.css`.
- **Forgive the model.** Accept field aliases, missing ids, strings where objects were expected, and broken JSON (show what to fix). `test/sloppy.py` holds the cases; extend it when a new field can break a page.
- **Depth is quiet.** At rest the page shows labels of 40 characters or fewer. Detail appears on hover, pins on click, and all of it shows with ≡ and in print. No text on the page explains how to use it.
- **Connections also exist in words.** Every drawn line is repeated as text ("Needs", "Unlocks") for print, copy and screen readers.
- **Never colour alone.** Position, a label and a border style carry each distinction too. Before sits left, grey and dashed; After sits right, blue and solid.
- **Examples are public history.** Each template ships one worked example from a well-documented public event, every fact with a source. Never use the maintainer's own field or anything that hints at it; the reader swaps in private content locally.

## Making a change

1. Edit `src/` only: `shared.css` and `shared.js` for all templates, `src/<name>/` for one. `skills/<name>/template.html`, `example.html`, `README.md` and the example block in each generator `SKILL.md` are built.
2. A new field: read it with its aliases, draw it only when present, add it to that skill's Fields table and to `src/<name>/example.json`.
3. Run `python3 src/build.py`, then the checks in [test/README.md](../../../test/README.md).
4. Look at it: light, dark, 390 px wide, ≡ on, and the `-long` and `-minimal` pages from `test/sloppy.py`. Retake `skills/<name>/screenshot.png` at 1200 px wide with one detail open.
5. Keep each generator `SKILL.md` short enough for a small model: steps, checks, Fields, Words, example.
