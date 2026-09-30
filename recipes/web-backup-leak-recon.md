---
slug: web-backup-leak-recon
title: Find secrets in a leaked website backup file
category: Web Application Security
source_ctf: Deep Access
skills: web, recon, information-disclosure
difficulty: easy
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A nightly job left a *.bak of a config under the web root, reachable but not linked (found via robots.txt or dir-busting). It leaks a username and a password *scheme* (not the password) plus an internal submission token. Decoys: older/superseded .bak files that extract to junk.

## Player solve path
1. Read robots.txt / dir-bust to find /backups/.
2. Fetch the real config backup.
3. Recover the leaked username + password scheme (feeds a later brute-force).
