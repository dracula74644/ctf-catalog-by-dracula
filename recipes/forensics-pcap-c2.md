---
slug: forensics-pcap-c2
title: Identify C2 beaconing and read the beacon payload
skills: forensics, pcap, c2, network
difficulty: medium
box_type: download
category: with_key
source: CTF2 "Breach Response" — flag 2
status: built
---

## Mechanic (theme-agnostic)
Among noise, a host beacons to an attacker IP:port at a fixed interval. The beacon replies carry a payload; the flag is the C2 endpoint (ip:port), the key is inside a beacon reply body.

## Player solve path
1. Spot the periodic connections to one dst (fixed interval, N beacons).
2. Identify the C2 endpoint (flag).
3. Read the key from a beacon reply.

## What to plant
- FLAG: the C2 destination (ip:port).
- ACCESS KEY: a bit alongside — in a beacon reply body (a different packet than where you ID the endpoint).

## Skin points (change per CTF)
Change: attacker IP/port, interval, beacon count, protocol dressing.
Keep: regular beaconing to one dst; key in the reply.

## Blueprint mapping
download; build.py generates the pcap with beacons + noise. Reference: CTF2 datagen/pcapgen.py (C2 section).
