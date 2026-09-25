---
slug: forensics-pcap-carve
title: Pull a stolen file out of captured traffic
category: Network Security
source_ctf: Breach Response
skills: forensics, pcap, file-carving
difficulty: medium
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A file was exfiltrated over HTTP as a gzip object. The player carves the transferred object out of the pcap, decompresses it, and reads the contents (e.g. a customers CSV) that name what was stolen.

## Player solve path
1. Find the HTTP object transfer in the pcap.
2. Export/carve the object, gunzip it.
3. Read the carved file.

## What to plant
- FLAG: inside the carved file (a marker line).
- ACCESS KEY: a bit alongside — another line/section of the carved file.

## Skin points (change per CTF)
Change: object name/type, transport, the data.
Keep: a carvable transferred object with flag+key inside.

## Blueprint mapping
download; build.py generates the pcap embedding the gzip object.
