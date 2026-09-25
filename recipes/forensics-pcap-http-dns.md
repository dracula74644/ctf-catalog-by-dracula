---
slug: forensics-pcap-http-dns
title: Read a report and a DNS lookup out of a packet capture
category: Network Security
source_ctf: The Locker Network
difficulty: easy
skills: forensics, pcap, netsniff-ng, tcpdump, http, dns, bpf-filters
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A short, realistic capture of one host's traffic, about thirty-five packets: ARP, DNS
lookups, NTP, ICMP pings, syslog lines and one keep-alive HTTP session to an internal
service. During the session the host fetches a report, and the flag sits in the JSON body
of that HTTP response. Separately it resolves a name with a TXT query, and the access key
sits in the TXT answer. Two protocols, two packets, found by filtering rather than by
reading every packet.

## Player solve path
1. Download the capture.
2. Filter to the HTTP session, for example `netsniff-ng --in cap.pcap -f "tcp port <n>"`
   or `tcpdump -A -r cap.pcap 'tcp port <n>'`. The report response body holds the flag.
3. Filter to DNS with `udp port 53`. The TXT answer for one lookup holds the access key.
4. Or `strings cap.pcap | grep` for either value.

## What to plant
- FLAG: a field in the JSON body of one HTTP 200 response.
- ACCESS KEY: the TXT answer of one DNS response, a different packet and protocol.

## Skin points (change per CTF)
Change: the hosts and addresses, service name and paths, the domain queried, the JSON
field names, the noise traffic.
Keep: flag in an HTTP response body; key in a DNS TXT answer; enough surrounding noise
that filtering is worth doing; a small capture.

## Blueprint mapping
- hosted, although to the player it is a download. The blueprint's injector patches files
  as UTF-8 text, and a real pcap starts with binary magic bytes, so a plain download box
  cannot carry injected values. Instead the container crafts the pcap at boot from two
  injected text seeds and serves a one-link download page.
- `build.py` writes a flag seed with `__FLAG_<ID>__` and a key seed with
  `__ACCESS_KEY_<ID>__`. A generator script in `target/` builds the frames by hand with
  correct IP, TCP, UDP and ICMP checksums and writes a classic little-endian pcap, so the
  capture opens cleanly in any tool with no malformed-frame warnings.
- The entrypoint refuses to start if a placeholder survived, builds the pcap, deletes the
  seed, and serves the page. No runtime mounts.
- Check the capture's integrity with tshark's checksum validation and its protocol
  hierarchy before shipping.
