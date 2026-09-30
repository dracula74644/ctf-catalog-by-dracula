---
slug: web-blind-command-injection-file-race
title: Inject a shell command and race to read its output file
category: Web Application Security
source_ctf: Breaking CTF
difficulty: medium
skills: web, command-injection, blind, race-condition
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A scan/probe endpoint takes a single user-supplied field (any other parameter name is rejected with 400) and passes it into a shell command run by a restricted worker, so a separator (`;`, `&&`, `|`) executes a second attacker-controlled command. Internal/blocked hosts are rejected before the job starts, and the worker deliberately suppresses stdout and stderr — a direct `; ls` returns "output suppressed by worker policy" and a hint that output must be written to an approved staging file — so the injection presents as blind. The escape valve: the app serves generated files from a public web directory, but a background cleanup thread deletes each generated file after roughly a third of a second, and the obvious staging name (`flag.txt`) is a protected name that returns 403 on direct read. The secret lives in a non-web-readable path on disk; the player must redirect it into an arbitrary web-served filename and win a sub-second race to fetch it before cleanup.

## Player solve path
1. Probe the endpoint: confirm only the one accepted parameter works (others → 400) and that a normal value returns a benign "probed" status.
2. List the public files directory; note the protected staging name returns 403 and cannot be read directly.
3. Inject a second command after a separator and observe that its stdout is suppressed and the worker demands output be redirected to a staging file.
4. Inject a redirect of the secret file into a fresh, arbitrary staging filename in the public dir (e.g. `; cat <secret-path> > leak.txt`).
5. Immediately fetch that staging file (background the write, sleep a fraction of a second, then GET it) to read the flag before the cleanup thread deletes it.
