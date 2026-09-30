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
mistake). One file type has a fixed, known header, which recovers the first N bytes of
the key — but the key is deliberately longer than that header, so the header alone
leaves the tail unknown. Two files that share an identical opening XOR to zero over
that span, proving the key reuse. The player crib-drags a phrase they know appears in
multiple files (a shared status line) to recover the rest of the key; the completed
key reads as a full passphrase (self-validating). Decrypting the classified file
yields an answer submitted to a gate that releases the flag.

## Player solve path
1. Notice all files are XOR'd with one repeating key (XOR two → shared opening cancels).
2. Use the known fixed header as known-plaintext to recover key[:N].
3. Crib-drag a phrase common to several files to extend the key to full length
   (it spells a coherent passphrase — confirms correctness).
4. Decrypt the classified file → an answer; submit to the gate → flag.
