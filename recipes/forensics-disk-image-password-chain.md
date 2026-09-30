---
slug: forensics-disk-image-password-chain
title: Rebuild an archive password from clues across a forensic disk image
category: Digital Forensics
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: forensics, disk-image, e01, deleted-file-recovery, password-recovery
box_type: download
status: built
---

## Mechanic (theme-agnostic)
The player is handed a forensic disk image (E01/raw) plus case notes. The flag sits
inside a strongly-encrypted archive (AES zip) on the image — but the password is not
written anywhere whole. One half is recoverable as a *deleted* file (from the recycle
bin / unallocated space); the other half is an innocuous-looking value buried in a
document (a year in a PDF, a name in a spreadsheet). The player mounts/parses the
image, recovers the deleted fragment, reads the document fragment, concatenates them
into the password, and opens the archive.

## Player solve path
1. Mount or parse the image (E01 tooling / sleuthkit).
2. Recover a deleted file from the recycle bin / unallocated space → partial password.
3. Find the complementary value inside a shipped document (PDF/handbook).
4. Combine the fragments → the archive password.
5. Open the AES-encrypted archive → flag.

## What to plant
- FLAG: only inside the encrypted archive (the raw image leaks neither flag nor the
  full password).
- ACCESS KEY: a bit alongside — inside the archive next to the flag but on a separate
  line/file, or in the case notes, never on the same line as the flag.

## Skin points (change per CTF)
Change: image contents, the two document types the fragments hide in, the archive
type, the story.
Keep: password split into a deleted-file fragment + a document fragment; flag only in
the encrypted archive so the plain image doesn't shortcut it.

## Blueprint mapping
- box_type: download; portal serves the case archive (image + notes).
- build.py stages the image, deletes the fragment file into the recycle bin, embeds
  the other fragment in a generated document, and seals `__FLAG_<ID>__` (+
  `__ACCESS_KEY_<ID>__` on a separate line) in the AES archive.
