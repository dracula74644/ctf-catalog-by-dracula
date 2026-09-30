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
Source review reveals the "session token" is only Base64URL-encoded JSON — commented as a "signed envelope" but never signed or MAC'd. An admin endpoint trusts the `role` (and issuer/audience) claims straight out of the decoded token, so the player mints their own admin token. A second gate asks for a "nonce", but that nonce is a deterministic hash of known values (username, role, a hard-coded suffix in the source) — not a secret — so it can be recomputed offline.

## Player solve path
1. Read the source; find that the token is unsigned Base64URL JSON parsed with no verification.
2. Identify what the admin endpoint checks (role/iss/aud) and how the nonce is derived.
3. Forge a token with `role=admin` and the right iss/aud; compute the deterministic nonce.
4. Call the protected endpoint with the forged token + computed nonce.
