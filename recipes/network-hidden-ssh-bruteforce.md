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
An SSH service listens on a non-obvious port inside a stated range; the exact port is
not advertised. The player scans the range to locate the open port, then brute-forces
the login for a known (or hinted) account whose password is a common one. One token
is exposed in the SSH pre-auth login banner — shown to anyone who connects, before
authentication — and a second token sits in a file in the account's home directory,
readable only after a successful login. Exploitable because of a weak/reused password
plus a service that still answers on a discoverable port.

## Player solve path
1. Port-scan the advertised range to find the one open SSH port.
2. Connect; note the token printed in the pre-auth banner.
3. Brute-force the account's password with a common wordlist.
4. Log in and read the token from the home-directory file.
