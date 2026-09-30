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
A full multi-artifact DFIR case: an NTFS disk image (E01), a FAT removable-media
image, a firewall log, a parsed security-event log (CSV, EvtxECmd/Chainsaw-style),
browser history (SQLite), a set of emails (`.eml`), and a memory dump. The cover
story is a ransomware hit; correlating timestamps proves the opposite — the data was
copied to removable media and exfiltrated *before* the loud encryption/cleanup ran,
so the ransomware is a distraction. The security log tells the story through Windows
event IDs: 4624 logon (who), 4663 object access (archive opened / copied), 6416
removable-media mount (with device serial), 4688 process creation (7-Zip packaging,
`curl` upload, `powershell` cleanup), 1074 shutdown — the theft window precedes the
cover event. The flag lives in an AES archive whose password exists only transiently
in the memory dump (as clipboard text and as the 7-Zip command line); the archive
itself was deleted from the FAT image but is contiguous and recoverable. Both disk
images are scrubbed so `FLAG`/password grep returns nothing — the solve is the
timeline plus RAM recovery, not string search.

## Player solve path
1. Read the tasking, then reconstruct a minute-by-minute timeline from the parsed
   security-event CSV, mapping each event ID (logon → object access → USB mount →
   process creation → shutdown) to who/how/when.
2. Show the copy→archive→upload window occurs *before* the ransomware/cleanup step,
   corroborated by the firewall log's large outbound transfer, the browser history
   (archiver download, cloud login, upload host), and the pretext/buyer emails.
3. Carve the RAM: `strings memory.raw | grep` for the archiver command line and
   clipboard remnants → the archive password.
4. Undelete the archive from the FAT removable-media image (`fls -rd` to find the
   deleted entry, `icat` to dump it; PhotoRec/foremost also work).
5. Extract the archive with the memory-recovered password → flag.
