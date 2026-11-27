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
  "title": "Four taps for an island with no rivers to spare",
  "eyebrow": "Singapore · water",
  "caption": "The Johor water deal ends in 2061. Everything below has to work before then.",
  "summary": "Singapore turns used water and seawater into most of its supply, so by 2060 recycled and desalinated water can meet up to 85% of needs.",
  "lanes": {
    "runs": "Who steers it",
    "feeds": "Where the water comes from",
    "system": "Inside the water loop",
    "serves": "Who turns on a tap",
    "checks": "How they know it's safe"
  },
  "footnote": "Please do not drink the exhibit.",
  "sources": [
    {
      "label": "MSE · water policy",
      "url": "https://www.mse.gov.sg/policies/water/"
    },
    {
      "label": "gov.sg · the 1962 Water Agreement",
      "url": "https://www.gov.sg/explainers/can-the-prices-in-the-1962-water-agreement-be-revised/"
    },
    {
      "label": "PUB · 2060 targets (2017)",
      "url": "https://www.nas.gov.sg/archivesonline/data/pdfdoc/20170220013/Press%20Statement%20on%20Water%20Price%20Revision_20Feb2017.pdf"
    },
    {
      "label": "PUB · deep tunnels, Dec 2025",
      "url": "https://www.pub.gov.sg/-/media/PUB/DTSS/PDF/DTSS2-Newsletter_Dec2025.pdf"
    },
    {
      "label": "PUB · 2024 and 2025 price rise",
      "url": "https://www.pub.gov.sg/Resources/News-Room/PressReleases/2023/09/Water-price-To-rise-from-April-2024-Government-to-provide-support"
    },
    {
      "label": "SFA · drinking water quality",
      "url": "https://sfa.gov.sg/food-retail/drinking-water-quality"
    }
  ],
  "nodes": [
    {
      "id": "pub",
      "lane": "runs",
      "label": "PUB",
      "detail": "The national water agency.\nIt plans, builds and runs every tap."
    },
    {
      "id": "price",
      "lane": "runs",
      "label": "The water price",
      "detail": "Up 20 cents a cubic metre in April 2024 and 30 more in April 2025, so each litre carries its real cost."
    },
    {
      "id": "rain",
      "lane": "feeds",
      "label": "Rain on two-thirds of the island",
      "detail": "About two-thirds of the land drains into reservoirs, through more than 8,000 km of drains and canals."
    },
    {
      "id": "johor",
      "lane": "feeds",
      "label": "Johor River",
      "detail": "The 1962 agreement lets Singapore draw up to 250 million gallons a day, at 3 sen per 1,000 gallons.",
      "risks": [
        {
          "label": "The deal ends in 2061",
          "detail": "After that, the island's own taps must carry the load."
        }
      ]
    },
    {
      "id": "sea",
      "lane": "feeds",
      "label": "The sea",
      "detail": "Never runs dry, but turning it into drinking water takes the most energy."
    },
    {
      "id": "used",
      "lane": "feeds",
      "label": "Every drain in the country",
      "detail": "Used water is collected, not thrown away.\nIt is the one source that grows with the city."
    },
    {
      "id": "loop",
      "lane": "system",
      "label": "PUB's water loop",
      "detail": "Collect, treat, use, reclaim, and use again."
    },
    {
      "id": "tunnels",
      "lane": "part",
      "label": "Deep tunnels",
      "status": "new",
      "detail": "Carry used water by gravity to the reclamation plants.\nPhase 2 was about 80% complete at the end of November 2025."
    },
    {
      "id": "newater",
      "lane": "part",
      "label": "NEWater factories",
      "detail": "Four factories clean reclaimed water until it is ultra-pure.\nUp to 55% of needs by 2060."
    },
    {
      "id": "desal",
      "lane": "part",
      "label": "Desalination plants",
      "detail": "Five plants today, a sixth being studied.\nUp to 30% of needs by 2060."
    },
    {
      "id": "reservoirs",
      "lane": "part",
      "label": "17 reservoirs and waterworks",
      "detail": "Hold rain and imported water, then treat it to drinking standard."
    },
    {
      "id": "homes",
      "lane": "serves",
      "label": "Homes",
      "detail": "About 45% of today's demand.\n141 litres a person a day in 2023."
    },
    {
      "id": "fabs",
      "lane": "serves",
      "label": "Wafer fabs and other industry",
      "detail": "About 55% of demand today, more than 60% by 2065.\nFabs are NEWater's biggest users."
    },
    {
      "id": "buyback",
      "lane": "serves",
      "label": "Johor, buying some back",
      "detail": "Singapore usually sells back 16 million gallons of treated water a day, at 50 sen per 1,000 gallons."
    },
    {
      "id": "tests",
      "lane": "checks",
      "label": "Drinking-water tests",
      "detail": "Samples are tested against Singapore's drinking-water rules, which follow WHO guidelines."
    }
  ],
  "edges": [
    {
      "from": "pub",
      "to": "loop",
      "label": "Plans, builds, runs",
      "detail": "One agency owns the whole loop, from drain to tap."
    },
    {
      "from": "price",
      "to": "homes",
      "label": "A cost on every litre",
      "detail": "Higher prices pay for the new plants and nudge use down."
    },
    {
      "from": "rain",
      "to": "reservoirs",
      "label": "Run-off after every storm",
      "detail": "Drains and canals steer rain into reservoirs."
    },
    {
      "from": "johor",
      "to": "reservoirs",
      "label": "Up to 250 million gallons a day",
      "detail": "Raw river water, under the 1962 agreement."
    },
    {
      "from": "sea",
      "to": "desal",
      "label": "Seawater",
      "detail": "Pumped in and pushed through membranes."
    },
    {
      "from": "used",
      "to": "tunnels",
      "label": "Everything down a drain",
      "detail": "Homes and factories alike."
    },
    {
      "from": "tunnels",
      "to": "newater",
      "label": "Used water, by gravity",
      "detail": "Cleaned first at the reclamation plants."
    },
    {
      "from": "newater",
      "to": "reservoirs",
      "label": "Topped up in dry spells",
      "detail": "NEWater is added to reservoirs when rain runs short."
    },
    {
      "from": "newater",
      "to": "fabs",
      "label": "Ultra-pure water",
      "detail": "Cleaner than tap water, which chipmaking needs."
    },
    {
      "from": "reservoirs",
      "to": "homes",
      "label": "Tap water",
      "detail": "Treated to drinking standard."
    },
    {
      "from": "desal",
      "to": "homes",
      "label": "Drinking water",
      "detail": "Joins the same pipes as reservoir water."
    },
    {
      "from": "loop",
      "to": "buyback",
      "label": "Treated water, sold back",
      "detail": "Johor may buy up to 2% of what Singapore draws."
    },
    {
      "from": "loop",
      "to": "tests",
      "label": "Samples from the network",
      "detail": "Checked against standards based on WHO guidelines."
    }
  ],
  "phases": [
    {
      "label": "Now",
      "when": "2024–2026",
      "detail": "Finish the tunnels, price water at its cost."
    },
    {
      "label": "By 2060",
      "detail": "Grow the taps that don't depend on rain or Johor."
    },
    {
      "label": "2061",
      "detail": "The Johor agreement ends."
    }
  ],
  "plan": [
    {
      "label": "Finish the deep tunnels",
      "detail": "Phase 2 was about 80% complete at 30 November 2025.",
      "boxes": [
        "tunnels",
        "used"
      ],
      "phase": "Now",
      "owner": "PUB"
    },
    {
      "label": "Open Tuas Water Reclamation Plant",
      "detail": "Treats 650,000 cubic metres of used water from homes and 150,000 from industry a day.",
      "boxes": [
        "tunnels"
      ],
      "phase": "Now",
      "owner": "PUB",
      "needs": [
        "Finish the deep tunnels"
      ]
    },
    {
      "label": "Price water at its cost",
      "detail": "Up 20 cents a cubic metre in 2024 and 30 more in 2025.",
      "boxes": [
        "price",
        "homes"
      ],
      "phase": "Now",
      "owner": "Government"
    },
    {
      "label": "Grow NEWater to 55%",
      "detail": "More reclaimed water, mostly for industry.",
      "boxes": [
        "newater",
        "fabs"
      ],
      "phase": "By 2060",
      "owner": "PUB",
      "needs": [
        "Open Tuas Water Reclamation Plant"
      ]
    },
    {
      "label": "Grow desalination to 30%",
      "detail": "A sixth plant is being studied.",
      "boxes": [
        "desal"
      ],
      "phase": "By 2060",
      "owner": "PUB"
    },
    {
      "label": "Be ready without Johor",
      "detail": "When the 1962 agreement ends, the island's own taps carry the load.",
      "boxes": [
        "johor",
        "reservoirs"
      ],
      "phase": "2061",
      "owner": "Government",
      "needs": [
        "Grow NEWater to 55%",
        "Grow desalination to 30%"
      ]
    }
  ]
}
```
<!-- /example -->
