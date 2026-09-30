---
slug: secure-unsigned-token-admin-forge
title: Forge an unsigned session token to reach an admin endpoint
category: Secure Coding
source_ctf: Breaking CTF
difficulty: hard
skills: secure-coding, auth, token-forgery, source-review
box_type: download
status: built
---

## Mechanic (theme-agnostic)
The app ships as a downloadable source bundle (a small SPA front end plus an API server). Review shows the "session token" issued at login is nothing but Base64URL-encoded JSON carrying claims like `sub`, `role`, `iss`, `aud`, and a `legacy` flag — the code comments call it a "signed gateway envelope," but there is no signature or MAC anywhere, and the session middleware simply Base64URL-decodes the Bearer token and `JSON.parse`s it with zero verification. The admin endpoint authorizes purely on those decoded claims (`iss` equals a fixed issuer, `aud` equals a fixed audience, `role === 'admin'`), so any attacker can mint their own admin token offline. A second gate on that endpoint demands an `auditNonce`, but the nonce is not a secret: it is a deterministic hash — the first 16 hex chars of `SHA-256("<username>:<role>:<hard-coded-suffix>")`, where the suffix is a literal string visible in the source — so it too can be recomputed offline. The front-end "admin" button is only a client-side role check and is irrelevant to the exploit.

## Player solve path
1. Download and read the source; find that the token is unsigned Base64URL JSON, parsed by the session middleware with no signature/MAC check.
2. Read the admin endpoint to see exactly which claims it trusts (`iss`, `aud`, `role`) and how the required nonce is derived (SHA-256 of `username:role:suffix`, truncated to 16 hex chars, suffix hard-coded in the source).
3. Base64URL-encode a JSON payload with `role: "admin"` (and the correct `iss`/`aud`/`sub`/`legacy`) to forge an admin Bearer token, and compute the matching audit nonce offline.
4. Call the protected admin endpoint with the forged Bearer token and the computed nonce to receive the flag from its response.
