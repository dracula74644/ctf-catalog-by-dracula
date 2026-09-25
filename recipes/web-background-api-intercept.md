---
slug: web-background-api-intercept
title: Read secrets from a page's background API responses with an intercepting proxy
category: Web Application Security
source_ctf: RED RANGE
difficulty: easy
skills: web, http-proxy, api, traffic-interception, xhr
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
On load, a page fires background XHR/fetch requests to API endpoints, and those
endpoints return JSON that carries sensitive tokens the UI never displays (the page
renders only benign fields). Because the secrets travel in responses that are not in
the rendered page and not in the main HTML source, the player must observe the
browser's own traffic: routing the browser through an intercepting proxy (or the
network tab) exposes the background request/response pairs and the tokens inside.
Exploitable because sensitive data is returned to the client regardless of what the
interface chooses to show.

## Player solve path
1. Point the browser's proxy at an intercepting proxy; load the target.
2. In the proxy's HTTP history, find the background requests the page fired on load.
3. Read the tokens out of those JSON responses.

## What to plant
- FLAG: in the JSON body of one background endpoint's response.
- ACCESS KEY: in the JSON body of a DIFFERENT background endpoint (a separate
  request), never the same response as the flag.

## Skin points (change per CTF)
Change: endpoint paths, JSON field names, the app/console theme and copy.
Keep: the page auto-fires background requests whose responses carry the tokens, with
nothing sensitive shown in the rendered page or main source.

## Blueprint mapping
- box_type: hosted; static nginx page + a small JS that fetches two static JSON
  endpoints on load.
- build.py writes the page/JS and two JSON files, placing `__FLAG_<ID>__` in one
  response and `__ACCESS_KEY_<ID>__` in the other; inject.manifest lists both.
