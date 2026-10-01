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
Players SSH into a box holding two recon shell scripts that refuse to run because of
deliberately introduced syntax errors. The bugs are classic shell mistakes: a mistyped
command (`ehco` for `echo`, `esle` for `else`), an `if [ ... ]` test missing its
`; then`, a block closed with the wrong keyword (`done` where `fi` is required, or vice
versa), and an unbalanced quote or parenthesis. Each script, once it parses, performs
host recon and prints a secret at the end — one script yields the flag, the other yields
the access token. `bash -n <script>` is the key tool: it reports the syntax errors line
by line without executing anything, turning the task into read-fix-rerun.

## Player solve path
1. SSH in and run each script; observe the "command not found" / "syntax error near
   unexpected token" failures.
2. Run `bash -n <script>` to locate each syntax error by line.
3. Fix the bugs in an editor (`nano`/`vim`): correct the command typos, add the missing
   `; then`, match each block's terminator (`fi`/`done`), and balance quotes/parens.
4. Re-run `bash -n` until clean, then execute each script.
5. Read the printed output — one script's final line is the flag, the other's is the
   access key.
