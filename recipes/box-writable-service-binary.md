---
slug: box-writable-service-binary
title: Escalate to root by replacing a group-writable service binary a root supervisor redeploys
category: Exploitation
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: exploitation, privesc, service-permissions, suid, linux
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
The player has SSH access as an unprivileged user in a group that owns both a
root-run service binary **and its containing directory** (both group-writable). A
separate root supervisor/health-monitor polls the binary's mtime on a short interval
(~3s) and, on any change, `SIGKILL`s the running process and re-execs the binary **as
root** (it also relaunches the service on exit, mimicking `Restart=always`). The player
can't overwrite the running file in place (ETXTBSY) and has no rights to kill or
restart the root service directly — but because the *directory* is writable they rename
the current binary aside and drop a replacement in its place. The supervisor detects
the mtime change and redeploys the new file as root; the payload copies a shell and
makes it SUID root, giving a root shell that reads a root-only secret which unlocks the
flag. The auto-redeploy-on-change is the escalation primitive — no kill needed. The box
runs SSH with no login rate-limiting (intended isolated practice target).

## Player solve path
1. SSH in; enumerate: `id`, `ps` (locate the root service and a separate root
   supervisor), the service unit/config, and permissions on the binary and its dir.
2. Confirm the binary AND its directory are group-writable and that a root supervisor
   redeploys on change (documented in an on-box notice / observable via `ps`).
3. Rename the binary aside (the dir is writable) and write a payload script in its
   place that copies a shell and `chmod 4755`s it (SUID root), then `chmod +x` it.
4. Wait a few seconds → the supervisor re-execs the replacement as root → a SUID-root
   shell appears.
5. Run it with `-p` → euid 0 → read the root-only secret → submit to the unlock gate →
   flag.
