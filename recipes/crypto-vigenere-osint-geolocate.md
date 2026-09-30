---
slug: crypto-vigenere-osint-geolocate
title: Peel back layered classical crypto to coordinates, then OSINT the location
category: Cryptography
source_ctf: Digital Museum: The Archive of a Breach
difficulty: easy
skills: crypto, base64, vigenere, osint, geolocation
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A short ciphertext is wrapped in layers: an encoding (Base64) over a classical cipher
(Vigenère) whose key is a word the accompanying story quietly names ("stamped on
everything"). Decrypting yields geographic coordinates — deliberately spelled out in
*words*, not digits, because a classical cipher passes digits through unchanged and
plaintext digits would skip the cipher entirely. The coordinates aren't the flag; the
player must OSINT them to a real-world landmark and submit that landmark's name to a
small verification gate, which then releases the flag.

## Player solve path
1. Recognize and strip the outer encoding (Base64).
2. Identify the classical cipher and its key from the story's hint; decrypt.
3. Read the coordinates (written as words) and OSINT them to a specific place.
4. Submit the place name to the unlock gate → flag.
