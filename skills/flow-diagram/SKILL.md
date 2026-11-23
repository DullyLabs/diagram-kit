---
name: flow-diagram
description: Use when asked to explain how some code, job or process works step by step, or for a flowchart or flow diagram. Fills an animated, hover-to-reveal HTML flow.
---

# Flow diagram

1. Read the code until you can tell the story in 4–8 steps. One decision point at most.
2. Copy `template.html` from the folder this SKILL.md is in to the path the user names, else `./<topic>-flow.html`.
3. Replace only the JSON in `<script id="diagram-data">`. Its schema is in the comment above it. Touch nothing else.
4. Open the file in a browser.

## Writing rules

- A step label is 2–5 words, starting with a verb: "Check the order", not "Order validation subsystem".
- A step's detail is 1–3 short lines: what happens, and why it matters.
- An arrow's detail says what moves to the next step: "the cleaned rows", "a yes/no answer".
- Name real things (tables, functions) only in details, never in labels.
- Plain words, not jargon:

| Say | Not |
|---|---|
| check | validate, assert |
| send | dispatch, emit, publish |
| save | persist, commit |
| fetch | retrieve, query, ingest |
| turn into | transform, map, serialize |
| keeps trying | retries with backoff |
| gives up | throws, fails fast |

- Optional `caption`/`footnote`: one dry museum wall-label joke at most, or leave them out.
