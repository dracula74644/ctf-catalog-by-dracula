---
slug: box-repair-broken-scripts
title: Fix broken shell scripts so they reveal the secrets
category: Secure Coding
source_ctf: The Locker Network
difficulty: easy
skills: bash, debugging, syntax-errors, linux, recon
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A shell account holds two short bash scripts that used to work and now fail, each broken
by a few deliberate beginner mistakes. Once repaired, each script does a little system
reconnaissance (host, kernel, user, uptime, disk, network, processes, listening ports) and
then prints one secret it assembles from state files elsewhere on the box. One script
yields the access key, the other the flag.

The skill is reading error messages and using `bash -n` to locate problems, not
exploitation. The mistakes are a mix of syntax errors (a missing `then`, a block closed
with the wrong keyword, an unterminated quote, a missing closing parenthesis on a command
substitution) and keyword or command typos (`esle`, `ehco`).

## Player solve path
1. Log in with the credentials the box page hands out.
2. Run each script and read the error, or run `bash -n` on it to list syntax errors.
3. Fix the mistakes in an editor on the box. There are three per script.
4. Run the key script: recon output, then the access key.
5. Run the flag script: recon output, then the flag.
