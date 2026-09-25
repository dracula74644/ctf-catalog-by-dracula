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

## What to plant
- FLAG: in the SSH pre-auth login banner (network-visible on connect).
- ACCESS KEY: in a file in the account's home directory (post-login) — a clear step
  from the banner, never the same place.

## Skin points (change per CTF)
Change: the account name, the weak password (keep it in common wordlists), the
port/range, banner and host copy.
Keep: SSH reachable on a discoverable port + a weak credential; flag in the pre-auth
banner, access key behind the login.

## Blueprint mapping
- box_type: hosted SSH box; target/ runs sshd with password auth and a weak account.
- Ship the sshd config with legacy KEX/ciphers/host-key algorithms enabled (older
  brute-force clients negotiate them) AND with all throttling OFF (huge MaxStartups /
  MaxAuthTries / MaxSessions, LoginGraceTime 0) — otherwise the target drops the
  brute-forcer's parallel connections and the challenge looks broken.
- build.py writes the banner file (`__FLAG_<ID>__`) and a home file
  (`__ACCESS_KEY_<ID>__`). Publish the port INSIDE the advertised range and leave
  BOX_PORT empty so the portal hides it and the port must be discovered.
