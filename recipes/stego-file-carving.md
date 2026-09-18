---
slug: stego-file-carving
title: Data appended/hidden inside an image (carving)
skills: stego, forensics, carving
difficulty: easy
box_type: download
category: with_key
status: built
---

## Mechanic (theme-agnostic)
A valid image has an archive appended past its real end (or embedded). binwalk/foremost extracts an inner archive that nests down to a notes file holding the flag+key. Opens normally as a picture, so nobody looks.

## Player solve path
1. Notice the file is bigger than the image needs.
2. binwalk -e (or carve) to pull the appended archive.
3. Unnest to the notes file.

## What to plant
- FLAG: in the innermost extracted file.
- ACCESS KEY: a bit alongside — same notes file, a different line, or a sibling in the archive.

## Skin points (change per CTF)
Change: the cover image, archive nesting, notes story.
Keep: valid image + appended/embedded archive that carves cleanly.

## Blueprint mapping
download; build.py builds the PNG + appended archive with placeholders inside.
