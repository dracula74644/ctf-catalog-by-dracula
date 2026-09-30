---
slug: box-ssh-bruteforce
title: Guess the SSH password to get onto the box
category: Exploitation
source_ctf: Deep Access
skills: box, brute-force, passwords
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
One real account accepts SSH password auth. The password follows a derivable *scheme* leaked earlier (e.g. <Season|Company><Year><symbol>), so a *targeted* wordlist (~150 candidates) cracks it while a generic top-N list misses. Decoy accounts exist so blind sprays fail.

## Player solve path
1. From the recon leak, derive the small candidate grid.
2. Brute-force the known username with it (hydra/patator).
3. Log in and read the home dir.
