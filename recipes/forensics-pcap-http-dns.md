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
Players download a packet capture that carries two independent channels. An HTTP
session on an application port contains a JSON response body whose `verdict`-style field
holds the flag. Separately, DNS traffic in the same capture carries the access token in
a TXT-style answer. Neither secret is in packet headers or filenames — each is in the
payload of its respective protocol, so the solve is about applying the right
protocol/BPF filter to each channel and reading the application data.

## Player solve path
1. Download the capture from the box.
2. Filter the HTTP/application-port traffic and extract the JSON field, e.g.
   `tcpdump -A -r cap.pcap 'tcp port <app>' | grep -o '"verdict":"[^"]*"'` → the flag.
3. Filter the DNS traffic and read the answer, e.g.
   `tcpdump -A -r cap.pcap 'udp port 53' | grep -o 'token=[0-9a-f]*'` → the access key.
4. (`netsniff-ng --in cap.pcap -f "<bpf>"` or `strings cap.pcap | grep -E 'verdict|token='`
   recover the same two values.)
