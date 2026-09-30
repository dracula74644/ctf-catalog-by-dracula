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
