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
A record-viewer endpoint takes a bare integer id (`?id=N`), casts it, and returns the matching record with **no session or authorization check** — classic IDOR. Records flagged "internal / staff-only" are handled the same way: the page even renders an "INTERNAL — staff only" banner for them but never actually enforces it (it prints the warning, then still outputs the body). Only a handful of low ids are linked from the public homepage; the internal records live just beyond that range and are never linked, so they are reached purely by incrementing the id. The backing data store is a server-side file that the server *executes* when requested directly (returning nothing), so there is no source-leak shortcut — the only way to read a record is through the viewer with a tampered id. One internal record carries the stage token; decoys are mixed in: a "retired/superseded token" record (a decoy key that is rejected) and an innocuous internal record with nothing sensitive.

## Player solve path
1. **Find the parameter and the public range.** Scrape the homepage for the id-based links (e.g. `grep -o '/view?id=[0-9]*'`) — they reveal the viewer and the ids the UI exposes.
2. **Read a normal record** to learn the response format (subject, status, body).
3. **Walk the ids upward**, past the public range (a short `for` loop over `id=1..N`), grepping each response for an internal banner or a token pattern.
4. **Identify the internal record** that shows the staff-only banner *and still renders its body* — that mismatch is the bug; its body holds the token.
5. **Avoid the decoys**: the retired-token record (its key will not validate) and the empty internal record. Note that requesting the backing data file directly returns nothing, confirming the viewer is the only path.
6. The **flag and the access key both sit in that one internal record's body** (same response).
