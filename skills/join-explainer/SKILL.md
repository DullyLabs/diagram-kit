---
name: join-explainer
description: Use when asked why a join, merge or lookup gained, lost or repeated rows, or how two tables combine. Fills a hover-to-reveal HTML table of matching values with row counts in and out.
---

# Join explainer

1. Find the two tables, the column they match on, and the kind of join. Pick 2–6 matching values that show what happens: one that matches once, one that repeats, one with no match.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/join-explainer/template.html ./<topic>-join.html`
   (If your skills live elsewhere, use that folder.)
   No shell or file tools? Reply with only your JSON and tell the user to paste it over `{"title":"REPLACE_ME"}` in a copy of `template.html`.
3. In the copy, replace `{"title":"REPLACE_ME"}` with your JSON, shaped exactly like the example below. Change nothing else in the file.
4. Check before you finish:
   - valid JSON: double quotes, no trailing commas, no comments;
   - every box and arrow has a `label` (40 characters at most) and a `detail` (200 at most, split lines with `\n`);
   - plain text only: no HTML, no markdown, no backticks;
   - a name you are not sure of ends with `(guess)`.
5. Tell the user the file path and ask them to open it in a browser. You cannot open it yourself.

Write for a reader who is new to this: every word must help them understand the content, so cut anything else and never explain how to use the page.

## Fields

| Field | What to write |
|---|---|
| `title` | The question the reader has, in under 8 words ("Where did Hayward go?") |
| `summary` | One sentence: which rows repeat or disappear, and why |
| `left`, `right` | The two table names |
| `join` | One of `inner`, `left`, `right`, `full`. Leave it out if unsure (means `inner`) |
| `condition` | The match, copied from the SQL ("orders.customer_id = customers.id") |
| `groups` | 2–6 items `{label, left, right, detail}`: `label` is a matching value; `left` and `right` are whole-number row counts with that value in each table; `detail` says what happens to those rows |
| `groups[].risks` | Optional: what goes wrong for these rows later, `{label, detail}` |
| `groups[].work` | Optional jobs that fix it: `{label, detail, phase, owner, needs}`; `phase` is a name from `phases`; `needs` lists the labels of jobs that must finish first |
| `phases` | Optional, with jobs: `{label, when, detail}` in order, such as "Build", "Switch", "Clean up" |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |
| `style` | Optional look tweaks: variables from the top of the template's `<style>`, such as `{"--radius": "8px", "--serif": "system-ui"}`. A colour set here applies in light and dark mode |

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| combine tables | join |
| matched on | join key, predicate |
| rows repeat | fan-out, cartesian |
| disappears | dropped by inner join |
| kept with blanks | NULL-padded |

## Example

<!-- example -->
```json
{
  "title": "Where did Hayward go?",
  "eyebrow": "PostgreSQL tutorial · sample rows",
  "caption": "Hayward left without saying goodbye.",
  "left": "weather",
  "right": "cities",
  "join": "inner",
  "condition": "weather.city = cities.name",
  "groups": [
    {
      "label": "San Francisco",
      "left": 2,
      "right": 1,
      "detail": "Two weather observations, dated 1994-11-27 and 1994-11-29, match one city row.",
      "risks": [
        {
          "label": "Location repeats",
          "detail": "The city's location appears on both rows.\nCount cities from this result and San Francisco counts twice."
        }
      ]
    },
    {
      "label": "Hayward",
      "left": 1,
      "right": 0,
      "detail": "This weather row has no city to match, so it disappears.\nSet \"join\" to \"left\" to keep it.",
      "risks": [
        {
          "label": "Lost without an error",
          "detail": "Nothing warns that a reading is missing from the result."
        }
      ],
      "work": [
        {
          "label": "Keep unmatched readings",
          "detail": "Use a left join where every reading must show.",
          "phase": "Now",
          "owner": "Query"
        },
        {
          "label": "Add Hayward to cities",
          "detail": "Give the reading a city to match.",
          "phase": "Now",
          "owner": "Data"
        },
        {
          "label": "Reject unknown cities",
          "detail": "A foreign key stops a reading for a city that is not listed.",
          "phase": "Next",
          "owner": "Schema",
          "needs": [
            "Add Hayward to cities"
          ]
        }
      ]
    }
  ],
  "footnote": "Counts come from the tutorial sample, not a live database.",
  "sources": [
    {
      "label": "PostgreSQL · joins tutorial",
      "url": "https://www.postgresql.org/docs/current/tutorial-join.html"
    },
    {
      "label": "PostgreSQL · foreign keys",
      "url": "https://www.postgresql.org/docs/current/tutorial-fk.html"
    }
  ],
  "summary": "Combining weather with cities keeps San Francisco twice and drops Hayward, because Hayward has no city row.",
  "phases": [
    {
      "label": "Now"
    },
    {
      "label": "Next"
    }
  ]
}
```
<!-- /example -->
