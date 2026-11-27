---
name: pr-explainer
description: Use when asked to explain someone else's pull request, especially one that changes SQL, tables or data pipelines. Fills a hover-to-reveal HTML explainer with the data flow, sample rows before and after, and what to check.
---

# PR explainer

1. Read the PR's diff and description until you can say in one sentence what changes for the data.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/pr-explainer/template.html ./pr-<number>-explained.html`
   (If your skills live elsewhere, use that folder.)
   No shell or file tools? Reply with only your JSON and tell the user to paste it over `{"title":"REPLACE_ME"}` in a copy of `template.html`.
3. In the copy, replace `{"title":"REPLACE_ME"}` with your JSON, shaped exactly like the example below. Change nothing else in the file.
4. Check before you finish:
   - valid JSON: double quotes, no trailing commas, no comments;
   - every box and arrow has a `label` (40 characters at most) and a `detail` (200 at most, split lines with `\n`);
   - plain text only: no HTML, no markdown, no backticks;
   - a name you are not sure of ends with `(guess)`.
5. Tell the user the file path and ask them to open it in a browser. You cannot open it yourself.

Write for a busy reader who must get up to speed: every word must help them understand the content, so cut anything else and never explain how to use the page. The title says plainly what the page covers; no teasers, puns or jokes.

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
| `flow[].parts` | Optional, on changed boxes: 2–4 things inside the box that change, `{label, detail}` |
| `flow[].risks` | Optional: what can go wrong at this box, `{label, detail}` |
| `flow[].work` | Optional jobs to roll the change out: `{label, detail, phase, owner, needs}`; `phase` is a name from `phases`; `needs` lists the labels of jobs that must finish first |
| `phases` | Optional, with jobs: `{label, when, detail}` in order, such as "Build", "Switch", "Clean up" |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |
| `style` | Optional look tweaks: variables from the top of the template's `<style>`, such as `{"--radius": "8px", "--serif": "system-ui"}`. A colour set here applies in light and dark mode |

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
  "title": "Y2K fix: loan years stored as four digits",
  "eyebrow": "Fictional bank PR · November 1998",
  "summary": "Stores loan years as four digits instead of two, so the year 2000 sorts and subtracts correctly.",
  "caption": "A fictional 1998 bank change: which records it touches and what to check.",
  "flow": [
    {
      "label": "Teller terminals",
      "detail": "Unchanged.\nTellers still type two digits.",
      "arrow": {
        "label": "Add the century",
        "detail": "Years under 50 become 20YY.\nThe rest become 19YY."
      },
      "risks": [
        {
          "label": "Wrong century guessed",
          "detail": "A year typed as 49 becomes 2049, even when 1949 was meant."
        }
      ]
    },
    {
      "label": "Loan records",
      "changed": true,
      "detail": "The year column grows from 2 digits to 4.\nOld rows get a century by the same rule.",
      "arrow": {
        "label": "Read due dates",
        "detail": "The job now reads four-digit years."
      },
      "parts": [
        {
          "label": "Year column",
          "detail": "Grows from 2 characters to 4."
        },
        {
          "label": "Old rows",
          "detail": "Filled in once, by the same century rule."
        },
        {
          "label": "Index on due date",
          "detail": "Rebuilt after the fill."
        }
      ],
      "risks": [
        {
          "label": "Fill stops halfway",
          "detail": "Rows with two digits and rows with four would sit side by side."
        }
      ],
      "work": [
        {
          "id": "widen",
          "label": "Widen the year column",
          "detail": "Old programs still read the first two characters.",
          "phase": "Before",
          "owner": "Database"
        },
        {
          "id": "fill",
          "label": "Fill in old rows",
          "detail": "Run on a copy first and compare balances.",
          "phase": "Switch night",
          "owner": "Database",
          "needs": [
            "widen"
          ]
        }
      ]
    },
    {
      "label": "Nightly interest",
      "changed": true,
      "detail": "Counts days between dates.\nWith two digits, 2000 minus 1999 came out as −99 years.",
      "arrow": {
        "label": "Send entries",
        "detail": "Each interest entry carries a full year."
      },
      "work": [
        {
          "id": "interest",
          "label": "Read four-digit years",
          "detail": "Goes live the night the fill finishes.",
          "phase": "Switch night",
          "owner": "Batch",
          "needs": [
            "fill"
          ]
        }
      ]
    },
    {
      "label": "Statements",
      "changed": true,
      "detail": "Prints four-digit years.\nSorts by full year, so 2000 follows 1999.",
      "work": [
        {
          "id": "print",
          "label": "Print four digits",
          "detail": "The layout gains two characters per date.",
          "phase": "Switch night",
          "owner": "Reports",
          "needs": [
            "fill"
          ]
        },
        {
          "label": "Compare a month of statements",
          "detail": "Old and new runs must agree on every balance.",
          "phase": "After",
          "owner": "Reports",
          "needs": [
            "print",
            "interest"
          ]
        }
      ]
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
  ],
  "phases": [
    {
      "label": "Before",
      "when": "Any night"
    },
    {
      "label": "Switch night",
      "when": "One weekend"
    },
    {
      "label": "After",
      "when": "A month"
    }
  ]
}
```
<!-- /example -->
