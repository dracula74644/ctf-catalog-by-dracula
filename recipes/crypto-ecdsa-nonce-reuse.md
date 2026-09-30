---
slug: crypto-ecdsa-nonce-reuse
title: Recover an ECDSA private key from a reused nonce and forge a signature
category: Cryptography
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: crypto, ecdsa, nonce-reuse, signature-forgery, p-256
box_type: download
status: built
---

## Mechanic (theme-agnostic)
Two recorded messages were signed with ECDSA over NIST P-256 (secp256r1) using
SHA-256, where the signed message is a canonical-JSON body (keys sorted, no
whitespace) hashed to the scalar `e`. A faulty RNG reused the per-signature nonce `k`
across both signatures, so both carry the same `r` — the tell. Nonce reuse is fatal:
from `(r, s1, e1)` and `(r, s2, e2)`, `k = (e1 - e2) / (s1 - s2) mod n`, then
`d = (s1·k - e1) / r mod n` recovers the private key (`n` = the P-256 group order,
inverses via `pow(x, -1, n)`). With `d` the player forges a valid signature over a
chosen restricted message and submits it to a server that verifies **server-side**
with only the public key — a real ECDSA verification, not a string compare — releasing
the flag only for a valid signature whose body equals the restricted item. The exact
message canonicalization is defined in the shipped verifier and must be reproduced
byte-for-byte, since it is what gets hashed to `e`.

## Player solve path
1. Read the shipped verifier to learn the scheme (P-256 / SHA-256, canonical-JSON body
   → `e`) and the group order `n`.
2. Verify the two provided signatures; observe both carry the same `r` (reused nonce).
3. Reconstruct each message hash `e1`, `e2` exactly as the verifier does; read
   `r, s1, s2` from the signatures.
4. Recover `k`, then the private key `d`, via the nonce-reuse equations (modular
   inverse mod `n`). Sanity-check that `d·G` equals the published public key.
5. Build the restricted body, hash it with the same canonicalization to `e'`, and sign
   with `d` and any fresh nonce `k'` (`r' = (k'·G).x`, `s' = k'^-1(e' + r'·d) mod n`) —
   a crypto lib's P-256 signer handles the point math.
6. Confirm offline with the shipped verifier, then submit the forged signature to the
   server → it re-verifies and releases the flag.
