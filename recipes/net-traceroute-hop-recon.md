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
A hosted looking-glass console runs traceroutes. Tracing the public/advertised nodes
returns clean routes with nothing useful, but `robots.txt` leaks a hidden looking-glass
path, and a node list under it names internal/"restricted" nodes that are not advertised
anywhere else. Tracing those restricted nodes returns hop data whose reverse-DNS hop
hostnames (and the backing per-node trace JSON the console fetches) embed the secrets —
one restricted node's hops carry the flag, another's carry the access token. The lesson
is content-discovery plus reading meaning out of hop hostnames rather than the route
itself.

## Player solve path
1. Fetch `robots.txt` → it discloses the hidden looking-glass path.
2. Pull the node list under that path and grep for the restricted/internal nodes.
3. Traceroute each restricted node in the console (or fetch its backing trace JSON,
   `/lg/trace/<node>.json`).
4. Read the flag out of one restricted node's hop hostnames/trace.
5. Read the access key out of the other restricted node's hop hostnames/trace.
