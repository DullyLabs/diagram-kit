---
name: gantt-chart
description: Use when asked for a Gantt chart, a schedule, a timeline or a roadmap, or when the work is a list of tasks with dates. Fills an HTML chart of bars on a calendar, with gates, a today line and lines between tasks that wait on each other.
---

# Gantt chart

1. List the tasks in the order they start. For each, find its start date, its end date, and the tasks that must finish first.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/gantt-chart/template.html ./<project>-gantt.html`
   (If your skills live elsewhere, use that folder.)
   No shell or file tools? Reply with only your JSON and tell the user to paste it over `{"title":"REPLACE_ME"}` in a copy of `template.html`.
3. In the copy, replace `{"title":"REPLACE_ME"}` with your JSON, shaped exactly like the example below. Change nothing else in the file.
4. Check before you finish:
   - valid JSON: double quotes, no trailing commas, no comments;
   - every date is `YYYY-MM-DD`, and no `end` is before its `start`;
   - every task has a `label` (40 characters at most) and a `detail` (200 at most, split lines with `\n`);
   - every name in `needs` is the exact `label` of another task;
   - plain text only: no HTML, no markdown, no backticks.
5. Tell the user the file path and ask them to open it in a browser. You cannot open it yourself.

Write for a reader who is new to this: every word must help them understand the content, so cut anything else and never explain how to use the page.

## Fields

| Field | What to write |
|---|---|
| `title` | The project, in under 8 words |
| `summary` | One sentence: what gets done, and by when |
| `tasks` | 3–20 of `{label, detail, start, end}`, in the order they start |
| `tasks[].start`, `end` | First and last day of the work, `YYYY-MM-DD`. A task with only `end` is a gate: one day, drawn as a diamond |
| `tasks[].kind` | Optional: a name from `kinds`. Same kind, same colour |
| `tasks[].gate` | Optional: `true` when the end of this task is a deadline, a demo or a sign-off |
| `tasks[].needs` | Optional: labels of the tasks that must finish first |
| `tasks[].owner` | Optional: who does it |
| `tasks[].done` | Optional: `true`, or how much is finished from `0` to `100` |
| `tasks[].risks` | Optional: what can go wrong, `{label, detail}` |
| `kinds` | Optional: at most 6 of `{label, detail}`, such as "Build", "Review", "Ship" |
| `today` | Optional: today's date, `YYYY-MM-DD`. Leave it out if you do not know it |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |
| `style` | Optional look tweaks: variables from the top of the template's `<style>`, such as `{"--radius": "8px", "--serif": "system-ui"}`. A colour set here applies in light and dark mode |

Never add tasks to fill a gap in the calendar: the chart folds long empty stretches by itself.

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| needs | is blocked by, depends on |
| gate | milestone, checkpoint |
| done | completed, delivered |
| late | slipped, at risk |
| not sure yet | TBD |

## Example

<!-- example -->
```json
{
  "title": "A skyscraper, twelve days early",
  "eyebrow": "Empire State Building · 1929–1931",
  "summary": "The world's tallest building went from first steel to open doors in thirteen months, and finished ahead of plan.",
  "today": "1930-07-27",
  "kinds": [
    {
      "label": "Ground",
      "detail": "Clearing the site and digging down to rock."
    },
    {
      "label": "Paper",
      "detail": "Contracts that had to be signed before anything could rise."
    },
    {
      "label": "Steel",
      "detail": "The frame, at four and a half floors a week."
    },
    {
      "label": "Finishing",
      "detail": "Everything after the frame: mast, interiors, opening day."
    }
  ],
  "tasks": [
    {
      "label": "Start tearing down the hotel",
      "end": "1929-10-01",
      "kind": "Ground",
      "owner": "Starrett Brothers and Eken",
      "done": true,
      "detail": "The old Waldorf-Astoria stood on the site.\nIt closed in May 1929."
    },
    {
      "label": "Award the steel contract",
      "end": "1930-01-12",
      "kind": "Paper",
      "owner": "Empire State Inc.",
      "done": true,
      "detail": "57,480 tons of it."
    },
    {
      "label": "Dig the foundations",
      "start": "1930-01-22",
      "end": "1930-03-17",
      "kind": "Ground",
      "owner": "Starrett Brothers and Eken",
      "done": true,
      "needs": [
        "Start tearing down the hotel"
      ],
      "detail": "Two shifts of 300 men dig 55 feet down, around the clock.",
      "risks": [
        {
          "label": "The hotel is still coming down",
          "detail": "Digging began before the old hotel had been completely demolished."
        }
      ]
    },
    {
      "label": "Raise the steel frame",
      "start": "1930-04-01",
      "end": "1930-09-19",
      "kind": "Steel",
      "owner": "Starrett Brothers and Eken",
      "gate": true,
      "done": 50,
      "needs": [
        "Award the steel contract",
        "Dig the foundations"
      ],
      "detail": "Half the frame is up by 27 July.\nIt tops out twelve days ahead of schedule.",
      "risks": [
        {
          "label": "Five workers died",
          "detail": "The official count for the whole build. Newspapers of the day reported more."
        }
      ]
    },
    {
      "label": "Steel reaches floor 26",
      "end": "1930-06-20",
      "kind": "Steel",
      "done": true,
      "detail": "Eleven weeks after the first column went in."
    },
    {
      "label": "Top out the mooring mast",
      "start": "1930-09-19",
      "end": "1930-11-21",
      "kind": "Finishing",
      "gate": true,
      "needs": [
        "Raise the steel frame"
      ],
      "detail": "Work on the mast starts once the steel tops out."
    },
    {
      "label": "Finish the building",
      "start": "1930-09-19",
      "end": "1931-04-11",
      "kind": "Finishing",
      "gate": true,
      "needs": [
        "Raise the steel frame"
      ],
      "detail": "Complete twelve days ahead of schedule, 410 days after construction began."
    },
    {
      "label": "Open the doors",
      "end": "1931-05-01",
      "kind": "Finishing",
      "owner": "Empire State Inc.",
      "needs": [
        "Finish the building"
      ],
      "detail": "Forty-five days ahead of the planned opening.",
      "risks": [
        {
          "label": "Nobody to rent it",
          "detail": "Only 23 percent of the space was let in the first year.\nNew Yorkers called it the Empty State Building."
        }
      ]
    }
  ],
  "footnote": "Under budget, too. Please do not show this page to your project manager.",
  "sources": [
    {
      "label": "Wikipedia · Empire State Building",
      "url": "https://en.wikipedia.org/wiki/Empire_State_Building"
    }
  ]
}
```
<!-- /example -->
