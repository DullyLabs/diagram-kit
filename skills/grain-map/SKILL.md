---
name: grain-map
description: Use when asked what one row of a table means, whether combining tables will repeat or double-count rows, or for a grain or cardinality check. Fills a hover-to-reveal HTML map of tables and how they match up.
---

# Grain map

1. For each table (2–5), work out what one row stands for and which columns make a row unique. Then list how the tables match up.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/grain-map/template.html ./<topic>-grain.html`
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
| `title` | The finding, in under 8 words ("A city is not an observation") |
| `summary` | One sentence: which combination is safe and which repeats rows |
| `tables` | 2–5 items `{id, label, grain, key, keyDetail, detail}`: `id` is one lowercase word; `grain` finishes "one row is…" ("one order line"); `key` is the columns that make a row unique ("order_id + line_no"); `keyDetail` says how sure that is ("not enforced by the database") |
| `links` | `{from, to, label, matches, detail}`: `from`/`to` are table ids; `label` is the match ("orders.id = lines.order_id"); `matches` is `one` or `many` partners per `from` row, or leave it out if unsure |
| `tables[].parts` | Optional: the 2–5 columns worth knowing, `{label, detail}` |
| `tables[].risks` | Optional: what would break this table's key or its matches, `{label, detail}` |
| `tables[].work` | Optional jobs that fix it: `{label, detail, phase, owner, needs}`; `phase` is a name from `phases`; `needs` lists the labels of jobs that must finish first |
| `phases` | Optional, with jobs: `{label, when, detail}` in order, such as "Build", "Switch", "Clean up" |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |
| `style` | Optional look tweaks: variables from the top of the template's `<style>`, such as `{"--radius": "8px", "--serif": "system-ui"}`. A colour set here applies in light and dark mode |

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
      "detail": "San Francisco has one city row in the tutorial sample.",
      "parts": [
        {
          "label": "name",
          "detail": "Text, up to 80 characters."
        },
        {
          "label": "location",
          "detail": "A point: two numbers for where the city is."
        }
      ],
      "risks": [
        {
          "label": "Two cities, one name",
          "detail": "Nothing stops a second San Francisco row.\nEvery reading would then match both."
        }
      ],
      "work": [
        {
          "label": "Make name the key",
          "detail": "The tutorial's next chapter declares name as the primary key.",
          "phase": "First",
          "owner": "Schema"
        }
      ]
    },
    {
      "id": "weather",
      "label": "weather",
      "grain": "One city observation",
      "key": "city + date",
      "keyDetail": "Holds for this sample; two readings on one day would break it.",
      "detail": "San Francisco appears on two dates; Hayward appears once.",
      "parts": [
        {
          "label": "city",
          "detail": "Text; meant to match cities.name."
        },
        {
          "label": "temp_lo, temp_hi",
          "detail": "Low and high temperature, whole numbers."
        },
        {
          "label": "prcp",
          "detail": "Precipitation."
        },
        {
          "label": "date",
          "detail": "The day of the reading."
        }
      ],
      "risks": [
        {
          "label": "A reading with no city",
          "detail": "Hayward has a weather row and no city row."
        }
      ],
      "work": [
        {
          "label": "Point city at cities",
          "detail": "A foreign key rejects a reading for a city that is not listed.",
          "phase": "Then",
          "owner": "Schema",
          "needs": [
            "Make name the key"
          ]
        }
      ]
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
    },
    {
      "label": "PostgreSQL · creating a table",
      "url": "https://www.postgresql.org/docs/current/tutorial-table.html"
    },
    {
      "label": "PostgreSQL · foreign keys",
      "url": "https://www.postgresql.org/docs/current/tutorial-fk.html"
    }
  ],
  "summary": "A weather row is one reading for one city on one day; joining to cities is safe, joining the other way repeats city rows.",
  "phases": [
    {
      "label": "First"
    },
    {
      "label": "Then"
    }
  ]
}
```
<!-- /example -->
