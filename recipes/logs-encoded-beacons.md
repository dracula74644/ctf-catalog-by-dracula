---
slug: logs-encoded-beacons
title: Decode a hidden message buried in the logs
category: Digital Forensics
source_ctf: First Shift
skills: log-analysis, encoding, forensics
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
Server logs (access/syslog) hold many similar 'beacon' requests carrying scrambled strings; another log line states the encoding chain (e.g. base64→hex→XOR with a word). Most beacons are junk; one decodes to the flag+key. One deliberately won't decode until reversed.

## Player solve path
1. On the box (SSH) or in the log files, spot the repeated beacons.
2. Find the log line describing the encoding.
3. Decode each; discard junk; recover the real payload (try reversing the odd one).

## What to plant
- FLAG: in the decoded payload (FLAG=... KEY=...).
- ACCESS KEY: a bit alongside — the same decoded payload's KEY= field (different token) or a neighbouring beacon.

## Skin points (change per CTF)
Change: the encoding chain, log volume, the beacon path.
Keep: signal-in-noise beacons + a leaked encoding recipe; decoys.

## Blueprint mapping
hosted (SSH box) or download (the logs). build.py writes the logs with the encoded payload (placeholders encoded in).
