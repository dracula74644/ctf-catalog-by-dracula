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
The player SSHes in as an unprivileged user in a group that owns both a root-run
service binary **and its directory** (group-writable). A separate root supervisor
watches that binary and, within a few seconds of it changing, kills and re-launches it
**as root** (and relaunches on exit). The player can't overwrite the running file
(ETXTBSY) and can't kill/restart the root service directly — but because the *dir* is
writable they rename the binary aside and drop a replacement. The supervisor redeploys
the new file as root; the payload SUIDs a shell, giving root, which reads a root-only
secret that unlocks the flag. The redeploy-on-change is the escalation — no kill needed.

## Player solve path
1. SSH in; enumerate (`id`, `ps`, service status, unit/config, permissions on the
   service binary and its directory).
2. Confirm the binary + its dir are group-writable and a root supervisor redeploys on
   change.
3. Rename the binary aside (dir is writable) and write a payload in its place.
4. Supervisor redeploys the payload as root → SUID a shell → root.
5. Read the root-only secret → submit to the vault gate → flag.
