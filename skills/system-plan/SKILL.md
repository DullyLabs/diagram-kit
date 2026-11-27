---
name: system-plan
description: Use when planning a large epic that reads from some systems, changes or builds one, and serves others, or when asked for a system context diagram. Fills an HTML diagram whose connections are faint at rest and light up, labelled, on hover, with a plain-language plan below.
---

# System plan

1. List what feeds the system, its parts, who it serves, and, if any, the people who run it and what checks that it works.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/system-plan/template.html ./<epic>-plan.html`
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
| `title` | The epic, in under 8 words |
| `summary` | One sentence: what the epic changes and for whom |
| `nodes` | `{id, lane, label, detail}`; `id` is one lowercase word; at most 4 per lane |
| `nodes[].lane` | One of `feeds`, `system` (exactly one node), `part` (parts of the system), `serves`, `runs` (people who run it), `checks` (what tells them it worked) |
| `nodes[].status` | One of `new`, `changed`, `unsure`. Leave it out for existing systems |
| `edges` | `{from, to, label, detail}` using node ids; `label` says what moves ("orders, every hour"). Link straight to a part when you know which part it touches |
| `lanes` | A heading for each lane that says what it is in this story, 40 characters at most: `{"feeds": "Where every answer starts", "serves": "Who waits on the totals"}`. Never "Inputs" or "Consumers" |
| `plan` | 3–5 steps in the order they must happen: `{label, detail, boxes}`; `boxes` lists the node ids the step touches |
| `nodes[].risks` | Optional: what can go wrong at this box, `{label, detail}` |
| `plan[].phase`, `owner`, `needs` | Optional, for a plan people will build from: `phase` is a name from `phases`, `owner` is who does it, `needs` lists the labels of steps that must finish first. Put the box the step mostly changes first in `boxes` |
| `phases` | Optional, with jobs: `{label, when, detail}` in order, such as "Build", "Switch", "Clean up" |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |
| `style` | Optional look tweaks: variables from the top of the template's `<style>`, such as `{"--radius": "8px", "--serif": "system-ui"}`. A colour set here applies in light and dark mode |

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| sends to / reads from | publishes to / consumes |
| asks for | calls, invokes |
| copy of | replica, mirror |
| shows | exposes, surfaces |
| owned by | stewarded by |
| not sure yet | TBD |

## Example

<!-- example -->
```json
{
  "title": "Counting a country",
  "eyebrow": "US Census · 1890",
  "caption": "The 1880 count took eight years to tabulate. This one took six.",
  "summary": "Holes in cards and electric dials take over from tally sheets, so the count that sets every state's seats in Congress lands years sooner.",
  "lanes": {
    "runs": "Hands on the machine",
    "feeds": "Where every answer starts",
    "system": "Inside the Hollerith machine",
    "serves": "Who waits on the totals",
    "checks": "How a clerk knows a card counted"
  },
  "footnote": "Please do not fold, spindle or mutilate the exhibit.",
  "sources": [
    {
      "label": "Census Bureau · the machine",
      "url": "https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html"
    },
    {
      "label": "Wikipedia · 1890 census",
      "url": "https://en.wikipedia.org/wiki/1890_United_States_census"
    }
  ],
  "nodes": [
    {
      "id": "schedules",
      "lane": "feeds",
      "label": "Census schedules",
      "detail": "Paper forms filled in door to door.",
      "risks": [
        {
          "label": "The paper burned in 1921",
          "detail": "A fire in the Commerce Department building destroyed or damaged most of the 1890 schedules.\nCongress let the rest be destroyed by 1935."
        }
      ]
    },
    {
      "id": "office",
      "lane": "feeds",
      "label": "Census Office",
      "detail": "Decides which totals to count."
    },
    {
      "id": "stock",
      "lane": "feeds",
      "label": "Blank cards",
      "detail": "Card stock cut to fit the punch and the reader."
    },
    {
      "id": "system",
      "lane": "system",
      "label": "Hollerith tabulating system",
      "detail": "Counts people by reading holes in cards with electricity."
    },
    {
      "id": "punch",
      "lane": "part",
      "label": "Pantograph punch",
      "detail": "A clerk turns one person's answers into holes in one card.\nAbout 500 cards a day.",
      "risks": [
        {
          "label": "A wrong hole is a wrong answer",
          "detail": "The reader counts whatever is punched.\nIt never sees the paper form."
        }
      ]
    },
    {
      "id": "reader",
      "lane": "part",
      "label": "Card reader",
      "detail": "Pins drop through the holes into cups of mercury.\nEach one closes a circuit."
    },
    {
      "id": "dials",
      "lane": "part",
      "label": "Dial counters",
      "detail": "Each closed circuit moves a dial forward by one."
    },
    {
      "id": "sort",
      "lane": "part",
      "label": "Sorting box",
      "detail": "A lid pops open.\nThe clerk drops the card in by hand.",
      "status": "new",
      "risks": [
        {
          "label": "Filed by hand",
          "detail": "A clerk can drop a card under the wrong lid."
        }
      ]
    },
    {
      "id": "clerks",
      "lane": "runs",
      "label": "Tabulator clerks",
      "detail": "Feed the cards in and copy down the dials.\nA practised clerk handled about 80 cards a minute."
    },
    {
      "id": "bell",
      "lane": "checks",
      "label": "Bell",
      "detail": "Rings when a card's circuit closes.\nThen the clerk copies down what the dials show."
    },
    {
      "id": "congress",
      "lane": "serves",
      "label": "House seats",
      "detail": "Congress divides seats among the states by population."
    },
    {
      "id": "reports",
      "lane": "serves",
      "label": "Census reports",
      "detail": "Printed volumes of tables."
    },
    {
      "id": "news",
      "lane": "serves",
      "label": "Newspapers",
      "detail": "Print the totals for everyone else.",
      "status": "unsure"
    }
  ],
  "edges": [
    {
      "from": "schedules",
      "to": "punch",
      "label": "Written answers",
      "detail": "Each person's answers are copied onto one card."
    },
    {
      "from": "office",
      "to": "system",
      "label": "What to count",
      "detail": "The office names the totals it needs."
    },
    {
      "from": "stock",
      "to": "punch",
      "label": "Blank cards",
      "detail": "One card per person: about 63 million."
    },
    {
      "from": "dials",
      "to": "congress",
      "label": "State totals",
      "detail": "Population by state decides each state's seats."
    },
    {
      "from": "dials",
      "to": "reports",
      "label": "Finished tables",
      "detail": "Clerks copy the dial readings into tables for print."
    },
    {
      "from": "system",
      "to": "news",
      "label": "Released figures",
      "detail": "Papers print the totals as they come out."
    },
    {
      "from": "punch",
      "to": "reader",
      "label": "Punched cards",
      "detail": "Fed in by hand, one at a time."
    },
    {
      "from": "reader",
      "to": "dials",
      "label": "Electric pulses",
      "detail": "One pulse for each hole read."
    },
    {
      "from": "reader",
      "to": "sort",
      "label": "Which lid",
      "detail": "The circuit picks the lid that opens."
    },
    {
      "from": "sort",
      "to": "reader",
      "label": "Second pass",
      "detail": "Sorted piles go through again for finer counts."
    },
    {
      "from": "clerks",
      "to": "system",
      "label": "Cards, one at a time",
      "detail": "Each card is laid on the reader and the press is closed by hand."
    },
    {
      "from": "reader",
      "to": "bell",
      "label": "One ring per card",
      "detail": "The circuit is complete."
    }
  ],
  "plan": [
    {
      "label": "Punch the cards",
      "detail": "Copy every person on the schedules onto a card.",
      "boxes": [
        "punch",
        "schedules",
        "stock"
      ],
      "phase": "Punch",
      "owner": "Punch clerks"
    },
    {
      "label": "Count the holes",
      "detail": "Feed the cards through. The dials add up.",
      "boxes": [
        "reader",
        "dials"
      ],
      "phase": "Count",
      "owner": "Machine clerks",
      "needs": [
        "Punch the cards"
      ]
    },
    {
      "label": "Sort and recount",
      "detail": "Regroup the cards to count combinations, such as age by state.",
      "boxes": [
        "sort",
        "reader"
      ],
      "phase": "Count",
      "owner": "Machine clerks",
      "needs": [
        "Count the holes"
      ]
    },
    {
      "label": "Publish the totals",
      "detail": "Copy the dial readings into tables and send them to print.",
      "boxes": [
        "reports",
        "office",
        "congress",
        "news"
      ],
      "phase": "Publish",
      "owner": "Census Office",
      "needs": [
        "Count the holes",
        "Sort and recount"
      ]
    }
  ],
  "phases": [
    {
      "label": "Punch",
      "detail": "One card per person."
    },
    {
      "label": "Count",
      "detail": "Every card through the reader, more than once."
    },
    {
      "label": "Publish",
      "detail": "Totals leave the building."
    }
  ]
}
```
<!-- /example -->
