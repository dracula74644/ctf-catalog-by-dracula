---
slug: logs-encoded-beacons
title: Decode a hidden message buried in the logs
category: Digital Forensics
source_ctf: First Shift
skills: log-analysis, encoding, forensics
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A large web access log (tens of thousands of lines) hides a small cluster of "beacon" requests to one low-traffic endpoint, each carrying a base64 payload in a query parameter. The endpoint is invisible by eye but trivially surfaced by a path-frequency count: it appears only ~15 times against 1,000+ hits for the busiest real path, so it drops to the bottom of a sorted `uniq -c` list. Most beacon payloads are decoys that base64-decode cleanly into harmless taunt strings; one of those decoded taunts is itself the hint — it states that a string here will not decode at all and must be read backwards. Exactly one beacon refuses to base64-decode, because its payload is valid base64 that has been string-reversed: base64 padding (`=`) sits at the END of a normal string, so reversing moves the `=` to the FRONT, which every decoder rejects outright. That hard decode failure is the entire signal, and it only works if padding is present — without a trailing `=` the reversed string would still be valid base64 and would quietly decode to noise, destroying the signal (the builder asserts padding exists). There is no cipher, no keyword, and nothing is needed from a second log source; every decoy decodes cleanly on purpose so the single meaningful failure is unambiguous.

## Player solve path
1. On the target box (over SSH) or in the provided log files, count requested paths and sort ascending so the rare endpoint falls to the bottom, e.g. `awk '{print $7}' access.log | sed 's/?.*//' | sort | uniq -c | sort -n | head`.
2. Extract every base64 query payload sent to that endpoint and decode each in a loop, e.g. `grep -o 'endpoint?d=[A-Za-z0-9+/=]*' access.log | cut -d= -f2-` piped through `base64 -d`.
3. Read the decoded results: nearly all are taunts/decoys ("test value, ignore", "wrong string", "the real one is elsewhere"); one decoy explicitly says a string here will not decode and to read that one backwards.
4. Identify the single payload that errors on decode — it begins with `=`, the tell-tale of reversed base64 whose padding has moved to the front.
5. Reverse that string and decode it: `echo '<string>' | rev | base64 -d`.
6. The recovered plaintext carries the flag and the submission key, planted together in that one payload.
