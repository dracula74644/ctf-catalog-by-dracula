---
slug: net-scan-hidden-service-breach
title: Port-scan a host for an unlisted service, then pull a leaked credential record
category: Network Security
source_ctf: Downlink
difficulty: medium
skills: port scanning, service discovery, breach lookup, correlation
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
The host publishes an **advertised web app** (a breach-lookup / "have-I-been-pwned"
style portal) **and a second, unadvertised service on a different port**. Querying
the portal for a given account returns records: one holds the flag, another warns
that an internal archive is still exposed on an unlisted port. The player must
**port-scan the host** to find that second service, then match the *same account's*
row in the leaked dump to recover the access key. Decoy rows/accounts make blind
guessing fail. Neither secret is on the landing page — both require the recon.

## Player solve path
1. Query the advertised lookup portal for the target account -> flag in a record;
   note the hint about an exposed service on an unlisted port.
2. Port-scan the host to discover the unadvertised service.
3. Open it; find the target account's row in the dump -> that field is the key
   (decoy rows are rejected by the platform).

## What to plant
- FLAG: a record/field in the advertised portal's result for the target account.
- ACCESS KEY: a bit alongside — the same account's row on the separate,
  scan-discovered service (different port, different file).

## Skin points (change per CTF)
Change: portal theme, account identifiers, record wording, decoy rows, the second
service's flavor. Keep: one advertised web app + one unadvertised service on
another port, discovery by scanning, correlate by the same account, decoys present.

## Blueprint mapping
hosted; TWO compose services (advertised portal + unadvertised service on a
different published port). build.py builds both site trees; `__FLAG_<ID>__` goes in
the portal's data, `__ACCESS_KEY_<ID>__` in the second service's dump row.
