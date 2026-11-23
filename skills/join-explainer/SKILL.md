---
name: join-explainer
description: Use when asked why a join, merge or lookup gained, lost or repeated rows, or how two tables combine. Fills a hover-to-reveal HTML table of matching values with row counts in and out.
---

# Join explainer

1. Find the two tables, the column they match on, and the kind of join. Pick 2–6 matching values that show what happens: one that matches once, one that repeats, one with no match.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/join-explainer/template.html ./<topic>-join.html`
   (If your skills live elsewhere, use that folder. No shell? Ask the user to run the command.)
3. In the copy, replace `{"title":"REPLACE_ME"}` with your JSON, shaped exactly like the example below. Change nothing else in the file.
4. Check before you finish:
   - valid JSON: double quotes, no trailing commas, no comments;
   - every item has a `label` (40 characters at most) and a `detail` (200 at most, split lines with `\n`);
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
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |

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
      "detail": "Two weather observations, dated 1994-11-27 and 1994-11-29, match one city row."
    },
    {
      "label": "Hayward",
      "left": 1,
      "right": 0,
      "detail": "This weather row has no city to match, so it disappears.\nSet \"join\" to \"left\" to keep it."
    }
  ],
  "footnote": "Counts come from the tutorial sample, not a live database.",
  "sources": [
    {
      "label": "PostgreSQL · joins tutorial",
      "url": "https://www.postgresql.org/docs/current/tutorial-join.html"
    }
  ],
  "summary": "Combining weather with cities keeps San Francisco twice and drops Hayward, because Hayward has no city row."
}
```
<!-- /example -->
