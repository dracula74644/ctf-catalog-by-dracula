---
slug: mobile-apk-static-secret-chain
title: Decompile an app to decode secrets and beat its timed unlock gate
category: Mobile Security
source_ctf: Breaking CTF
difficulty: medium
skills: mobile, apk, static-analysis, xor, base64, decoys
box_type: download
status: built
---

## Mechanic (theme-agnostic)
The only download is a mobile app package (an APK), and every gate lives inside it — a boot animation, chat screen, a timed identity check, a hidden admin/sysadmin dashboard, and the flag reveal — with the real logic in a bundled web-view front end (the packaged HTML/JavaScript under the app assets). Nothing is solvable by `strings` alone: plain strings contain obvious decoy credentials, while the real secrets are lightly encoded in the JS. Two secrets must be recovered: an identity answer stored as a hex string XORed byte-by-byte with a single-byte key (e.g. `0x13`), and an admin passphrase stored reversed-then-Base64 (reverse the string, then Base64-decode, yielding a `user:pass` pair). The first gate is timed: the app auto-closes after a short window (e.g. 15 seconds) if the identity answer is not submitted, and a wrong answer does not reset the timer. Only after the passphrase unlocks the dashboard is the flag reconstructed from its own encoded form (another single-byte XOR, e.g. key `0x27`), so the flag is never present as plaintext in the package.

## Player solve path
1. Unzip/decompile the app package and open the bundled web-view HTML/JS; ignore the plaintext decoy credentials.
2. Decode the identity answer by XORing its hex bytes with the single-byte key found in the JS.
3. Decode the admin passphrase by reversing its blob and Base64-decoding it (a `user:pass` string).
4. Run the app; get through the boot sequence and submit the identity answer inside the timed window (a wrong answer burns the same clock, so decode first).
5. Open the admin/sysadmin dashboard and submit the passphrase; the app reconstructs the flag from its XOR-encoded form and reveals it.
