---
slug: web-robots-and-exposed-config
title: Leak one secret from the crawl policy and another from an exposed config file
category: Web Application Security
source_ctf: RED RANGE
difficulty: easy
skills: web, enumeration, content-discovery, information-disclosure, dirbusting
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A web service over-shares through its crawl policy: robots.txt carries one token in
an entry that enumeration (or an http-enum/NSE script) surfaces. A second token hides
in an unlinked, sensitive config file — an exposed dotfile/backup that is referenced
nowhere and is NOT listed in robots — reachable only by brute-forcing common
filenames. So one token falls to simple enumeration and the other requires content
discovery. Exploitable because the crawl policy discloses too much and a sensitive
file was left web-accessible.

## Player solve path
1. Enumerate the service; read robots.txt (or run an http-enum/robots NSE script) —
   one token is in an entry.
2. Run directory/content brute-forcing against common filenames to find the exposed
   config file that robots does not mention.
3. Read the second token from that file.

## What to plant
- FLAG: as an entry (or comment) in the crawl policy / robots.txt.
- ACCESS KEY: in an exposed, unlinked config file that the crawl policy does NOT
  list — found only by content discovery, never the same spot as the flag.

## Skin points (change per CTF)
Change: the site theme and copy, the robots entries, the exposed filename (keep it a
name common wordlists actually try).
Keep: robots discloses one token; a separate unlinked, web-accessible config holds
the other and must be brute-forced.

## Blueprint mapping
- box_type: hosted; static nginx site.
- build.py writes robots.txt with `__FLAG_<ID>__` in an entry and an exposed config
  file with `__ACCESS_KEY_<ID>__`, unlinked and absent from robots; inject.manifest
  lists both. Ensure the server serves the (often dotfile) config path.
