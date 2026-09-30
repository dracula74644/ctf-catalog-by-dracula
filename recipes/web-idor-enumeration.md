---
slug: web-idor-enumeration
title: See other people's records by changing the ID
category: Web Application Security
source_ctf: Deep Access
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
