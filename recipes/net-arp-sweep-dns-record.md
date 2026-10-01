---
slug: net-arp-sweep-dns-record
title: Sweep a subnet and query a DNS record to recover the values
category: Network Security
source_ctf: Downlink
difficulty: easy
skills: network enumeration, arp-scan, dns lookup, host inventory
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A hosted ground-segment console runs L2/L3 recon against a local segment. An ARP sweep
of the subnet enumerates the live hosts, and one of them carries a retained "asset
token" (the access key) as part of its inventory entry. Separately, a DNS TXT record for
one of the host names resolves to the flag. The challenge is straightforward
enumeration: inventory the segment by ARP, spot the host holding the token, and pull the
TXT record for the flag.

## Player solve path
1. Run an ARP sweep of the local subnet (`arp-scan -l`) to list the hosts.
2. Identify the host whose inventory entry carries a retained asset token → the access
   key.
3. Query the TXT record for the relevant host name
   (`nslookup -type=TXT <host>` / `dig TXT <host>`).
4. Read the TXT answer → the flag.
