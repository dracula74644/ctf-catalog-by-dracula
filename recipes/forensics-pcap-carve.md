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
The capture contains a full HTTP download in which an attacker pulls a data-export file off the network, carried as a single `application/gzip` response body with a `Content-Disposition: attachment` filename. Because the object crosses the wire gzip-compressed, `strings`/grep over the raw packets reveal nothing — the readable content only exists after the transfer is reassembled and decompressed. The response is a well-formed TCP session (clean handshake, PSH data segments, teardown) so any HTTP-object exporter reassembles the body losslessly across its segments. Two distinct secrets sit inside the decompressed file on separate lines: the flag is one marker line (e.g. a commented `# exfil-marker:` row), and a separate rotating access token is a different commented line (e.g. `# access-key:`) a line below it — so recovering the flag and the key is one carve but two reads. The surrounding records are plausible decoy rows (benign-looking CSV data) so the marker must be read, not guessed.

## Player solve path
1. Scan the capture for file transfers rather than browsing individual packets — the signal is a single large HTTP response with a binary/gzip content type.
2. Use an HTTP object exporter (Wireshark **File → Export Objects → HTTP**, or `tshark --export-objects http,<dir>`) and pick the one export-shaped object (a `.gz` attachment) out of the benign pages.
3. Save that object and decompress it (`gunzip -c <file>.gz`, or any archive tool) — opening the raw `.gz` shows only compressed gibberish, which confirms you must decompress rather than read in place.
4. Read the decompressed file and pull the marker line — that is the flag.
5. From the same decompressed file, read the adjacent commented token line — that is the separate per-deploy access key (different line from the flag).
