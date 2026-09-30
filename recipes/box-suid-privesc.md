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
A custom setuid-root helper does setuid(0) then calls a command by its *bare* name (e.g. system("tar ...")). Prepending a writable dir with a malicious `tar` to PATH runs the player's code as root. Sudo is deliberately useless — the SUID is the only path.

## Player solve path
1. Enumerate SUID binaries; find the custom helper.
2. See it calls a command by relative name.
3. Plant a fake command in PATH and trigger it → root.
4. Read /root.
