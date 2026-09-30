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
