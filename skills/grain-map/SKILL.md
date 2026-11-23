---
name: grain-map
description: Use when asked what one row of a table means, whether combining tables will repeat or double-count rows, or for a grain or cardinality check. Fills a hover-to-reveal HTML map of tables and how they match up.
---

# Grain map

1. For each table (2–5), work out what one row stands for and which columns make a row unique. Then list how the tables match up.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/grain-map/template.html ./<topic>-grain.html`
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
| `title` | The finding, in under 8 words ("A city is not an observation") |
| `summary` | One sentence: which combination is safe and which repeats rows |
| `tables` | 2–5 items `{id, label, grain, key, keyDetail, detail}`: `id` is one lowercase word; `grain` finishes "one row is…" ("one order line"); `key` is the columns that make a row unique ("order_id + line_no") |
| `links` | `{from, to, label, matches, detail}`: `from`/`to` are table ids; `label` is the match ("orders.id = lines.order_id"); `matches` is `one` or `many` partners per `from` row, or leave it out if unsure |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| one row is | grain |
| unique by | primary key, candidate key |
| at most one / can be many | cardinality, 1:N |
| rows repeat, sums double | fan-out |
| matched on | join condition |

## Example

<!-- example -->
```json
{
  "title": "A city is not an observation",
  "eyebrow": "PostgreSQL tutorial · grain review",
  "caption": "The same city can have several weather observations.",
  "tables": [
    {
      "id": "cities",
      "label": "cities",
      "grain": "One city",
      "key": "name",
      "keyDetail": "The tutorial does not enforce this; two cities with the same name would break it.",
      "detail": "San Francisco has one city row in the tutorial sample."
    },
    {
      "id": "weather",
      "label": "weather",
      "grain": "One city observation",
      "key": "city + date",
      "keyDetail": "Holds for this sample; two readings on one day would break it.",
      "detail": "San Francisco appears on two dates; Hayward appears once."
    }
  ],
  "links": [
    {
      "from": "cities",
      "to": "weather",
      "label": "name = city",
      "matches": "many",
      "detail": "The San Francisco city row pairs with two observations, repeating its location."
    },
    {
      "from": "weather",
      "to": "cities",
      "label": "city = name",
      "matches": "one",
      "detail": "Each reading finds at most one city. Hayward finds none.\nCheck city names are unique before relying on this."
    }
  ],
  "footnote": "Based on the tutorial sample; nothing here checks the real tables.",
  "sources": [
    {
      "label": "PostgreSQL · joins tutorial",
      "url": "https://www.postgresql.org/docs/current/tutorial-join.html"
    }
  ],
  "summary": "A weather row is one reading for one city on one day; joining to cities is safe, joining the other way repeats city rows."
}
```
<!-- /example -->
