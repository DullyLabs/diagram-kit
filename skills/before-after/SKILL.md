---
name: before-after
description: Use when asked what a big change (an epic, migration, rewrite or long branch) changed, or for a before/after comparison. Fills a hover-to-reveal HTML before-and-after.
---

# Before / after

1. Read the change (commits, diff, tickets) and group it into 3–6 themes. Hundreds of changes still make 3–6 themes.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/before-after/template.html ./<topic>-before-after.html`
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
| `title` | The change, in under 8 words |
| `summary` | One sentence: what is different for the people who use it |
| `themes` | 3–6 items, each `{label, before, change, after}` |
| `themes[].before`, `.after` | `{label, detail}`; labels mirror each other: "Nightly batch" and "Every 5 minutes" |
| `themes[].change` | `{label, detail}`: how it got there, 2–4 words ("Replaced the cron job") |
| `themes[].effect` | One of `better`, `worse`, `same`, `removed`. Leave it out if unsure |
| `unchanged` | A list of short names of what stayed the same; reviewers worry about this most |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |

## Words

Plain words, not jargon:

| Say | Not |
|---|---|
| slower / faster | regressed / optimized |
| moved | migrated, re-platformed |
| removed | deprecated, sunset |
| split into | decomposed, sharded |
| merged into | consolidated |
| works the same | backward compatible |

## Example

<!-- example -->
```json
{
  "title": "Same Mac. New machinery.",
  "eyebrow": "Mac · Intel to Apple silicon · 2020–2023",
  "caption": "Contents replaced. Case: untouched.",
  "footnote": "The MacBook Air's fan has left the collection.",
  "sources": [
    {
      "label": "Apple · M1 announcement",
      "url": "https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/"
    },
    {
      "label": "Apple · Rosetta",
      "url": "https://support.apple.com/en-us/102527"
    },
    {
      "label": "Apple · universal binaries",
      "url": "https://developer.apple.com/documentation/apple-silicon/building-a-universal-macos-binary"
    }
  ],
  "themes": [
    {
      "before": {
        "label": "Intel chips",
        "detail": "Intel made the Mac's main processor from 2006."
      },
      "change": {
        "label": "Swap the chip",
        "detail": "First M1 Macs: November 2020.\nLast to switch: Mac Pro, June 2023."
      },
      "after": {
        "label": "Apple silicon",
        "detail": "Apple designs the chip.\nProcessor, graphics and memory share one package."
      },
      "label": "Processor",
      "effect": "better"
    },
    {
      "before": {
        "label": "Ran directly",
        "detail": "Apps were built for Intel and ran on Intel."
      },
      "change": {
        "label": "Translate with Rosetta 2",
        "detail": "Rosetta 2 converts Intel apps to run on the new chips."
      },
      "after": {
        "label": "Most still run",
        "detail": "Most Intel apps work unchanged.\nKernel extensions and Intel virtual machines do not."
      },
      "label": "Old apps",
      "effect": "worse"
    },
    {
      "before": {
        "label": "Built for Intel",
        "detail": "One build, one chip family."
      },
      "change": {
        "label": "Ship universal apps",
        "detail": "One app file holds code for both chip families."
      },
      "after": {
        "label": "One download, both chips",
        "detail": "The Mac runs the half that fits. Nobody has to choose."
      },
      "label": "New apps",
      "effect": "better"
    },
    {
      "before": {
        "label": "12 hours of video",
        "detail": "Apple's rating for the early-2020 Intel MacBook Air."
      },
      "change": {
        "label": "Use less power",
        "detail": "Four fast cores for heavy work.\nFour frugal ones for everything else."
      },
      "after": {
        "label": "18 hours of video",
        "detail": "Apple's rating for the M1 MacBook Air.\nNo fan."
      },
      "label": "Battery",
      "effect": "better"
    },
    {
      "before": {
        "label": "Boot Camp",
        "detail": "Intel Macs could restart into Windows."
      },
      "change": {
        "label": "Drop Boot Camp",
        "detail": "Boot Camp needs an Intel chip. It was not carried over."
      },
      "after": {
        "label": "Virtual machine only",
        "detail": "Windows 11 for Arm runs inside apps such as Parallels."
      },
      "label": "Windows",
      "effect": "removed"
    }
  ],
  "unchanged": [
    "macOS",
    "Your files",
    "The aluminium case"
  ]
}
```
<!-- /example -->
