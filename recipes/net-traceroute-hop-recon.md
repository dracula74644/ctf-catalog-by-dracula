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

## What to plant
- FLAG: the resolved hostname of a hop in one internal trace.
- ACCESS KEY: a bit alongside — a hop hostname in a *different* internal trace
  (separate file), never the same trace/line.

## Skin points (change per CTF)
Change: node/host names, domain, the enumeration gate (robots vs directory index
vs a page comment), the decoy hops. Keep: public traces clean, internal targets
gated by enumeration, secrets = hop hostnames fetched on demand, flag and key on
two different traces.

## Blueprint mapping
hosted; static web server in target/. build.py writes an interactive console page
(public traces inline, internal traces fetched from separate data files) plus the
enumeration gate; the two internal trace data files carry `__FLAG_<ID>__` and
`__ACCESS_KEY_<ID>__` (different files). No live traceroute required.
