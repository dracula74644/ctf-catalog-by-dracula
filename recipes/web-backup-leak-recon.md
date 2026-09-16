---
slug: web-backup-leak-recon
title: Exposed backup file leaks credentials/scheme
skills: web, recon, information-disclosure
difficulty: easy
box_type: hosted
category: with_key
source: CTF3 "Deep Access" — stage 1 (recon)
status: built
---

## Mechanic (theme-agnostic)
A nightly job left a *.bak of a config under the web root, reachable but not linked (found via robots.txt or dir-busting). It leaks a username and a password *scheme* (not the password) plus an internal submission token. Decoys: older/superseded .bak files that extract to junk.

## Player solve path
1. Read robots.txt / dir-bust to find /backups/.
2. Fetch the real config backup.
3. Recover the leaked username + password scheme (feeds a later brute-force).

## What to plant
- FLAG: in the leaked backup (a breadcrumb comment).
- ACCESS KEY: a bit alongside — a separate line/section of the same backup, or an adjacent .bak.

## Skin points (change per CTF)
Change: company, filenames, the scheme hint, decoy contents.
Keep: a web-reachable-but-unlinked backup that leaks recon, plus decoys.

## Blueprint mapping
hosted (or download for a pure recon file); build.py writes the docroot + /backups with the real leak (placeholders) and decoy .bak files. Reference: CTF3 build/ch1_webapp_backup.py.
