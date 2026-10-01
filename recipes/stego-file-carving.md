---
slug: stego-file-carving
title: Find a file hidden inside a picture
category: Digital Forensics
source_ctf: First Shift
skills: stego, forensics, carving
difficulty: easy
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A file that is a fully valid image (correct header and dimensions, opens in any viewer) has a compressed archive appended after the image's real data, so nothing looks wrong on inspection. The payload lives inside a compressed stream (zlib/gzip), not as loose bytes, so `strings` on the file reveals nothing — defeating the obvious shortcut. A carving tool detects the trailing archive by its magic signature at a non-zero offset: typically a ZIP local-file header (`50 4B 03 04`) or a gzip member well past the image start, alongside the image's own zlib stream. The archive is nested: extracting the outer archive yields an inner compressed tarball that must itself be unpacked to reach the final notes file, so a single extraction is not enough and the secret never appears as a contiguous printable run in the raw file. The inner notes file is given a distinctive name (not a generic `notes.txt`) so that unpacking it cannot collide with or overwrite a different challenge's download.

## Player solve path
1. Confirm the file is a genuine image: `file image.png` reports valid image data of the stated dimensions.
2. Scan for appended/embedded data: `binwalk image.png` flags the image's own zlib stream plus an archive at a high offset (e.g. a ZIP member whose stored name ends in `.tar.gz`).
3. Note that `strings image.png` finds nothing meaningful — the data is compressed, confirming carving rather than a text search is required.
4. Carve/extract the appended archive: `binwalk -e image.png` (or `foremost`, or `dd` from the reported offset).
5. Unnest the second layer: `tar xzf <extracted>/inner.tar.gz` — one extraction is not enough.
6. Read the recovered notes file; it holds the flag and the submission key side by side.
