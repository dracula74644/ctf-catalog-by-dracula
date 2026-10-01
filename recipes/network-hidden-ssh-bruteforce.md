---
slug: network-hidden-ssh-bruteforce
title: Find an SSH service on an unadvertised port, then brute-force a weak login
category: Network Security
source_ctf: RED RANGE
difficulty: medium
skills: network, port-scanning, ssh, brute-force, passwords
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
An SSH service listens on a single unadvertised port inside a small port band; the exact
port is never shown, so it must be found by scanning. Two secrets are planted: the
pre-authentication SSH banner prints the flag (a "maintenance marker" left in staging),
and the access token sits in a file in the account's home directory, reachable only
after login. The account uses a weak/common password that is crackable from a standard
wordlist. The box is an isolated, per-player practice target with login rate-limiting
disabled, so repeated password attempts are an intended path, not something that locks
out.

## Player solve path
1. Scan the small port band to find the open SSH port (`hping3 --scan <range> -S <host>`,
   or `nmap -p<range> -sV`).
2. Connect once and read the pre-auth banner → the flag.
3. Brute-force the known username with a wordlist (`ncrack`/`hydra` + rockyou) → the
   password.
4. SSH in with the cracked password.
5. Read the token file in the home directory → the access key.
