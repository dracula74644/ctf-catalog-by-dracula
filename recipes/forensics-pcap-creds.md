---
slug: forensics-pcap-creds
title: Find the login password in captured traffic
category: Network Security
source_ctf: Breach Response
skills: forensics, pcap, network
difficulty: easy
box_type: download
status: built
---

## Mechanic (theme-agnostic)
The capture hides one cleartext HTTP form login inside a large amount of benign baseline traffic (DNS lookups and ordinary GET page loads to many hosts), so the login must be filtered out, not stumbled on. The credential submission is an HTTP `POST` to an auth endpoint with `Content-Type: application/x-www-form-urlencoded`; the username and password therefore appear verbatim in the request body as `username=<u>&password=<p>&...` — no cracking, just reassembly. The flag is those recovered credentials in a `user:password` shape. The server's response in the very same TCP stream is a redirect that also carries a separate per-deploy access token in a custom response header (e.g. `X-Access-Key: <hex blob>`), so following one stream yields two separate finds: the creds (flag) from the request, the token (key) from the response header. Because it is a single reassembled conversation, request and response are both visible in one Follow-Stream view.

## Player solve path
1. Open the capture and cut the noise down to credential submissions with a display filter for form posts, e.g. `http.request.method == "POST"` (optionally pin the auth URI).
2. Among the few remaining packets, find the `POST` to the login endpoint and Follow → HTTP/TCP Stream to reassemble the whole conversation.
3. In the request half, read the url-encoded form body and extract `username`/`password` — format them into the flag's `user:password` form.
4. Scroll to the response half of the same stream and read the custom auth header carrying the hex token — that is the separate access key.
5. (Shortcut: a packet-string search for `password` jumps straight to the same stream.)
