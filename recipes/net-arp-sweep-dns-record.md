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
A hosted operations **console** lets the player run local-network recon commands and
streams the (simulated) output. An **ARP sweep** of a subnet lists the hosts; one
*decommissioned* host carries a retained "asset token" on its inventory line — that
token is the access key. A **DNS TXT lookup** for that same host returns the flag.
Both are fetched on demand when the commands run, so nothing is in the landing page
source. Layer-2 ARP can't run live against a single routed host, so the sweep is
produced application-side; DNS can be simulated the same way or served by a real
resolver.

## Player solve path
1. Run the ARP sweep in the console -> spot the decommissioned host and read its
   retained asset token (the access key).
2. Run a DNS TXT lookup for that host -> the record is the flag.

## What to plant
- FLAG: the target host's DNS TXT record.
- ACCESS KEY: a bit alongside — the target host's asset-token field in the ARP
  sweep output (a different data source).

## Skin points (change per CTF)
Change: subnet, host names/MACs, the "decommissioned" flavor, record wording.
Keep: an ARP sweep listing hosts with the key on one host's line, a DNS TXT record
holding the flag, and fetch-on-demand so the landing page stays clean.

## Blueprint mapping
hosted; nginx serving an interactive console page. build.py writes the console +
two on-demand data files: the ARP-sweep data (`__ACCESS_KEY_<ID>__`) and the
DNS/zone data (`__FLAG_<ID>__`), different files. Optionally a real DNS container
instead of a simulated lookup.
