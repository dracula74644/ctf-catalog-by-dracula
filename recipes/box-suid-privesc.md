---
slug: box-suid-privesc
title: Become root using a vulnerable setuid program
category: Exploitation
source_ctf: Deep Access
skills: box, privesc, linux
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A custom setuid-root helper (mode 4755, owned by root) is installed on the box under a system bin path. On startup it calls `setgid(0)`/`setuid(0)` to drop to **full root** (ruid=euid=0) and THEN invokes an external utility by its **bare command name** via `system()` (e.g. `system("tar czf ... -C /var/log ...")`). `system()` runs `/bin/sh -c "<cmd> ..."`, so the bare name is resolved through the **inherited `PATH`** — whatever the caller's `PATH` points at runs, and because the process is already root, it runs as full root. Prepending a player-writable directory containing a malicious executable with that same command name to `PATH` therefore yields root code execution. `sudo` is deliberately a dead end (the foothold user is in a privileged group but the group's sudoers rule is disabled), so the SUID helper is the only path up. The binary's source is not readable, so it must be analysed with `strings`/`ltrace` to discover which command it reaches for. Other apparent shortcuts are closed (the root flag is staged under a mode-700 directory the user cannot traverse).

## Player solve path
1. **Enumerate SUID binaries**: `find / -perm -4000 -type f 2>/dev/null`. One non-standard, custom helper stands out among the normal system SUIDs.
2. **Confirm `sudo` is useless**: `sudo -l` reports the user may not run sudo — so the SUID is the way up (shell history may also nudge toward the SUID search).
3. **Analyse the helper** (you cannot read its source): `strings <binary> | grep -E 'tar|system|/'` reveals it calls a command by bare name and that it elevates first. That command's name is the hijack target.
4. **Hijack `PATH`**: create a temp dir, drop an executable named after that command (e.g. `#!/bin/sh` that spawns a shell, or `cat`s the root-only files), `chmod +x` it, then run the helper with `PATH=<tmpdir>:$PATH <helper>`.
5. The helper, already root, resolves the command to **your** script and runs it as root — giving a root shell or dumping the root files.
6. **Read `/root`**: the flag is a file there; the stage **access key** is a sibling root-only dotfile alongside it (so the hijacked command can `cat` both together).
