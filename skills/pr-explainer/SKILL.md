---
name: pr-explainer
description: Use when asked to explain someone else's pull request, especially big SQL, schema, ETL or data pipeline changes. Fills an HTML page with a one-line summary, the tables and jobs touched, sample rows before and after, and what to check.
---

# PR explainer

1. Read the whole PR diff, plus enough of the code around it to know where the data comes from and goes.
2. Copy `template.html` from the folder this SKILL.md is in to the path the user names, else `./pr-<number>-explained.html`.
3. Replace only the JSON in `<script id="diagram-data">`. Its schema is in the comment above it. Touch nothing else.
4. Open the file in a browser.

## Writing rules

- The summary is one or two sentences a new joiner understands: what changes for the data, not which files changed.
- The flow shows only the tables, jobs and reports this PR touches or feeds, in the order data moves. Mark the changed ones.
- Sample rows: 3–6 made-up rows that show the change, with the columns that change and one or two for context. Pick rows that show the tricky case (nulls, duplicates, edge dates).
- Things to check: 2–5 risks in plain language ("Rows with no country now vanish"), each with where to look.
- Never paste real customer data into sample rows.
- Plain words, not jargon:

| Say | Not |
|---|---|
| combine tables | join |
| keep only | filter, WHERE |
| add up / count | aggregate, GROUP BY |
| drop duplicates | dedupe, DISTINCT |
| fill in the old rows | backfill |
| the nightly job | ETL batch |
| table that feeds | upstream source |

- Optional `caption`/`footnote`: one dry museum wall-label joke at most, or leave them out.
