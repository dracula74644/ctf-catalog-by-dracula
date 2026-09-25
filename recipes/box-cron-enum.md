---
slug: box-cron-enum
title: Find secrets left behind by a scheduled job
category: Exploitation
source_ctf: Deep Access
skills: box, enumeration, linux
difficulty: easy
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A root cron job runs a script whose output log is world-readable (the script itself is readable but not writable — not a second path to root). Enumerating /etc/cron.d and the log reveals the token. Pure post-foothold enumeration.

## Player solve path
1. After a foothold, enumerate /etc/cron.d and /var/log.
2. Find the report script + its log.
3. Read the token from the log/script.

## What to plant
- FLAG: in the cron script's output log (or the script).
- ACCESS KEY: a bit alongside — a different line of the log, or the script's header comment.

## Skin points (change per CTF)
Change: the job's name/purpose, paths, cadence.
Keep: a root cron job with a readable log; readable-not-writable script.

## Blueprint mapping
hosted; entrypoint installs the cron file + runs the script once; build.py writes the script/log with placeholders.
