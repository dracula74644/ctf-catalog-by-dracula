---
slug: coding-predictable-token-forgery
title: Forge an approval token built from predictable inputs by reading the source
category: Secure Coding
source_ctf: Digital Museum: The Archive of a Breach
difficulty: easy
skills: secure-coding, code-review, predictable-token, hashing, md5
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A live app's own source is the download. It authorizes a sensitive action with a
"security token" that is really a hash of fully predictable inputs — e.g.
`md5(f"<static-prefix>:<item>:<unix-timestamp>")`. Hashing isn't entropy: the player
reviews the source, reads the request's creation timestamp shown in the UI, and
recomputes the exact hash for a restricted item, then submits it to bypass the
approval step. The endpoint accepts any token within a small recent-time window, so
the player can use their own clock. The reward is a phrase that unlocks the flag.

## Player solve path
1. Read the shipped source; find the token = hash of predictable fields.
2. Read the restricted item and the request timestamp from the app.
3. Recompute the token for that item + timestamp.
4. POST it to the approval endpoint → reveals the vault phrase → flag.
