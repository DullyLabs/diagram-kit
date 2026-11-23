---
name: pr-explainer
description: Use when asked to explain someone else's pull request, especially one that changes SQL, tables or data pipelines. Fills a hover-to-reveal HTML explainer with the data flow, sample rows before and after, and what to check.
---

# PR explainer

1. Read the PR's diff and description until you can say in one sentence what changes for the data.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/pr-explainer/template.html ./pr-<number>-explained.html`
   (If your skills live elsewhere, use that folder. No shell? Ask the user to run the command.)
3. In the copy, replace `{"title":"REPLACE_ME"}` with your JSON, shaped exactly like the example below. Change nothing else in the file.
4. Check before you finish:
   - valid JSON: double quotes, no trailing commas, no comments;
   - every item has a `label` (40 characters at most) and a `detail` (200 at most, split lines with `\n`);
   - plain text only: no HTML, no markdown, no backticks;
   - a name you are not sure of ends with `(guess)`.
5. Tell the user the file path and ask them to open it in a browser. You cannot open it yourself.

## Fields

| Field | What to write |
|---|---|
| `title` | What the PR does, in under 8 words |
| `summary` | One sentence a new joiner understands: what changes for the data, not which files |
| `flow` | 3–5 tables, jobs or reports in the order data moves: `{label, detail, changed}`; `changed` is `true` for the ones this PR edits |
| `flow[].arrow` | `{label, detail}`: what moves to the next box. Leave out on the last |
| `sample.columns` | 2–4 column names |
| `sample.before.rows`, `sample.after.rows` | 3–5 made-up rows each, as lists of cells in column order. The first cell names the row and is the same before and after. Never real customer data |
| `checks` | 2–5 items `{text, risk, where}`: `risk` is `high`, `medium` or `low`; `where` is the file or table to look at, copied from the PR, else leave it out |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| combine tables | join |
| keep only | filter, WHERE |
| add up / count | aggregate, GROUP BY |
| drop duplicates | dedupe, DISTINCT |
| fill in the old rows | backfill |
| the nightly job | ETL batch |
| table that feeds | upstream source |

## Example

<!-- example -->
```json
{
  "title": "Two more digits. One less crisis.",
  "eyebrow": "Fictional bank PR · November 1998",
  "summary": "Stores loan years as four digits instead of two, so the year 2000 sorts and subtracts correctly.",
  "caption": "Artefact: a year, shown at full size for the first time.",
  "footnote": "Good until the year 9999. A future exhibit.",
  "flow": [
    {
      "label": "Teller terminals",
      "detail": "Unchanged.\nTellers still type two digits.",
      "arrow": {
        "label": "Add the century",
        "detail": "Years under 50 become 20YY.\nThe rest become 19YY."
      }
    },
    {
      "label": "Loan records",
      "changed": true,
      "detail": "The year column grows from 2 digits to 4.\nOld rows get a century by the same rule.",
      "arrow": {
        "label": "Read due dates",
        "detail": "The job now reads four-digit years."
      }
    },
    {
      "label": "Nightly interest",
      "changed": true,
      "detail": "Counts days between dates.\nWith two digits, 2000 minus 1999 came out as −99 years.",
      "arrow": {
        "label": "Send entries",
        "detail": "Each interest entry carries a full year."
      }
    },
    {
      "label": "Statements",
      "changed": true,
      "detail": "Prints four-digit years.\nSorts by full year, so 2000 follows 1999."
    }
  ],
  "sample": {
    "columns": [
      "Loan",
      "Due date",
      "Year stored"
    ],
    "before": {
      "note": "sorted by year",
      "rows": [
        [
          "L-208",
          "01-15-00",
          "00"
        ],
        [
          "L-312",
          "03-01-28",
          "28"
        ],
        [
          "L-104",
          "06-30-99",
          "99"
        ]
      ]
    },
    "after": {
      "note": "sorted by year",
      "rows": [
        [
          "L-104",
          "06-30-1999",
          "1999"
        ],
        [
          "L-208",
          "01-15-2000",
          "2000"
        ],
        [
          "L-312",
          "03-01-2028",
          "2028"
        ]
      ]
    }
  },
  "checks": [
    {
      "text": "No date falls outside 1950–2049.",
      "risk": "high"
    },
    {
      "text": "49 becomes 2049. 50 becomes 1950.",
      "risk": "high"
    },
    {
      "text": "29 February 2000 is accepted.",
      "risk": "medium"
    },
    {
      "text": "Balances match after the migration.",
      "risk": "low"
    }
  ]
}
```
<!-- /example -->
