---
name: system-plan
description: Use when planning a large epic that reads from some systems, changes or builds one, and serves others, or when asked for a system context diagram. Fills a clean HTML diagram that shows connections only on hover, with a plain-language plan below.
---

# System plan

1. Find out the systems that feed ours (upstream), what ours is made of, and who uses its output (downstream). Ask the user for any you can't find; mark guesses as guesses.
2. Copy `template.html` from the folder this SKILL.md is in to the path the user names, else `./<epic>-plan.html`.
3. Replace only the JSON in `<script id="diagram-data">`. Its schema is in the comment above it. Touch nothing else.
4. Open the file in a browser.

## Writing rules

- Box labels are the system's everyday name, 2–4 words.
- A box's details: what it is in one line, what it's written in only if it matters, three short bullets on what it does, and whether it matters for this epic.
- Connection labels say what moves: "orders, every hour", "customer lookups".
- The plan is 3–7 numbered steps in plain language, in the order they must happen. Link each step to the boxes it touches.
- Plain words, not jargon:

| Say | Not |
|---|---|
| sends to / reads from | publishes to / consumes |
| asks for | calls, invokes |
| copy of | replica, mirror |
| shows | exposes, surfaces |
| owned by | stewarded by |
| not sure yet | TBD |

- Optional `caption`/`footnote`: one dry museum wall-label joke at most, or leave them out.
