---
slug: net-traceroute-hop-recon
title: Read hidden values out of a traceroute's hop hostnames
category: Network Security
source_ctf: Downlink
difficulty: medium
skills: network recon, traceroute, reverse-dns, web enumeration
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A hosted "looking-glass" / network-diagnostics console renders traceroute output.
Advertised (public) targets trace clean; the payload lives in the **reverse-DNS
(PTR) hostname of a specific hop** on *unadvertised internal* targets. The console
only lists the public targets — the internal target names are gated behind light
web enumeration (e.g. `robots.txt` -> a node registry). Because a single routed
host can't synthesise crafted intermediate hops, the trace is produced
application-side (served/simulated), and the per-hop data is fetched on demand so
nothing sensitive is in the landing page source. Difficulty is enumeration +
picking the right hop among decoys, not a crypto puzzle.

## Player solve path
1. Open the console; confirm the listed (public) traces are clean.
2. Enumerate a gate (robots.txt / an index) that names the unlisted internal targets.
3. Trace each internal target; read the reverse-DNS name of the anomalous hop.
4. One internal trace's hop name is the flag; a different one's carries the key.
