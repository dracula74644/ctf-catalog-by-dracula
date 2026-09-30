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
The only download is a mobile app package; all of the logic (boot flow, login gate, timeout, admin dashboard, flag reveal) lives inside it. The player must decompile/unzip and read the bundled app code (e.g. web-view JS) to recover two encoded secrets: an identity answer (XOR-encoded hex) and an admin passphrase (reverse-then-Base64). Plain strings include obvious decoy credentials. One gate is timed — the identity answer must be entered within a short window, and a wrong answer does not reset it. After the passphrase, the flag is reconstructed from its own encoded (XOR) form, so it is never stored in plaintext.

## Player solve path
1. Unzip/decompile the package; open the bundled app logic and ignore plain decoy creds.
2. Decode the identity secret (XOR the hex) and the admin passphrase (reverse + Base64).
3. Run the app flow; submit the identity answer inside the timed window.
4. Open the admin area, submit the passphrase; the flag is decoded from its XOR form.
