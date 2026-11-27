---
name: before-after
description: Use when asked what a big change (an epic, migration, rewrite or long branch) changed, or for a before/after comparison. Fills a hover-to-reveal HTML before-and-after.
---

# Before / after

1. Read the change (commits, diff, tickets) and group it into 3–6 themes. Hundreds of changes still make 3–6 themes. For an audience that will build the change, also list each theme's parts, risks and jobs, and what each job needs first.
2. Copy the template with one shell command. Never retype or rewrite it:
   `cp ~/.config/opencode/skills/before-after/template.html ./<topic>-before-after.html`
   (If your skills live elsewhere, use that folder.)
   No shell or file tools? Reply with only your JSON and tell the user to paste it over `{"title":"REPLACE_ME"}` in a copy of `template.html`.
3. In the copy, replace `{"title":"REPLACE_ME"}` with your JSON, shaped exactly like the example below. Change nothing else in the file.
4. Check before you finish:
   - valid JSON: double quotes, no trailing commas, no comments;
   - every box and arrow has a `label` (40 characters at most) and a `detail` (200 at most, split lines with `\n`);
   - plain text only: no HTML, no markdown, no backticks;
   - a name you are not sure of ends with `(guess)`.
5. Tell the user the file path and ask them to open it in a browser. You cannot open it yourself.

Write for a busy reader who must get up to speed: every word must help them understand the content, so cut anything else and never explain how to use the page. The title says plainly what the page covers; no teasers, puns or jokes.

## Fields

| Field | What to write |
|---|---|
| `title` | The change, in under 8 words |
| `summary` | One sentence: what is different for the people who use it |
| `themes` | 3–6 items, each `{label, before, change, after}` |
| `themes[].before`, `.after` | `{label, detail}`; labels mirror each other: "Nightly batch" and "Every 5 minutes" |
| `themes[].change` | `{label, detail}`: how it got there, 2–4 words ("Replaced the cron job") |
| `themes[].effect` | One of `better`, `worse`, `same`, `removed`. Leave it out if unsure |
| `themes[].parts` | Optional, for readers who will build it: the pieces inside a theme, each `{label, before, after}` |
| `themes[].risks` | Optional: what could go wrong in this theme, each `{label, detail}` |
| `themes[].work` | Optional: the jobs that deliver this theme, each `{id, label, detail, phase, owner, needs}`; `needs` lists the `id`s of jobs (in any theme) that must finish first |
| `phases` | Needed with `work`: the stages in order, each `{label, when, detail}`; a job's `phase` is one of these labels |
| `unchanged` | A list of short names of what stayed the same; reviewers worry about this most |
| `eyebrow`, `caption`, `footnote`, `sources` | Optional; leave out if unsure |
| `style` | Optional look tweaks: variables from the top of the template's `<style>`, such as `{"--radius": "8px", "--serif": "system-ui"}`. A colour set here applies in light and dark mode |

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
  "title": "Mac move from Intel to Apple silicon",
  "eyebrow": "Mac · Intel to Apple silicon · 2020–2023",
  "caption": "What changed inside the Mac from 2020 to 2023, and what stayed the same.",
  "sources": [
    {
      "label": "Apple · the announcement, 2020",
      "url": "https://www.apple.com/newsroom/2020/06/apple-announces-mac-transition-to-apple-silicon/"
    },
    {
      "label": "Apple · M1",
      "url": "https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/"
    },
    {
      "label": "Apple · Rosetta",
      "url": "https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment"
    },
    {
      "label": "Apple · universal binaries",
      "url": "https://developer.apple.com/documentation/apple-silicon/building-a-universal-macos-binary"
    },
    {
      "label": "Apple · Mac Pro, 2023",
      "url": "https://www.apple.com/newsroom/2023/06/apple-unveils-new-mac-studio-and-brings-apple-silicon-to-mac-pro/"
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
      "effect": "better",
      "parts": [
        {
          "label": "Graphics",
          "before": "Intel or AMD graphics",
          "after": "Inside the M1"
        },
        {
          "label": "Memory",
          "before": "Split between processor and graphics",
          "after": {
            "label": "One shared pool",
            "detail": "Apple calls it unified memory."
          }
        },
        {
          "label": "Security chip",
          "before": {
            "label": "Separate T2 chip",
            "detail": "In Macs from 2017."
          },
          "after": {
            "label": "Inside the M1",
            "detail": "The Secure Enclave is part of the chip."
          }
        }
      ],
      "risks": [
        {
          "label": "Pro Macs take longer",
          "detail": "Apple expected about two years from June 2020.\nThe Mac Pro switched in June 2023."
        }
      ],
      "work": [
        {
          "id": "chips",
          "label": "iPhone and iPad chips",
          "phase": "Groundwork",
          "owner": "Apple · chips",
          "detail": "Apple has designed its own phone chips since the A4 in 2010."
        },
        {
          "id": "m1",
          "label": "M1",
          "phase": "First Macs",
          "owner": "Apple · chips",
          "needs": [
            "chips"
          ],
          "detail": "Four fast cores, four frugal ones, graphics and memory in one package."
        },
        {
          "id": "pro",
          "label": "M1 Pro, Max and Ultra",
          "phase": "Pro Macs",
          "owner": "Apple · chips",
          "needs": [
            "m1"
          ],
          "detail": "More cores and memory for MacBook Pro and Mac Studio."
        },
        {
          "id": "ultra",
          "label": "M2 Ultra",
          "phase": "Finish",
          "owner": "Apple · chips",
          "needs": [
            "pro"
          ],
          "detail": "Powers the Mac Pro, the last Mac to switch."
        }
      ]
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
      "effect": "worse",
      "parts": [
        {
          "label": "64-bit Intel apps",
          "before": "Ran directly",
          "after": "Translated by Rosetta 2"
        },
        {
          "label": "Kernel extensions",
          "before": "Loaded as built",
          "after": {
            "label": "Must be rebuilt",
            "detail": "Rosetta 2 does not translate them."
          }
        },
        {
          "label": "Intel virtual machines",
          "before": "Ran Intel systems",
          "after": {
            "label": "Not supported",
            "detail": "Rosetta 2 does not translate apps that virtualise Intel computers."
          }
        }
      ],
      "risks": [
        {
          "label": "Kernel extensions break",
          "detail": "Drivers and security tools built as kernel extensions need new versions."
        }
      ],
      "work": [
        {
          "id": "sixtyfour",
          "label": "Drop 32-bit apps",
          "phase": "Groundwork",
          "owner": "Apple · macOS",
          "detail": "macOS Catalina (2019) runs only 64-bit apps.\nRosetta 2 translates only 64-bit Intel apps."
        },
        {
          "id": "rosetta",
          "label": "Rosetta 2",
          "phase": "First Macs",
          "owner": "Apple · macOS",
          "needs": [
            "sixtyfour",
            "m1"
          ],
          "detail": "Translates an Intel app before it runs."
        }
      ]
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
      "effect": "better",
      "parts": [
        {
          "label": "App file",
          "before": "Intel code only",
          "after": "Intel and Arm code together"
        }
      ],
      "risks": [
        {
          "label": "Apps slow to rebuild",
          "detail": "Until its developer rebuilds it, an app runs through Rosetta 2."
        }
      ],
      "work": [
        {
          "id": "xcode",
          "label": "Xcode 12, universal apps",
          "phase": "Announce",
          "owner": "Apple · tools",
          "detail": "Xcode 12 builds one app for both chip families."
        },
        {
          "id": "dtk",
          "label": "Developer Transition Kit",
          "phase": "Announce",
          "owner": "Apple · hardware",
          "needs": [
            "chips"
          ],
          "detail": "A Mac mini with the iPad's A12Z chip, lent to developers."
        },
        {
          "id": "rebuild",
          "label": "Developers rebuild apps",
          "phase": "First Macs",
          "owner": "App developers",
          "needs": [
            "xcode",
            "dtk"
          ],
          "detail": "Rebuild in Xcode 12, then test on the kit or an M1 Mac."
        }
      ]
    },
    {
      "label": "iPhone apps",
      "effect": "better",
      "before": {
        "label": "Not on the Mac",
        "detail": "An iPhone app needed a separate Mac version."
      },
      "change": {
        "label": "Share the chip family",
        "detail": "Mac, iPhone and iPad now use the same kind of chip."
      },
      "after": {
        "label": "Run unmodified",
        "detail": "Developers can offer iPhone and iPad apps on the Mac without changing them."
      },
      "work": [
        {
          "id": "iosapps",
          "label": "iPhone apps on the Mac",
          "phase": "First Macs",
          "owner": "Apple · App Store",
          "needs": [
            "m1"
          ],
          "detail": "iPhone and iPad apps appear in the Mac App Store."
        }
      ]
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
      "effect": "better",
      "parts": [
        {
          "label": "Fan",
          "before": "One fan",
          "after": "No fan"
        },
        {
          "label": "Cores",
          "before": "Every core alike",
          "after": "4 fast, 4 frugal"
        }
      ],
      "work": [
        {
          "id": "fanless",
          "label": "MacBook Air with no fan",
          "phase": "First Macs",
          "owner": "Apple · hardware",
          "needs": [
            "m1"
          ],
          "detail": "The M1 MacBook Air is silent."
        }
      ]
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
      "effect": "removed",
      "risks": [
        {
          "label": "Intel Windows does not run",
          "detail": "Only Windows built for Arm chips runs, and only in a virtual machine."
        }
      ],
      "work": [
        {
          "id": "virt",
          "label": "Arm virtual machines",
          "phase": "First Macs",
          "owner": "Apple · macOS",
          "needs": [
            "m1"
          ],
          "detail": "macOS Big Sur lets apps run virtual machines built for Arm chips."
        },
        {
          "id": "winarm",
          "label": "Windows 11 for Arm",
          "phase": "Pro Macs",
          "owner": "Parallels, Microsoft",
          "needs": [
            "virt"
          ],
          "detail": "Runs inside Parallels Desktop."
        }
      ]
    }
  ],
  "unchanged": [
    "macOS",
    "Your files",
    "The aluminium case"
  ],
  "summary": "Apple replaces the Mac's Intel processor with its own chips. Apps keep running while developers rebuild them.",
  "phases": [
    {
      "label": "Groundwork",
      "when": "2010–2019",
      "detail": "Apple designs chips for iPhone and iPad, and clears old code out of macOS."
    },
    {
      "label": "Announce",
      "when": "June 2020",
      "detail": "Apple tells developers and lends them test machines.\nIt expects the move to take about two years."
    },
    {
      "label": "First Macs",
      "when": "November 2020",
      "detail": "MacBook Air, 13-inch MacBook Pro and Mac mini ship with the M1 and macOS Big Sur."
    },
    {
      "label": "Pro Macs",
      "when": "2021–2022",
      "detail": "iMac, the larger MacBook Pros and Mac Studio follow."
    },
    {
      "label": "Finish",
      "when": "June 2023",
      "detail": "Mac Pro moves to the M2 Ultra.\nApple no longer sells an Intel Mac."
    }
  ]
}
```
<!-- /example -->
