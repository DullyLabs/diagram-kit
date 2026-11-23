# Checks

Run outside any sandbox (Chrome needs it).

```
python3 src/build.py --example /tmp/dk-ex
python3 test/sloppy.py /tmp/dk-ex /tmp/dk-sloppy && python3 test/check.py /tmp/dk-sloppy
python3 test/check.py /tmp/dk-ex
python3 test/placement.py /tmp/dk-ex   # % of each popover covering other items; lower is better
```

<<<<<<< HEAD
Every fixture must load with no console error; broken JSON must show the on-page message.

Popover placement: `python3 test/placement.py 1200x900 800x700` prints how much of each popover covers other items (lower is better).
=======
Every page must load with no console error; broken JSON must show the on-page message.
>>>>>>> 35898fe (feat: one shared source builds all templates; colour roles, schema in SKILL.md, read marks, deep links, copy as Markdown)
