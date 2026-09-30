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
A request handler passes a user-supplied field into a shell command, so a separator (`;`, `&&`, `|`) runs a second command. Direct stdout/stderr is suppressed by the worker, so injection looks blind — but the app serves a public directory, and a short-lived cleanup thread deletes generated files after a fraction of a second. The player redirects command output into a web-readable staging file and reads it before cleanup wins the race. A protected staging name (e.g. the obvious `flag.txt`) is blocked, forcing an arbitrary output filename.

## Player solve path
1. Find the exact parameter the endpoint accepts (others 400); confirm normal use works.
2. Confirm injection runs but output is suppressed, and note files are served from a public dir and deleted quickly.
3. Redirect the secret file into a fresh staging filename, then immediately fetch it before the cleanup thread deletes it.
