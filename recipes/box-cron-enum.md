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
