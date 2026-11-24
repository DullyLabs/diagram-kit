---
name: diagram-kit
description: Use first in this repo. Says which skill to read, by what you are here to do - draw a diagram from data, or change the kit.
---

# diagram-kit

| You are | Read |
|---|---|
| A model asked to explain something as a diagram | Pick one row below, then follow only that skill |
| An agent changing a template, adding a diagram type or editing these skills | [maintain-diagram-kit](.claude/skills/maintain-diagram-kit/SKILL.md) |

## Pick by the shape of your data

| Your data is | Skill |
|---|---|
| Steps that happen in order, with branches | [flow-diagram](skills/flow-diagram/SKILL.md) |
| One thing in two states: how it was and how it will be, optionally with parts, risks, and jobs by phase | [before-after](skills/before-after/SKILL.md) |
| A code change that moves data, with sample rows and things to check | [pr-explainer](skills/pr-explainer/SKILL.md) |
| Systems that feed yours and systems yours feeds, plus the order of work | [system-plan](skills/system-plan/SKILL.md) |
| Two tables joined, and rows that were gained, lost or repeated | [join-explainer](skills/join-explainer/SKILL.md) |
| Tables where one row means different things | [grain-map](skills/grain-map/SKILL.md) |

If two fit, make two pages. Every skill works the same way: copy its `template.html`, replace the JSON block, change nothing else.
