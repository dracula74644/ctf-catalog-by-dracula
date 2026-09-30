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
A multi-stage packet-capture chain in which the on-page hint deliberately steers the player onto a decoy. The first capture is full of noise and carries route-slip records on one UDP port, each record tagged with a color mark, a slot number, and a hex fragment (`mark=<color>|slot=NN|hex=...|note=directory-fragment`). The page hint pushes the "winner" color — that trail is the decoy: its fragments, sorted by slot and hex-decoded, name a directory holding a second decoy capture (records on different UDP ports, two streams reassembled by sequence) whose payloads all decode to a taunt telling the player they followed the wrong color and to go back. The real color's fragments, sorted by slot and hex-decoded, name a directory holding the real second capture, which carries its fragments over a *different* protocol (e.g. ICMP echo payloads tagged `P2-HEX seq=NN`); reassembled by seq and hex-decoded, they name a final archive directory. That directory holds ~100 filler captures plus many text/log files with fake "real flag" filenames; the size-sort shortcut is neutralized (all text files are padded to the same size) and the file contents use near-miss keys (`...real-fl4g=`, `...rea1_flag=`, `...real_flag?=`, `...realflag=`). Only the file whose key matches the exact expected spelling (`real_flag=`) holds the true flag.

## Player solve path
1. Open capture 1; filter for the route-slip records on their UDP port and separate them by color mark.
2. For the decoy (hinted) color, sort fragments by slot, concatenate the hex, and decode to a directory name; fetch the second capture there and reassemble its streams by sequence — confirm it is a dead-end taunt.
3. Repeat for the real color: sort by slot, hex-decode → the real second capture's directory; fetch it.
4. In the second capture, collect the fragments carried over the different protocol (by seq), concatenate the hex, and decode → the final archive directory name.
5. In that directory, ignore the same-size padded near-miss decoy files and open the one file whose key is spelled exactly right to read the flag.
