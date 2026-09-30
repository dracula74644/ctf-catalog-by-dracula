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
Footprint a host by chaining passive discovery + active recon against *self-hosted*
look-alikes (real public services like Shodan/whois can't be seeded with your
data). An advertised **search/index page** (a self-hosted host-search clone) orients
the player: it shows the host, its open ports, and hints — but no secrets. A
**self-hosted whois service** (raw TCP, port 43) returns a registration record whose
free-text *remarks* field is the flag. A separate **raw-TCP banner service** emits a
banner containing the access key, lifted with a banner grab (dmitry/nc). The two
secrets live in two different self-hosted services.

## Player solve path
1. Use the search page to find the host, its domain, and the open ports.
2. whois the domain against the host -> the remarks field is the flag.
3. Banner-grab the diagnostics port -> the banner line is the access key.
