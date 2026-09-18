---
slug: web-panel-rce
title: Command injection in an outdated admin panel
skills: web, rce, command-injection
difficulty: hard
box_type: hosted
category: with_key
status: built
---

## Mechanic (theme-agnostic)
An old ops panel behind default creds runs a 'diagnostics' feature that passes input to a shell. Command injection gives code execution. Hardening idea: run the injection chrooted into a minimal jail with no file-reading applets, so the flag must be read with a shell builtin (a `while read` loop).

## Player solve path
1. Recon leaks the panel path + default creds.
2. Log in, reach the diag feature, inject a command.
3. Read the flag file — with a builtin if cat/head are absent.

## What to plant
- FLAG: a file only reachable via the RCE (inside the jail).
- ACCESS KEY: a bit alongside — a nearby env var, a second file in the jail, or the panel's own config near the flag.

## Skin points (change per CTF)
Change: panel name/version, creds, the diag feature's story.
Keep: input reaching a shell; the jail + missing-tools twist if you want the difficulty.

## Blueprint mapping
hosted; web app + a sandboxed exec path in the entrypoint. build.py + entrypoint build the jail.
