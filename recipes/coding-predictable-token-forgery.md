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

## What to plant
- FLAG: server-side, gated behind the phrase (env secret, NOT in shipped source).
- ACCESS KEY: a bit alongside — a separate env value or a nearby endpoint, not in the
  shipped source and not on the flag's line.

## Skin points (change per CTF)
Change: the token formula's static prefix, the item names, the story, the UI copy.
Keep: token = hash of predictable inputs (no real entropy); a tolerant time window;
real secret env-injected so downloading the code can't shortcut it.

## Blueprint mapping
- box_type: hosted; the app's source is also the download (secrets stripped).
- build.py assembles the shipped zip minus compose/flag/solution; `__FLAG_<ID>__` and
  the phrase/`__ACCESS_KEY_<ID>__` are injected via env at runtime (placeholders only
  in the source).
