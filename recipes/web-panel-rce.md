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
An old ops panel behind default creds runs a 'diagnostics' feature that passes input to a shell. Command injection gives code execution. Hardening idea: run the injection chrooted into a minimal jail with no file-reading applets, so the flag must be read with a shell builtin (a `while read` loop).

## Player solve path
1. Recon leaks the panel path + default creds.
2. Log in, reach the diag feature, inject a command.
3. Read the flag file — with a builtin if cat/head are absent.
