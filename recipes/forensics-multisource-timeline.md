---
slug: forensics-multisource-timeline
title: Prove an incident's true order across disk, memory, logs, and email
category: Digital Forensics
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: forensics, dfir, timeline, memory-analysis, log-correlation, deleted-file-recovery
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A full multi-artifact DFIR case: a disk image, a removable-media image, firewall
logs, security-event exports, browser history, emails, and a memory dump. The story
seems to be one thing (e.g. a ransomware hit), but correlating timestamps across all
sources proves a different truth (the data theft happened *before* the loud event).
The flag lives in an encrypted archive whose password exists only transiently — in
the memory dump (clipboard remnants / a command line). A key file was deleted from
the removable-media image and must be undeleted. The player builds a minute-by-minute
timeline, extracts the password from RAM, undeletes the file, and opens the archive.

## Player solve path
1. Ingest each artifact; build a unified timeline of the key events.
2. Show the theft window precedes the noisy event (order matters, not just presence).
3. Carve the archive password out of the memory dump (clipboard / process cmdline).
4. Undelete the archive from the removable-media image (fls/icat-style recovery).
5. Extract with the recovered password → flag.

## What to plant
- FLAG: only inside the encrypted archive; password only in RAM (never on disk whole).
- ACCESS KEY: a bit alongside — in the incident report or case notes, a separate
  artifact from the flag archive.

## Skin points (change per CTF)
Change: the cover story, which artifact types you ship, the exact timestamps.
Keep: multi-source timeline reveals true event order; password recoverable only from
memory; a deleted file to undelete; flag only in the sealed archive.

## Blueprint mapping
- box_type: download; portal serves the case bundle.
- build.py generates each artifact with consistent timestamps, plants the password in
  the memory image, deletes the archive on the media image, and seals `__FLAG_<ID>__`
  (+ `__ACCESS_KEY_<ID>__` in the report) in the encrypted archive.
