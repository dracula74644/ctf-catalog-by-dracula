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
A short ciphertext is wrapped in two layers: an outer Base64 encoding over an inner
classical polyalphabetic cipher (Vigenère). The story quietly names the key — a word
"stamped on everything" (an org/name embedded in the narrative, used verbatim as the
repeating key). Decrypting yields geographic coordinates written out in *words*
("NORTH THREE SEVEN POINT TWO TWO…"), deliberately spelled rather than as digits: a
classical cipher passes digits through unchanged, so plaintext digits would let a
solver skip the cipher — spelling them keeps the Vigenère step essential. The
coordinates aren't the flag; the player must OSINT them to a specific real-world
landmark (the surrounding plaintext also describes it) and submit that landmark's name
to a small verification gate — tolerant of case, spacing, diacritics, and a trailing
city/country — which then releases the flag.

## Player solve path
1. Notice the payload is Base64 and decode it — the output is still uppercase A-Z with
   spaces and punctuation, so it's a classical cipher, not plaintext yet.
2. Identify the repeating-key cipher (Vigenère) and take its key from the story's hint
   (the name stamped everywhere); decrypt.
3. Read the coordinates spelled in words and convert them back to decimal lat/long.
4. OSINT the coordinates on any map service to the specific landmark; submit that
   place name to the unlock gate → flag.
