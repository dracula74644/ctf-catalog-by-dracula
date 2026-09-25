---
slug: box-ssh-bruteforce
title: SSH foothold via a targeted password brute-force
discipline: Password Attacks
skills: box, brute-force, passwords
difficulty: medium
box_type: hosted
category: with_key
status: built
---

## Mechanic (theme-agnostic)
One real account accepts SSH password auth. The password follows a derivable *scheme* leaked earlier (e.g. <Season|Company><Year><symbol>), so a *targeted* wordlist (~150 candidates) cracks it while a generic top-N list misses. Decoy accounts exist so blind sprays fail.

## Player solve path
1. From the recon leak, derive the small candidate grid.
2. Brute-force the known username with it (hydra/patator).
3. Log in and read the home dir.

## What to plant
- FLAG: in the account's home (e.g. user_flag.txt).
- ACCESS KEY: a bit alongside — a nearby hidden file in the same home (e.g. .access_key, mode 600).

## Skin points (change per CTF)
Change: username, the scheme + wordlist, decoy names.
Keep: password-auth on, a targeted-wordlist-only password, decoys.

## Blueprint mapping
hosted; SSH container in target/, password set at boot from TARGET_PASS. build.py plants the home files with placeholders.
