---
slug: net-pcap-decoy-trail-chain
title: Follow the right packet trail through chained captures to a hidden file
category: Network Security
source_ctf: Breaking CTF
difficulty: medium
skills: network, pcap, wireshark, tshark, hex, decoys
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A first capture carries several color-tagged route trails whose payloads are hex fragments with slot numbers. A tempting decoy trail (the page hint points at it) decodes to a directory holding a second decoy capture that literally says "you followed the wrong colour — go back". The real trail's fragments, sorted by slot and hex-decoded, name a directory holding the real second capture. That capture's payloads (across a different protocol/port) decode to a final archive directory. That directory is full of near-miss decoy filenames and same-size padded text files; only the file whose key matches *exactly* holds the flag.

## Player solve path
1. In capture 1, extract fragments per color; sort by slot, hex-decode → candidate directory names.
2. Follow the decoy color, confirm it is a dead end, then follow the real color to capture 2.
3. Decode capture 2's payloads → final archive directory name.
4. In that directory, ignore near-miss decoys (size trap is neutralized); open the exact-key file.

## What to plant
- FLAG: in the single exact-key file among the decoys.
- ACCESS KEY: a bit alongside — a second line in that same exact-key file (never in the pcaps, listings, or decoy files).

## Skin points (change per CTF)
Change: colors/marks, ports/protocols, directory names, the decoy "wrong colour" taunt, filename near-misses.
Keep: decoy vs real trail + slot-sorted hex fragments → directory chain + exact-key file among padded decoys.

## Blueprint mapping
hosted; static service serving capture 1 and the derived directories/captures. build.py encodes directory names into packet payloads and writes the exact-key file with __FLAG_<ID>__ / __ACCESS_KEY_<ID>__ plus padded decoys.
