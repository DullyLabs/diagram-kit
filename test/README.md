# Checks

Run outside any sandbox (Chrome needs it).

```
python3 src/build.py --example /tmp/dk-ex
python3 test/check.py /tmp/dk-ex
python3 test/sloppy.py /tmp/dk-ex /tmp/dk-sloppy && python3 test/check.py /tmp/dk-sloppy
python3 test/placement.py /tmp/dk-ex   # % of each popover covering other items; lower is better
```

`check.py` exits non-zero if any page logs an error, shows "undefined" or "[object Object]", or fails to draw; broken JSON must show the on-page message.
