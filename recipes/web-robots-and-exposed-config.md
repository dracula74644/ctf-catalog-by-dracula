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
A web service leaks two secrets through basic content discovery. Its `robots.txt` crawl
policy lists several `Disallow` entries, and one of those disallowed paths has the flag
embedded directly in it (the "don't index this" list becomes the leak). Separately, a
leftover dotfile config such as `.env` was deployed into the web root and is served
openly; it contains a submission/access token. Standard enumeration — reading robots.txt
and directory-brute-forcing for exposed files — surfaces both.

## Player solve path
1. Enumerate the web service and read `robots.txt` (directly, or via
   `nmap --script http-robots.txt`).
2. Inspect the `Disallow` entries — one path has the flag embedded in it.
3. Directory-brute the site (`dirsearch`/`gobuster`/`ffuf`) to find an exposed dotfile
   config (e.g. `/.env`).
4. Fetch that file and read its token field → the access key.
