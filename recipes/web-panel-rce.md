---
slug: web-panel-rce
title: Run commands through an outdated admin panel
category: Web Application Security
source_ctf: Breach Response
skills: web, rce, command-injection
difficulty: hard
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A legacy admin/ops panel sits behind factory-default credentials that were never rotated, and those creds are leaked out-of-band through exposed repository metadata (a browsable `.git/logs/HEAD` whose commit messages mention the panel and its default login). Once authenticated, the panel exposes a "connectivity check" that interpolates a user-supplied host field straight into a shell command (e.g. `ping -c 1 <host>`), so a `; <cmd>` or newline chains arbitrary commands onto it — classic OS command injection. The build is hardened two ways rather than left naive: (1) a blocklist regex rejects the usual file-read/dump/transfer/editor utilities (`cat`, `tac`, `head`, `tail`, `more`, `od`, `xxd`, `strings`, `grep`, `awk`, `sed`, `cut`, `base64`, `dd`, `tar`, `curl`, `wget`, `nc`, `python`, `perl`, …), returning a "hardening policy" refusal; and (2) the command actually runs `chroot`ed into a minimal jail containing only a busybox-style `sh` with non-file-reading applets plus the single flag file, under a scrubbed environment — so the injection can never reach the real container, the other challenges' tokens, app source, or `/etc/passwd`. The effect: RCE is trivial to prove (`; id`, `; uname`) but reading the flag requires exfiltrating a file using only shell built-ins, since no external read binary exists in the jail and would be blocked anyway. The flag and a separate per-deploy access key live on different lines of that one reachable token file.

## Player solve path
1. Recon the exposed repository metadata (browse `/.git/`, read `logs/HEAD`) to recover the panel path and its unrotated default credentials.
2. Log in to the panel, reach the connectivity-check feature, and confirm injection with a benign allowed command (`127.0.0.1; id` or `; uname`) — output proves code execution.
3. Try the obvious `; cat <flagfile>` and observe it is refused by the hardening blocklist; confirm `head`/`grep`/`xxd`/`busybox` etc. are all rejected and absent from the jail.
4. Read the file using a shell built-in only — a `while read -r l; do echo "$l"; done < <flagfile>` loop (both `read` and `echo` are builtins, no external binary), or an equivalent builtin trick (sourcing the file to spill it as an error, mapfile, etc.).
5. The dumped file's flag line is the flag; the adjacent `ACCESS_KEY:` line is the separate access key. Enumerating the rest of the box (`ls /`, other flags, env files) returns empty by design — the jail confines you to just this file.
