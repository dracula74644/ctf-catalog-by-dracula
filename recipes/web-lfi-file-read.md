---
slug: web-lfi-file-read
title: Read hidden server files through the website
category: Web Application Security
source_ctf: Breach Response
skills: web, lfi, path-traversal
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A document-viewer endpoint (`?file=<name>`) joins a user-supplied name onto a fixed docs base directory and returns the file. The traversal filter has an order-of-operations bug: it inspects the **raw, still-percent-encoded** query value and rejects a literal `../` / `..\`, a leading `/`, or a leading `\`, but the value is URL-decoded **after** that check — so a percent-encoded traversal (`%2e%2e%2f` → `../`, or mixed forms like `..%2f`, `%2e%2e/`, or an encoded absolute `%2f...`) passes the filter and is decoded into a working traversal afterward. The intended index view leaks the recon needed: it lists the docs and prints the base directory, and a planted doc (a hardening checklist) discloses the out-of-tree runtime path where the token file is written. A containment check is layered on: after decoding, the resolved realpath must be inside the docs store or be exactly the one planted token file, so the encoded-traversal bypass reaches only that token — not other flags, env/secret files, the app source, or the database. The token file holds the flag and a separate per-deploy access key on different lines.

## Player solve path
1. Hit the viewer with no/args to get the index — note the base docs directory it prints and read the listed docs, including a checklist that leaks the out-of-tree runtime token path.
2. Confirm the naive filter: a literal `?file=../../../<path>` and an absolute `?file=/<path>` both return a 403 "path traversal blocked" alert.
3. Bypass by percent-encoding the traversal so the raw value contains no literal `../` — e.g. `?file=%2e%2e%2f%2e%2e%2f%2e%2e%2f<runtimedir>/<tokenfile>`, going up enough levels (docs → … → root of the runtime path) then down to the token file.
4. Read the returned file: the flag is one line, the separate access key is the adjacent `ACCESS_KEY:` line — both recovered in the same read.
5. (Containment note: paths resolving outside the docs store except the one token file are denied, so point the traversal precisely at the leaked token path.)
