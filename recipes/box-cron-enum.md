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
A drop-in cron entry under `/etc/cron.d` runs a helper script **as root** on a short interval (every minute). The script generates a status/health report and writes it to a log file with world-readable permissions (0644), and the secret token is embedded in the report under an "internal tokens" block. Both the log and the script itself are readable by the unprivileged foothold user, so the token is recoverable by pure enumeration. Crucially, the script is root-owned and **not writable** by the foothold user (e.g. `root:root 0755`), so this is information disclosure only — NOT a second path to root (if the script *were* writable, a root cron executing the player's code would be a clean privesc; here it is deliberately closed, and root is reachable only through the separate privesc challenge). This is a post-foothold Linux enumeration exercise: the payoff is in knowing where scheduled jobs and their output live.

## Player solve path
1. **After getting a foothold**, enumerate scheduled jobs — list `/etc/cron.d/` (and `crontab -l`, `/etc/crontab`, `/etc/cron.*`) and read the non-standard drop-in.
2. Note it runs a helper **as root** every minute and points at a script path (e.g. under `/opt/...`); follow that path.
3. **Read the log** the script produces (its path is in the script, typically under `/var/log/...`) — the token sits in an internal/ops block. The script file itself is readable too and carries the same values.
4. **Confirm it is not a privesc**: `ls -l` / `test -w` the script shows it is root-owned and not writable by you, so chasing a cron-based root path here is a dead end — note it and move on.
5. The **flag and the access key both live in that same report block** (adjacent lines, read in one shot).
