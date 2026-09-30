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
A public form stores user input unsanitized. A privileged, admin-only review page
renders that input without escaping (an XSS sink) and is visited periodically by a
real headless-browser "moderation bot" logged in as admin. An internal API endpoint
is gated only by the admin session and returns the flag. The bot's session cookie is
HttpOnly (can't be stolen), so the payload must *act as* the admin: from inside the
bot's page, `fetch()` the internal API and exfiltrate the response to an attacker-
readable collector. The player reads the result back from the collector.

## Player solve path
1. Find the stored-input form and confirm it renders unescaped on an admin-only page.
2. Discover (or infer) the internal admin-only API that returns the secret.
3. Store an XSS payload that, when the bot renders it, calls the internal API and
   POSTs the response to the provided collector.
4. Wait for the bot to visit; read the exfiltrated data back from the collector → flag.

## What to plant
- FLAG: returned by the internal admin-only API (bot-context only).
- ACCESS KEY: a bit alongside — in a different admin-only response field or a nearby
  endpoint, not the same payload as the flag.

## Skin points (change per CTF)
Change: what the form is for, the review-page story, the API path, the collector UI.
Keep: stored XSS → HttpOnly admin bot → payload must exfil an admin-gated API's
response (cookie theft is intentionally blocked).

## Blueprint mapping
- box_type: hosted; app + a headless-browser bot run together in the container.
- build.py injects `__FLAG_<ID>__` into the internal API response and
  `__ACCESS_KEY_<ID>__` into a separate admin field; bot logs in server-side via an
  HttpOnly cookie and polls the review page.
