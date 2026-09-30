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
The player has SSH access to a box as an unprivileged user who belongs to a group that
owns a directory sitting **first** on root's cron PATH and made group-writable. A
root-owned script — run by cron as root on a short interval (here every 2 minutes via
a drop-in in `/etc/cron.d`) — invokes system commands by **bare name** (e.g. `tar`,
`rsync`) with no absolute path, and the cron file sets an explicit `PATH` that places
the group-writable directory ahead of the real bin dir. The script file itself is
root-owned and unwritable; the flaw is the unqualified command calls plus the PATH
order. The player drops a malicious executable named after one of those bare commands
into the writable directory; on the next tick, PATH resolution finds it first and runs
it as root. The payload copies a shell and makes it SUID root; running it with `-p`
preserves euid 0, giving a root shell that reads a root-only secret which unlocks the
flag. The box runs SSH with no login rate-limiting (intended isolated practice target).

## Player solve path
1. SSH in; enumerate: `id` (group memberships), `sudo -l` (none), and cron files.
2. Read the root cron job → note its explicit `PATH` order and that its script calls a
   bare (unqualified) command.
3. Confirm the first `PATH` entry is a directory writable by your group
   (`ls -ld`, `find / -writable -type d`).
4. Drop an executable named after that bare command into the writable dir; it copies a
   shell to a temp path and `chmod 4755`s it (SUID root).
5. Wait for the next cron tick → run the SUID shell with `-p` → euid 0 → read the
   root-only secret.
6. Submit the secret to the unlock gate → flag.
