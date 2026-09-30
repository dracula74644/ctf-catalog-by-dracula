---
slug: box-path-hijack-cron
title: Escalate to root by hijacking PATH on a bare command in a root cron job
category: Exploitation
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: exploitation, privesc, path-hijacking, cron, suid, linux
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
The player SSHes into a box as an unprivileged user who belongs to a group that owns
a writable directory early in root's PATH. A root-owned script (run by cron as root on
a short interval) invokes a command by **bare name** — no absolute path. Because the
writable directory precedes the real one in the job's `PATH`, the player drops a
malicious executable with that command's name; the next cron run executes it as root.
The payload makes a SUID-root copy of a shell; the player runs it with `-p` to become
root and reads a root-only secret used to unlock the flag.

## Player solve path
1. SSH in; enumerate (`id`, group memberships, writable dirs in PATH, cron files).
2. Find the root cron job calling a bare command with a group-writable PATH dir.
3. Drop `<command>` in that dir: it copies a shell to a temp path and SUIDs it.
4. Wait for cron → run the SUID shell with `-p` → root → read the root-only secret.
5. Submit the secret to the vault gate → flag.
