---
slug: web-idor-enumeration
title: See other people's records by changing the ID
category: Web Application Security
skills: web, idor, access-control
difficulty: easy
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A record viewer (?id=N) shows any record to anyone who changes the id, including 'internal' ones the UI never links. One internal record carries the token; others are decoys (a retired/superseded token, an innocuous record).

## Player solve path
1. Note the id-based links on the public page.
2. Enumerate ids past the public range.
3. Find the internal record that leaks the token.

## What to plant
- FLAG: in the internal record the IDOR exposes.
- ACCESS KEY: a bit alongside — a different field of that record, or an adjacent internal id.

## Skin points (change per CTF)
Change: record type (tickets/orders/invoices), the ids, the story.
Keep: no access-control check on ?id=, an unlinked internal record, decoys.

## Blueprint mapping
hosted; build.py generates the records data (public + internal + decoys) with placeholders in the internal one; the app serves them through the viewer only.
