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
A valid image has an archive appended past its real end (or embedded). binwalk/foremost extracts an inner archive that nests down to a notes file holding the flag+key. Opens normally as a picture, so nobody looks.

## Player solve path
1. Notice the file is bigger than the image needs.
2. binwalk -e (or carve) to pull the appended archive.
3. Unnest to the notes file.
