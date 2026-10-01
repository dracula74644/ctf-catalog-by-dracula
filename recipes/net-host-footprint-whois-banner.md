---
slug: net-host-footprint-whois-banner
title: Footprint a host with search, whois, and banner grabbing
category: Network Security
source_ctf: Downlink
difficulty: medium
skills: osint, host footprinting, whois, banner grabbing, service enumeration
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A Shodan-style search clone, queried by organisation, discloses the target host, its
open ports, and a domain that "resolves to this deployment". Two of those services then
leak the secrets: a whois service on port 43 returns the flag in a `Remarks` field when
queried for the domain, and a second service port returns the access token in its
banner / a response header (e.g. an `X-Access-Token` line). The chain is pure external
footprinting — discover via search, confirm via whois, then banner-grab — with no
exploitation.

## Player solve path
1. Search the Shodan-clone for the org → the host, its open ports, and the domain.
2. Query whois for the domain against the host's port 43 (`whois -h <host> <domain>`, or
   a raw `nc <host> 43` query) and read the `Remarks` field → the flag.
3. Banner-grab the other disclosed service port (`dmitry -pb`, or `nc <host> <port>`).
4. Read the banner/header (e.g. `X-Access-Token`) → the access key.
