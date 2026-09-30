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
A viewer endpoint (`?id=<seq>`) applies no authorization check. Public records run in
an obvious sequence; one extra record past the public range is marked "private" and
holds the flag, but the UI never links to it. A light discovery trail hints it exists:
`robots.txt` disallows an internal path, and while that directory 403s, a single
internal asset in it is directly fetchable and proves a further record exists. From
there the player just increments the id.

## Player solve path
1. Browse the public listing; note the id-based URLs and how ids increment.
2. Read `robots.txt` → a disallowed internal path; the dir 403s but a named asset in
   it loads, hinting at an unlisted record.
3. Request the next id past the public range → the private record → flag.

## What to plant
- FLAG: in the hidden/private record the IDOR exposes.
- ACCESS KEY: a bit alongside — a separate field of that record or an adjacent
  internal id, never the same line as the flag.

## Skin points (change per CTF)
Change: record type, id format, the asset name that hints at the hidden record, story.
Keep: no authz on `?id=`, a sequential unlinked private record, a light robots/asset
discovery trail.

## Blueprint mapping
- box_type: hosted; a small app serves records from a store through the viewer only.
- build.py generates public + hidden records, injecting `__FLAG_<ID>__` into the
  private one and `__ACCESS_KEY_<ID>__` into a separate field; robots.txt + one
  reachable internal asset added as the hint.
