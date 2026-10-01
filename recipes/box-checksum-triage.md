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
Players SSH into a box and triage a set of files by integrity. A checksum manifest
(e.g. `CHECKSUMS.md5`) was generated *before* a live file was swapped in, so the one
tampered/live file is exactly the entry whose hash now FAILS verification. A directory
of same-extension blobs (all `.dat`) deliberately mixes genuine data files with renamed
junk — PNG, gzip, and plain text masquerading as `.dat` — so `file` type-identification
is needed to discard the decoys before checksumming. The flag is embedded as a
`payload=` string inside the single real file that fails the checksum. A separate access
token is stored as raw bytes in one of several key backups; the valid backup is the one
whose SHA-1 is NOT present in a revocation list, so the player diffs computed hashes
against that list. Clues to all of this sit in operator notes at the end of a long log.

## Player solve path
1. SSH in and read the task/README; page to the end of the long log (`less`, then `G`)
   for the operator notes that explain the three sub-tasks.
2. Run `file <dir>/*` to separate genuine data files from renamed junk (PNG/gzip/text).
3. Verify the manifest and keep only the mismatch: `md5sum -c CHECKSUMS.md5 | grep -v OK`
   → the one real file that FAILED.
4. `strings` that file and grep for `payload=` → the flag.
5. `sha1sum` the key backups, compare against the revocation list, and `xxd -p` the one
   backup whose hash is not revoked → the access key.
