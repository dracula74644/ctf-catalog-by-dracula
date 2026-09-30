---
slug: web-idor-hidden-record
title: Reach a hidden record by guessing its sequential ID
category: Web Application Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: easy
skills: web, idor, broken-access-control, enumeration, robots-txt
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A record-viewer endpoint takes a sequential id (`?id=<seq>`) and looks it up in a
database with NO authorization check, returning any row regardless of its status
field. Public records occupy an obvious contiguous range (e.g. 001–008); one extra
record just past that range is flagged "private/internal" and holds the secret, but no
UI element ever links to it and the landing page only advertises the public count. A
light discovery trail proves the extra record exists: `robots.txt` disallows an
internal asset directory; requesting that directory returns 403 (the route calls
`abort(403)` — no listing), but individual files inside are still served if named
exactly, and one predictably-named asset (continuing the public numbering, e.g. the
"09" preview) loads and confirms a record beyond the public range. The player then
simply increments the id past the public maximum; because the lookup never checks the
status field, the private record is served identically to a public one.

## Player solve path
1. Browse the public listing; note the id-based viewer URL and contiguous numbering,
   and confirm where the public range ends.
2. Read `robots.txt` → a disallowed internal asset directory.
3. The directory itself 403s (no listing), but guess the next asset name by continuing
   the public numbering; it loads and hints an unlisted record exists.
4. Request the next id past the public maximum on the viewer endpoint → the private
   record renders with no auth check → secret/flag is shown on that record.
