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
Players get a forensic disk image (E01/raw, an NTFS volume starting a few thousand
sectors in) packaged with case notes and hashes. The flag sits inside a strongly
encrypted archive (7-Zip AES-256) in a user's Downloads — but the password is never
written whole. One half is in a *deleted* note recoverable from the Recycle Bin
(each deleted item is an `$I` metadata / `$R` content pair) that reads like a prefix
plus an instruction to "append the founding year"; the other half is an innocuous
value buried in a shipped document (a year in a handbook PDF, a name in a
spreadsheet). Browser history and SOP docs provide context but no password, and
several red-herring files (an unrelated photos zip, a `wifi.txt`) sit alongside to
punish grepping. The raw image leaks neither the flag nor the full password —
concatenating the two fragments and opening the archive is the only path.

## Player solve path
1. Load the image in Autopsy or sleuthkit CLI (`mmls` to find the volume offset,
   `fls -r -o <off>` to list, `icat` to extract files).
2. Browse the user profile: find the encrypted archive in Downloads and note it needs
   a password; skip the decoy archives/notes.
3. Recover the deleted note from the Recycle Bin (read the `$I` entries to find the
   one whose original name matches, then read its `$R` content) → the password prefix
   and the "append the founding year" hint.
4. Read the complementary value from a shipped document (e.g. the founding year in a
   handbook PDF's history section).
5. Concatenate the fragments into the full password and extract the AES archive
   (`7z x -p'<password>' ...`) → flag.
