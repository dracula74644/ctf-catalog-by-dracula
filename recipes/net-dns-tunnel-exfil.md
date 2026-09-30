---
slug: net-dns-tunnel-exfil
title: Reassemble data exfiltrated over DNS-tunnel subdomains in a capture
category: Network Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: network, pcap, dns-tunneling, base32, wireshark, exfiltration
box_type: download
status: built
---

## Mechanic (theme-agnostic)
Players get a packet capture (plus a resolver query log and a topology diagram)
where a single host exfiltrates a stolen record over DNS tunneling, hidden among
realistic benign traffic. There is no HTTP/FTP and nothing on disk — the data leaves
as DNS itself. The record is Base32-encoded (charset `A-Z2-7`, padding stripped) and
split across many long subdomain labels (~40 chars each), sent as A queries to one
attacker-controlled domain that is not on the allowlist, at a rate far above the
per-host baseline (e.g. a 50-queries/min baseline blown past at ~100+/min — a short
burst of a couple dozen queries in ~15 seconds). The tell is *behaviour + destination*,
not length: routine DKIM/SPF/DMARC and telemetry lookups are also long and must be
discounted. The decoded record contains an authentication phrase that a gate exchanges
for the flag.

## Player solve path
1. Open the capture; baseline with the `dns` filter and use Statistics ▸ DNS /
   Conversations to find the noisy host, then confirm it exceeds the stated per-host
   query-rate baseline in a short window.
2. Narrow to outbound queries to the non-allowlisted domain, e.g.
   `dns.flags.response==0 && dns.qry.name contains "<c2-domain>"` (add
   `ip.src==<host>` to pin it); note the ~40-char `A-Z2-7` Base32 labels and ignore
   the benign long lookups.
3. Extract the qnames **in time order**:
   `tshark -r cap.pcapng -Y '<filter>' -T fields -e dns.qry.name` (the resolver log
   holds the same names already time-sorted as an alternative source).
4. Strip the `.<c2-domain>` suffix from each, concatenate, re-pad with `=` up to the
   next multiple of 8, and Base32-decode → the stolen record → the auth phrase.
5. Submit the phrase to the authentication gate (case/spacing normalized) → flag.
