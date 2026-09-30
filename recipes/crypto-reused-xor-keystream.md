---
slug: crypto-reused-xor-keystream
title: Break a reused XOR key across several files with a crib drag
category: Cryptography
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: crypto, xor, many-time-pad, crib-dragging, known-plaintext
box_type: download
status: built
---

## Mechanic (theme-agnostic)
Several files are all XOR-encrypted with the **same** repeating key (a many-time-pad
mistake) and stored as hex. Two clues ship with them: every file begins with a fixed,
known header, and the key must stay identical across records (reuse). The key period
is deliberately longer than that header, so the header known-plaintext recovers only
the first N key bytes — they read as a passphrase cut off mid-word, revealing the
period is longer and leaving the tail unknown. XORing two ciphertexts together cancels
their shared opening to a run of zero bytes that extends well *past* the header length,
proving both the key reuse and a longer shared plaintext prefix — a common status line
that follows the header in every file. Crib-dragging that shared status line as
additional known plaintext extends the recovered key across a full period; the
completed key spells a coherent passphrase (self-validating). XORing the full key
against the classified file decrypts it to an answer, which is submitted to a
verification gate that releases the flag.

## Player solve path
1. Recognize all files share one repeating XOR key: XOR two ciphertexts and see the
   shared opening cancel to leading zeros (count them to gauge the shared-prefix span).
2. Use the fixed header as known plaintext to recover the first N key bytes — they read
   as a passphrase but truncate mid-word, so the period is longer than the header.
3. Crib-drag the status line shared by multiple files (the reason the zero-run ran past
   the header) as further known plaintext to extend the key to its full period; the
   full key reads as a complete passphrase, confirming it.
4. XOR the full key against the classified file → an answer; submit it to the gate →
   flag.
