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
A perfectly valid image opens normally as a picture but has an archive appended past its real end (a polyglot). A faint clue in the outer file's strings hints at "hidden in plain sight". Carving the file (binwalk/foremost) yields an inner archive holding a notes file that points to a second artifact — an image whose flag is not visual but sits in its strings/metadata. The flag is never visible from the outer image alone.

## Player solve path
1. `strings` the image → suspicious "plain sight" hint; note the file is larger than the picture needs.
2. `binwalk -e` (or carve at the archive offset) to pull the appended archive.
3. Open the notes file; follow it to the nested image.
4. `strings`/metadata on the nested image → flag.
