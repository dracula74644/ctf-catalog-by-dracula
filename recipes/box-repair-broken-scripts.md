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

## What to plant
- ACCESS KEY: in a state file the key script reads, stored in a form the script has to
  process, such as shuffled indexed chunks it sorts back into order.
- FLAG: in a separate report file, as one labelled line the flag script extracts.

## Skin points (change per CTF)
Change: what the scripts pretend to be, the account name, file and folder names, the
recon lines printed, which mistakes are planted.
Keep: two scripts, one secret each; a few beginner-level mistakes per script; recon before
the reveal; the secrets read from separate files.

Keep the breakage as one table in `build.py`, a list of exact correct text and its broken
replacement, and assert each target occurs exactly once. Swapping the difficulty then
becomes a one-place edit, and a typo in the table fails the build instead of silently
shipping a working script.

Known shortcut: the state files are readable, so a player who reads the scripts can pull
both values by hand without fixing anything. The box teaches debugging, not access
control. Document that rather than fight it.

## Blueprint mapping
- hosted: an isolated Alpine sshd container, with a busybox httpd credentials page and
  SSH on a second port. Include `nano` and `vim`. The password is random per boot, from
  `build.py`. No runtime mounts.
- `build.py` writes both scripts correct, applies the breakage table, and writes the
  state files with `__ACCESS_KEY_<ID>__` and `__FLAG_<ID>__` in different files. The
  entrypoint turns the key file into shuffled indexed chunks and makes the state
  directory root-owned but world-readable.
- Make the entrypoint readable by root only, since it reveals how the key is stored.
- Same class-scale sshd settings as any shared SSH box: `MaxStartups` far above the class
  size, no `pids_limit`.
