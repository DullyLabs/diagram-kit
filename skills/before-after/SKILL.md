---
name: before-after
description: Use when asked what a big change (an epic, migration, rewrite or long branch) changed, or for a before/after comparison. Fills an animated, hover-to-reveal HTML before-and-after.
---

# Before / after

1. Read the change (commits, diff, tickets) and group it into 3–6 themes the reader cares about. Hundreds of changes still make 3–6 themes.
2. Copy `template.html` from this skill's base directory to the path the user names, else `./<topic>-before-after.html`.
3. Replace only the JSON in `<script id="diagram-data">`. Its schema is in the comment above it. Touch nothing else.
4. Open the file in a browser.

## Writing rules

- Before and after labels are 2–5 words each and mirror each other: "Nightly batch" → "Every 5 minutes".
- The change arrow says how it got there in 2–4 words: "Replaced the cron job".
- Details are 1–3 short lines: what the reader will notice, not how it was coded.
- List what stayed the same: it is what reviewers worry about most.
- Plain words, not jargon:

| Say | Not |
|---|---|
| slower / faster | regressed / optimized |
| moved | migrated, re-platformed |
| removed | deprecated, sunset |
| split into | decomposed, sharded |
| merged into | consolidated |
| works the same | backward compatible |

- Optional `caption`/`footnote`: one dry museum wall-label joke at most, or leave them out.
