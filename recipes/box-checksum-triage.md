---
slug: box-checksum-triage
title: Find the one tampered file using checksums and hex tools
category: Digital Forensics
source_ctf: The Locker Network
difficulty: easy
skills: file-triage, checksums, md5sum, sha1sum, file, strings, xxd, less, linux
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A shell account holds a small set of look-alike binary files plus a checksum manifest
that was signed *before* one file was swapped. Every file carries a plausible secret,
so reading them all proves nothing; the only thing that singles out the real one is
integrity. A few decoys are junk renamed to the same extension, so the player has to
classify files by content, not by name, before checking them.

The second secret is a token stored as **raw bytes** in one of a handful of backup
files. A revocation list names the dead backups by their SHA-1. Hashing the backups and
eliminating the listed ones leaves exactly one, which is then hex-dumped into the
submittable value.

Each standard triage tool has one visible job: `less` to read instructions at the end of
a long file, `file` to tell real data from renamed junk, `md5sum -c` to find the item
that no longer matches, `strings` to pull text out of binary, `sha1sum` to eliminate
revoked copies, `xxd` to turn raw bytes into hex.

## Player solve path
1. Log in with the credentials the box page hands out.
2. Read the task list, then page to the end of a long log for the notes that explain how
   to interpret results.
3. Run `file` across the folder: real items report as data, junk reports as an image,
   an archive or text.
4. Run `md5sum -c` against the manifest: exactly one real item fails. That is the live one.
5. Run `strings` on it: its payload line is the flag. The other items hold decoy flags.
6. Run `sha1sum` over the token backups and compare with the revocation list: one is not
   listed.
7. Run `xxd -p -c 32` on that file: the 64 hex characters are the access key.

## What to plant
- FLAG: inside the one item whose checksum no longer matches the manifest, as a
  readable payload string amid binary noise.
- ACCESS KEY: a separate directory, in the one backup file absent from the revocation
  list, stored as the blob's raw bytes, not as text.

## Skin points (change per CTF)
Change: account name, what the items and backups are called, the story of why one was
swapped, file and folder names, how many decoys, the wording of the notes.
Keep: one manifest signed before the swap; decoys that pass the check but carry fake
flags; renamed junk that only `file` exposes; a hash-based revocation list; the token as
raw bytes that need a hex dump.

Direction matters here. Name each task and its tool in a README on the box, and explain
the xxd flags where they are used: plain `xxd -p` wraps a 32-byte value onto two lines.
Without that direction players found it arbitrary and too hard. Keep counts small: about
six real items, three junk, three token backups.

## Blueprint mapping
- hosted: an isolated Alpine sshd container, with a busybox httpd credentials page on the
  box port and SSH on a second port. The password is random per boot, written by
  `build.py` and shown on the page. No runtime mounts: artifacts are baked into the image
  and the entrypoint copies them into the home directory, then deletes the seed.
- `build.py` writes the items, manifest, notes and backups. It plants `__FLAG_<ID>__` in
  the live item and `__ACCESS_KEY_<ID>__` as hex text in the live backup; the entrypoint
  converts that backup to raw bytes, because the verify step needs the blob visible as
  text in artifacts.
- The injector patches files as UTF-8 text, so binary noise must be valid UTF-8 (NULs,
  control bytes, multibyte characters). Start each item with a fixed 8-byte lead-in, 0x01
  then seven NULs, so libmagic reports "data" rather than a random match.
- For class-scale logins, set `MaxStartups` far above the class size and drop the
  container's `pids_limit`. The OpenSSH default refuses about a third of new logins once
  thirty players are mid-login.
