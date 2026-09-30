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
