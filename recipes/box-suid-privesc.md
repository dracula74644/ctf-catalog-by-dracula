---
slug: box-suid-privesc
title: Root via a PATH-hijackable custom SUID binary
skills: box, privesc, linux
difficulty: medium
box_type: hosted
category: with_key
status: built
---

## Mechanic (theme-agnostic)
A custom setuid-root helper does setuid(0) then calls a command by its *bare* name (e.g. system("tar ...")). Prepending a writable dir with a malicious `tar` to PATH runs the player's code as root. Sudo is deliberately useless — the SUID is the only path.

## Player solve path
1. Enumerate SUID binaries; find the custom helper.
2. See it calls a command by relative name.
3. Plant a fake command in PATH and trigger it → root.
4. Read /root.

## What to plant
- FLAG: in /root (root-only).
- ACCESS KEY: a bit alongside — a second root-only file next to it (e.g. /root/.access_key).

## Skin points (change per CTF)
Change: the helper's name/purpose, the hijacked command.
Keep: setuid(0) + a bare-name system() call; no helpful sudo.

## Blueprint mapping
hosted; Dockerfile compiles the SUID root-owned +s; build.py plants /root files (placeholders) + records the vector.
