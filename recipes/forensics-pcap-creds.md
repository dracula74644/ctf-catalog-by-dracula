---
slug: forensics-pcap-creds
title: Recover cleartext credentials from a packet capture
skills: forensics, pcap, network
difficulty: easy
box_type: download
category: with_key
status: built
---

## Mechanic (theme-agnostic)
A capture contains a cleartext (HTTP/FTP/etc.) login. The creds are in the request; a paired token rides in a response header (e.g. X-Access-Key) so it's a separate find from the flag creds.

## Player solve path
1. Open the pcap (Wireshark/tshark).
2. Follow the cleartext auth stream.
3. Read the creds (flag) and the response-header token (key).

## What to plant
- FLAG: the recovered credentials in the request.
- ACCESS KEY: a bit alongside — in the response header/body of the same exchange, not the same packet field.

## Skin points (change per CTF)
Change: protocol, hostnames, the account, surrounding traffic.
Keep: one cleartext auth exchange; token in a nearby field.

## Blueprint mapping
download; build.py generates the pcap with the exchange (placeholders baked into the built bytes).
