---
slug: forensics-appended-archive-carve
title: Carve a hidden archive from an image and dig to the nested evidence
category: Digital Forensics
source_ctf: Breaking CTF
difficulty: easy
skills: forensics, carving, binwalk, stego, strings
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A perfectly valid image (a JPEG) opens normally as a picture but has a ZIP archive concatenated after the image's real end-of-file — a polyglot where the trailing archive is ignored by image viewers. The outer file's EXIF/metadata holds nothing useful (a deliberate first dead end), but a `strings` pass surfaces a faint "never trusted plain sight" hint pointing at hidden-in-plain-sight data, and the file is noticeably larger than the picture needs. Carving (`binwalk`/`foremost`, or slicing at the ZIP offset) recovers the appended archive, which contains a notes file plus a second image. The notes file points to that nested image, whose flag is not visible in the picture — it sits in the image's `strings`/metadata. The flag is never recoverable from the outer image alone.

## Player solve path
1. Check the outer image's EXIF/metadata first (nothing there), then `strings` it → the "plain sight" hint; note the file is larger than the visible picture warrants.
2. Run `binwalk` to confirm ZIP data appended after the JPEG, then `binwalk -e` (or carve at the reported archive offset) to extract the appended archive.
3. Open the extracted notes file inside the archive; it points to the nested image.
4. Run `strings` / read the metadata on that nested image → flag.
