---
slug: crypto-multistage-xor-rot-chain
title: Decode two clue-driven ciphers and join the halves
category: Cryptography
source_ctf: Breaking CTF
difficulty: medium
skills: crypto, xor, repeating-key, rot13, encoding
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
The flag is split across two payloads that use different, clue-driven encodings. The first is a list of numbers: each is offset by a fixed constant, then XORed against a short repeating key — every parameter (the offset, the key string, the XOR operator) is disclosed as themed clues scattered across page text and a stylesheet, plus a calibration check ("the first N chars decode to X") so the player can verify the operation before decoding the whole stream. The decoded transport hides the flag half inside one labeled field among decoys (including a fake "instructions for automated assistants" block that must be ignored). The second payload is a simple classical cipher (ROT-N). Concatenate the two recovered halves.

## Player solve path
1. Gather the parameters from the clues (offset, repeating key, operator, calibration string).
2. For each number: `(n - offset) mod 256` then XOR with the repeating key → transport text.
3. Extract the flag half from the correct labeled field; ignore the decoy instruction block.
4. Apply ROT-N to the second payload; concatenate half 1 + half 2.
