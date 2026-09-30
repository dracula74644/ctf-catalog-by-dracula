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
