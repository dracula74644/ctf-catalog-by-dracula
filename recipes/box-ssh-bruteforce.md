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
The box runs an SSH server with `PasswordAuthentication yes` but is locked down so that exactly ONE real maintenance account may log in: `sshd_config` sets `AllowUsers <that account>` and `PermitRootLogin no`, so a spray of any other name (root, admin, a service account) is rejected at authentication **even with the correct password** — the player must recover the right username from an earlier recon leak first. The password is never leaked directly; instead a prior step exposes a derivable password *scheme* (e.g. a season-or-company word + a 4-digit year + one optional trailing symbol), which expands to a small, finite candidate grid (on the order of ~150 strings). A generic top-N password list misses the real password because it only exists inside that derived grid, while the targeted grid cracks it quickly. By design there is no `fail2ban`, no `pam_faillock`, and `MaxAuthTries`/`MaxStartups` are set generously, so a small targeted brute-force run is allowed to complete — the box is an isolated, intentionally-vulnerable practice target meant to be logged into repeatedly. The SSH service also listens on a non-standard, deploy-specific port.

## Player solve path
1. **Recover the username and the password scheme** from the preceding recon artifact (not the password itself — just *who* and the *shape*).
2. **Find the SSH port.** It is not on the default 22 and nothing hardcodes it, so port-scan the host (e.g. `nmap -Pn -p-`). Beware a decoy: the host's *own* admin SSH may answer on 22 with a different banner and no such account — that is not the target; use the service whose banner matches the challenge image.
3. **Turn the scheme into a wordlist.** Nest loops over the candidate bases × years × trailing symbols to emit every combination to a file (~150 lines).
4. **Brute-force the one permitted account** with that list, e.g. `hydra -l <user> -P list.txt -t 4 -f ssh://<host>:<port>`. Only this account authenticates; the targeted password lands where a generic list would not.
5. **Log in** with the recovered password and read the user's home directory — the flag is a file there.
6. The stage **access key** sits in a sibling hidden dotfile in the same home directory (next to the flag file, not in it).
