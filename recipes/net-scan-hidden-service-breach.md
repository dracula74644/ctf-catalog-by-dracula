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
An advertised "breach lookup" web service lets you query an account and returns its
leaked records; one record's recovery note is the flag. Another record hints that an
internal leak archive is still exposed on an *unlisted* port of the same host — a port
the portal never links. Port-scanning the host reveals that extra open service (Service
B) alongside the advertised ones. Service B lists per-account rows, and matching your
queried account's row yields the submission/access token. The challenge chains an
information leak into a service-discovery step and a correlation step (same account
across two services).

## Player solve path
1. Query your account in the advertised breach-lookup service → the flag in a recovery
   note.
2. Note the record hinting that an internal leak archive is exposed on an unlisted port.
3. Port-scan the host (nmap / a TCP-connect sweep) to find the extra open port not
   linked by the portal.
4. Open that hidden leak-archive service and find the row for your account.
5. Read that row's token → the access key.
