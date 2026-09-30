---
slug: forensics-pcap-creds
title: Find the login password in captured traffic
category: Network Security
source_ctf: Breach Response
skills: forensics, pcap, network
difficulty: easy
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A capture contains a cleartext (HTTP/FTP/etc.) login. The creds are in the request; a paired token rides in a response header (e.g. X-Access-Key) so it's a separate find from the flag creds.

## Player solve path
1. Open the pcap (Wireshark/tshark).
2. Follow the cleartext auth stream.
3. Read the creds (flag) and the response-header token (key).
