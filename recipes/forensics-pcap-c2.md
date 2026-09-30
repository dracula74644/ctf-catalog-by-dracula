---
slug: forensics-pcap-c2
title: Spot the malware phone-home in captured traffic
category: Network Security
source_ctf: Breach Response
skills: forensics, pcap, c2, network
difficulty: medium
box_type: download
status: built
---

## Mechanic (theme-agnostic)
Among noise, a host beacons to an attacker IP:port at a fixed interval. The beacon replies carry a payload; the flag is the C2 endpoint (ip:port), the key is inside a beacon reply body.

## Player solve path
1. Spot the periodic connections to one dst (fixed interval, N beacons).
2. Identify the C2 endpoint (flag).
3. Read the key from a beacon reply.
