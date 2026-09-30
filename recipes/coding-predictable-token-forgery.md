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
A live app ships its own source as the download. It authorizes a sensitive action with
a "security token" that is really a hash of fully predictable inputs — e.g.
`md5(f"<static-prefix>:<item-name>:<unix-timestamp>")`, lowercase hex. Hashing provides
no entropy: every field is a known static string, the item name, or the clock. The
verifier lowercases the submitted token, checks it is 32 chars, then loops the
timestamp over a wide recent window (here ~900s back to a few seconds ahead), so any
token minted from the current clock is accepted and the player never needs the
server's exact second. The player reviews the source, recomputes the hash for the
restricted item (the one marked not-approved), and POSTs it to bypass the approval
step, which returns a phrase; that phrase is submitted to a second gate
(case-insensitive) to release the flag.

## Player solve path
1. Read the shipped source; find the token = hash of a static prefix + item name +
   unix timestamp, and the accept-window loop (~±900s).
2. Identify the restricted item name (approved=false in source/UI) and, optionally, the
   request-created timestamp shown in the app.
3. Recompute `md5("<prefix>:<item>:<ts>")` for that item, using the shown timestamp or
   just the current second (the window covers it).
4. POST the forged token to the approval endpoint → it returns the phrase; submit the
   phrase to the second gate → flag.
