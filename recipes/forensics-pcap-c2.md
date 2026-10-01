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
One internal host is compromised and beacons out to an external command-and-control endpoint on a machine-like fixed cadence (e.g. a check-in every ~30s for roughly two dozen callbacks), hidden among irregular, many-hosted benign traffic. The discriminator is regularity plus destination: every other conversation is internal-to-internal or spread across varied external sites, while one internal host repeatedly opens short TCP sessions to the same outside address on the same port. Each check-in is its own small session (a new source port, a tiny HTTP GET to a web-looking path) so the beacon blends in as ordinary web traffic — this is the application-layer-protocol-as-cover technique (MITRE ATT&CK T1071). The flag is the C2 endpoint itself (`ip:port`). The C2's HTTP reply body tasks the victim and carries a separate per-deploy access token as a `key=<hex blob>` line, so following any one C2 stream yields the key, while the endpoint identification yields the flag.

## Player solve path
1. Build a conversation/endpoint summary (Wireshark **Statistics → Conversations**, IPv4/TCP tabs) and look for the one internal host talking to a single external address with an unusually high session count.
2. Confirm it is a beacon by cadence: filter to that endpoint's connection openers (`ip.addr == <ext> && tcp.port == <p> && tcp.flags.syn==1 && tcp.flags.ack==0`) and check the Time column shows an even, fixed interval between check-ins (an I/O graph shows evenly-spaced spikes).
3. Record the destination IP and port — that pair is the flag; note the technique is T1071 (C2 over a standard application protocol).
4. Avoid the decoy: the same victim also has a one-off high-port/other-port transfer to the same host (the exfil download) — the beacon is specifically the repeated fixed-interval channel, not that single large transfer.
5. Follow → TCP/HTTP Stream on one beacon session and read the server reply body — the `key=<hex>` value is the separate access key.
