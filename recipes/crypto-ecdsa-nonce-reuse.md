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
Two signed messages were produced by an ECDSA signer with a faulty RNG that reused
the same nonce `k`, so both signatures share the same `r`. Nonce reuse is fatal:
`k = (e1 - e2) / (s1 - s2) mod n`, then `d = (s1·k - e1) / r mod n` recovers the
private key. With `d`, the player forges a valid signature over a chosen message
(authorizing a restricted item) and submits it to a server that verifies the
signature **server-side** with only the public key — a real cryptographic gate, not
a string compare — which releases the flag only for a valid signature on the
restricted message.

## Player solve path
1. Notice two provided signatures share the same `r` (reused nonce).
2. Recover `k`, then the private key `d`, using the nonce-reuse equations.
3. Reconstruct the exact signed-message canonicalization (defined in the shipped
   verifier) for the restricted item.
4. Sign it with `d`; submit the forged signature to the registry → flag.

## What to plant
- FLAG: released by the server only on a valid forged signature (private key never
  shipped; no flag in the download).
- ACCESS KEY: a bit alongside — in the shipped README/verifier comments, separate from
  the flag path.

## Skin points (change per CTF)
Change: the curve/hash, the message schema, what the "restricted item" is, the story.
Keep: two signatures with a shared `r`; private-key recovery from nonce reuse;
server-side signature verification as the gate; private key never distributed.

## Blueprint mapping
- box_type: download (certs + public key + verifier) + a hosted registry that verifies.
- build.py forces the reused nonce to produce exact shared `r`, self-verifies the
  recover→forge→verify chain and no-leak; registry holds `__FLAG_<ID>__`,
  `__ACCESS_KEY_<ID>__` in the README.
