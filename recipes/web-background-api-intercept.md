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
On load, the page auto-fires background XHR/fetch calls whose JSON responses contain
secrets that never appear in the rendered UI. One endpoint (a telemetry/status API)
returns a response with the flag tucked in a `_debug` field; another (a session/auth
API) returns an access token. Because the leak is in traffic the browser makes on its
own, an intercepting proxy (Burp Suite, or the browser devtools Network tab) is the
intended way to see it — watch HTTP history after the page loads and read the two
background responses. Hitting the endpoints directly with curl is the equivalent.

## Player solve path
1. Point the browser's HTTP proxy at an intercepting proxy (e.g. Burp on 127.0.0.1:8080).
2. Load the page and watch HTTP history for the auto-fired background API calls.
3. Read the telemetry/status response's `_debug` field → the flag.
4. Read the session/auth response's `session_token` → the access key.
5. (Equivalent: `curl -s <url>/api/telemetry` and `curl -s <url>/api/auth/session`.)
