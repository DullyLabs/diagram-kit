---
name: flow-diagram
description: Use when asked to explain how some code, job or process works step by step, or for a flowchart or flow diagram. Fills a hover-to-reveal HTML flow.
---

# Flow diagram

1. Read the code until you can tell it in 4–8 steps, in the order they happen.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/flow-diagram/template.html ./<topic>-flow.html`
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
| `title` | What the flow does, in under 8 words |
| `summary` | One sentence: what goes in and what comes out |
| `steps` | 4–8 items: `label` starts with a verb ("Check the order"), `detail` says what happens and why |
| `steps[].kind` | One of `fetch`, `check`, `change`, `save`, `send`, `stop`. Leave it out if unsure |
| `steps[].phase` | Optional group name, the same on neighbouring steps ("Load", "Clean") |
| `steps[].arrow` | `{label, detail}`: what moves to the next step ("the cleaned rows"). Leave out on the last step |
| `steps[].branch` | At most one in the whole flow: `{label, detail, arrow}` for a side exit, like an error path |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| check | validate, assert |
| send | dispatch, emit, publish |
| save | persist, commit |
| fetch | retrieve, query, ingest |
| turn into | transform, map, serialize |
| keeps trying | retries with backoff |
| gives up | throws, fails fast |

## Example

<!-- example -->
```json
{
  "title": "A landing, in six moves",
  "eyebrow": "Apollo 11 · 20 July 1969",
  "caption": "Please do not press the abort button.",
  "footnote": "The descent stage is still on display at the site. No visiting hours.",
  "sources": [
    {
      "label": "NASA · landing transcript",
      "url": "https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.landing.html"
    },
    {
      "label": "NASA · Apollo by the Numbers",
      "url": "https://www.nasa.gov/wp-content/uploads/2023/04/sp-4029.pdf"
    }
  ],
  "steps": [
    {
      "label": "Eagle undocks",
      "detail": "The lander leaves Columbia, the ship that stays in orbit.",
      "arrow": {
        "label": "Look it over",
        "detail": "Collins checks Eagle from Columbia's window."
      },
      "kind": "send",
      "phase": "Leave orbit"
    },
    {
      "label": "Lower the orbit",
      "detail": "A 30-second burn behind the Moon.\nThe low point drops to about 15 km.",
      "arrow": {
        "label": "Coast down",
        "detail": "About an hour of falling, engine off."
      },
      "kind": "change",
      "phase": "Leave orbit"
    },
    {
      "label": "Powered descent",
      "detail": "The engine fires again to brake.\nTwelve minutes to the surface.",
      "arrow": {
        "label": "Computer falls behind",
        "detail": "A radar that isn't needed keeps sending it work."
      },
      "kind": "change",
      "phase": "Land"
    },
    {
      "label": "1202 and 1201 alarms",
      "detail": "The computer is overloaded.\nIt drops minor jobs and keeps steering.\nMission Control says go.",
      "branch": {
        "label": "Abort to orbit",
        "detail": "Not taken.\nEagle would have climbed back to Columbia.",
        "arrow": {
          "label": "If steering stops",
          "detail": "A computer that stopped guiding meant an abort."
        }
      },
      "arrow": {
        "label": "Keep going",
        "detail": "Eagle tips upright. The crew can see the ground."
      },
      "kind": "check",
      "phase": "Land"
    },
    {
      "label": "Armstrong takes over",
      "detail": "The autopilot is heading for a crater full of boulders.\nHe flies past it.",
      "arrow": {
        "label": "Find flat ground",
        "detail": "Low-fuel calls count down while he looks."
      },
      "kind": "change",
      "phase": "Land"
    },
    {
      "label": "Eagle touches down",
      "detail": "Sea of Tranquility, 20:17 UTC.\nUnder a minute of fuel left.",
      "kind": "stop",
      "phase": "Land"
    }
  ],
  "summary": "How Eagle got from orbit to the surface, and the alarm that nearly stopped it."
}
```
<!-- /example -->
