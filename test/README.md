# Sloppy-JSON checks

```
python3 test/sloppy.py . /tmp/sloppy && python3 test/check.py /tmp/sloppy
```

Every fixture must load with no console error; broken JSON must show the on-page message.

Popover placement: `python3 test/placement.py 1200x900 800x700` prints how much of each popover covers other items (lower is better).
